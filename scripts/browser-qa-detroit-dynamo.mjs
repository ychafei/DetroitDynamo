import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { detroitDynamoAllRoutePaths } from '../src/lib/detroitDynamoRouteManifest.js';
import { detroitDynamoAdminModuleDetailRoutes } from '../src/lib/detroitDynamoDataModel.js';

const root = process.cwd();
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
const artifactDir = path.join(root, 'artifacts/detroit-dynamo/browser-qa');
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const failures = [];

const currentSitePaths = [
  '/',
  '/admin',
  '/admin/detroit-dynamo',
  '/about',
  '/apply',
  '/blog',
  '/book',
  '/coach',
  '/dashboard',
  '/lcfc',
  '/login',
  '/privacy',
  '/signup',
  '/team',
  '/terms',
  '/unsubscribe',
];
const allowedInternalPaths = new Set([
  ...currentSitePaths,
  ...detroitDynamoAllRoutePaths,
  ...detroitDynamoAdminModuleDetailRoutes,
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', () => resolve(true)));
  child.kill('SIGTERM');
  const stopped = await Promise.race([
    exited,
    sleep(2000).then(() => false),
  ]);
  if (!stopped) {
    child.kill('SIGKILL');
    await Promise.race([
      exited,
      sleep(1000),
    ]);
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForJson(url, timeoutMs = 10000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(150);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CdpSession {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Map();
    this.opened = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject, timer } = this.pending.get(message.id);
        clearTimeout(timer);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(`${message.error.message}: ${JSON.stringify(message.error.data || {})}`));
        } else {
          resolve(message.result || {});
        }
        return;
      }

      const handlers = this.handlers.get(message.method);
      if (!handlers) return;
      for (const handler of handlers) handler(message.params || {});
    });

    this.ws.addEventListener('close', () => {
      for (const { reject, timer } of this.pending.values()) {
        clearTimeout(timer);
        reject(new Error('CDP socket closed'));
      }
      this.pending.clear();
    });
  }

  static async connect(wsUrl) {
    const session = new CdpSession(wsUrl);
    await session.opened;
    return session;
  }

  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, new Set());
    this.handlers.get(method).add(handler);
    return () => this.handlers.get(method)?.delete(handler);
  }

  waitFor(method, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const off = this.on(method, (params) => {
        clearTimeout(timer);
        off();
        resolve(params);
      });
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
    });
  }

  send(method, params = {}, timeoutMs = 15000) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timed out running ${method}`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws.readyState === 3) return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, 500);
      this.ws.addEventListener('close', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.close();
    });
  }
}

async function createTarget(port) {
  const encoded = encodeURIComponent('about:blank');
  let response = await fetch(`http://127.0.0.1:${port}/json/new?${encoded}`, { method: 'PUT' });
  if (!response.ok) {
    response = await fetch(`http://127.0.0.1:${port}/json/new?${encoded}`);
  }
  if (!response.ok) throw new Error(`Could not create Chrome target: HTTP ${response.status}`);
  return response.json();
}

async function closeTarget(port, id) {
  try {
    await fetch(`http://127.0.0.1:${port}/json/close/${id}`);
  } catch {
    // Best-effort cleanup only.
  }
}

function cleanErrorMessage(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function evaluate(session, expression, timeoutMs = 10000) {
  const result = await session.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  }, timeoutMs);

  if (result.exceptionDetails) {
    const text = result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime.evaluate failed';
    throw new Error(text);
  }

  return result.result?.value;
}

async function waitForExpression(session, expression, timeoutMs = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const value = await evaluate(session, `Boolean(${expression})`).catch(() => false);
    if (value) return true;
    await sleep(150);
  }
  return false;
}

function installErrorCollectors(session, route) {
  const consoleErrors = [];
  const push = (kind, message, url = '') => {
    consoleErrors.push({
      kind,
      level: 'error',
      message: cleanErrorMessage(message),
      route,
      timestamp: new Date().toISOString(),
      url,
    });
  };

  session.on('Runtime.consoleAPICalled', (params) => {
    if (params.type !== 'error') return;
    const message = (params.args || [])
      .map((arg) => arg.description || arg.value || arg.unserializableValue || '')
      .filter(Boolean)
      .join(' ');
    push('console', message, params.stackTrace?.callFrames?.[0]?.url || '');
  });

  session.on('Runtime.exceptionThrown', (params) => {
    const details = params.exceptionDetails || {};
    push('exception', details.exception?.description || details.text, details.url || '');
  });

  session.on('Log.entryAdded', (params) => {
    const entry = params.entry || {};
    if (entry.level !== 'error') return;
    push('log', entry.text, entry.url || '');
  });

  return consoleErrors;
}

async function openPage(port, route, size) {
  const target = await createTarget(port);
  const session = await CdpSession.connect(target.webSocketDebuggerUrl);
  const consoleErrors = installErrorCollectors(session, route);

  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await session.send('Log.enable');
  await session.send('Network.enable');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: size.width,
    height: size.height,
    deviceScaleFactor: 1,
    mobile: size.width < 700,
  });

  const loaded = session.waitFor('Page.loadEventFired', 12000).catch(() => null);
  await session.send('Page.navigate', { url: new URL(route, baseUrl).toString() });
  await loaded;
  await waitForExpression(session, 'document.readyState !== "loading" && document.getElementById("root")', 12000);
  await sleep(1200);

  return { target, session, consoleErrors };
}

async function captureScreenshot(session, filename) {
  const result = await session.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  }, 30000);
  const filePath = path.join(artifactDir, filename);
  await fs.writeFile(filePath, Buffer.from(result.data, 'base64'));
  return filePath;
}

async function collectPageMetrics(session) {
  return evaluate(session, `(() => {
    const text = document.body.innerText || '';
    const hasLcLogo = Array.from(document.querySelectorAll('img,svg,[aria-label]')).some((node) => {
      const alt = node.getAttribute('alt') || '';
      const aria = node.getAttribute('aria-label') || '';
      return /LC Training|Les Chevres|Les Ch[eè]vres|goat/i.test(alt + ' ' + aria);
    });
    return {
      bodyScrollWidth: document.body.scrollWidth,
      hasDynamoHeader: Boolean(document.querySelector('.dynamo-site header')),
      hasDynamoShell: Boolean(document.querySelector('.dynamo-site')),
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      hasLcLogo,
      meta: {
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
        ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '',
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
        twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
      },
      pathname: window.location.pathname,
      scrollWidth: document.documentElement.scrollWidth,
      textSignals: {
        bookTraining: /Book Training|Book Player Evaluation|Request Training Info/i.test(text),
        contentProofBoard: /Content Proof Board|Proof Required Before Publishing/i.test(text),
        countyBookingContext: /County Interest|Oakland County|future Training Director \\/ Booking workflow/i.test(text),
        programBookingContext: /Program Interest/i.test(text)
          && /Team training/i.test(text)
          && /Training focus:\\s*Team Training/i.test(text),
        tryoutTeamContext: /Team Interest/i.test(text)
          && /Senior Women['’]s Team/i.test(text)
          && /future registrar queue/i.test(text),
        sponsorPackageContext: /Sponsor Package Interest/i.test(text)
          && /Founding Sponsor/i.test(text)
          && /future partnerships queue/i.test(text),
        campClinicContext: /Clinic Interest/i.test(text)
          && /Goalkeeper Training/i.test(text)
          && /future Training Director \\/ Camp workflow/i.test(text),
        contactTopicContext: /Inquiry Topic/i.test(text)
          && /Sponsor Inquiry/i.test(text)
          && /future ContactLead queue/i.test(text),
        youthAgeGroupContext: /Age Group Interest/i.test(text)
          && /U9-U12 Pre-Academy/i.test(text)
          && /future registrar queue/i.test(text),
        currentSite: /Current Booking Flow|current LC Training/i.test(text),
        detroitDynamo: /Detroit Dynamo/i.test(text),
        externalConfirmationWorkflow: /External Confirmation Action Queue/i.test(text)
          && /Publications Unlocked/i.test(text)
          && /detroit-dynamo-external-confirmation-actions\\.md/i.test(text),
        lcTraining: /LC Training|Les Ch[eè]vres/i.test(text),
        leadPipeline: /Follow-Up Status Policy|Lead Pipeline/i.test(text),
        moduleActionGuard: /First Admin Action Contract|Action Guards/i.test(text),
        moduleDataTargets: /Data Targets/i.test(text),
        modulePermissions: /Module Permissions/i.test(text),
        ownerLaunchReview: /Owner Launch Review Packet/i.test(text)
          && /No-Go:\\s*Preview Only/i.test(text)
          && /detroit-dynamo-owner-launch-review\\.md/i.test(text),
        ownerEvidenceIntake: /Owner Evidence Intake Worksheet/i.test(text)
          && /detroit-dynamo-owner-evidence-intake\\.md/i.test(text)
          && /Rows/i.test(text),
        productionPreviewEvidence: /Production Preview Evidence Matrix/i.test(text)
          && /detroit-dynamo-production-preview-evidence\\.md/i.test(text)
          && /Public Forms/i.test(text),
        liveReadinessBoard: /Live Readiness Board/i.test(text)
          && /detroit-dynamo-live-readiness-board\\.md/i.test(text)
          && /No-Go:\\s*Preview Only/i.test(text),
        signInRequired: /Sign In Required/i.test(text),
      },
      title: document.title,
      width: window.innerWidth,
    };
  })()`);
}

async function collectInteractionAudit(session) {
  return evaluate(session, `(() => {
    const isVisible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && Number(style.opacity || 1) > 0;
    };

    const anchors = Array.from(document.querySelectorAll('a')).map((element) => {
      const rawHref = element.getAttribute('href') || '';
      let normalized = rawHref;
      try {
        normalized = rawHref ? new URL(rawHref, window.location.href).href : '';
      } catch {
        normalized = rawHref;
      }
      return {
        href: rawHref,
        normalizedHref: normalized,
        text: (element.innerText || element.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim(),
        ariaLabel: element.getAttribute('aria-label') || '',
        target: element.getAttribute('target') || '',
        visible: isVisible(element),
      };
    });

    const buttons = Array.from(document.querySelectorAll('button')).map((element) => ({
      ariaControls: element.getAttribute('aria-controls') || '',
      ariaExpanded: element.getAttribute('aria-expanded') || '',
      ariaLabel: element.getAttribute('aria-label') || '',
      disabled: element.disabled,
      formId: element.form?.id || '',
      inForm: Boolean(element.closest('form')),
      text: (element.innerText || element.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim(),
      type: element.getAttribute('type') || 'submit',
      visible: isVisible(element),
    }));

    return { anchors, buttons };
  })()`);
}

async function visitRoute(port, route, size, screenshotName) {
  const page = await openPage(port, route, size);
  try {
    const metrics = await collectPageMetrics(page.session);
    const interactions = await collectInteractionAudit(page.session);
    const screenshot = await captureScreenshot(page.session, screenshotName);
    return {
      route,
      size,
      screenshot,
      metrics,
      interactions,
      consoleErrorCount: page.consoleErrors.length,
      consoleErrors: page.consoleErrors,
    };
  } finally {
    await page.session.close();
    await closeTarget(port, page.target.id);
  }
}

async function auditRoute(port, route, size) {
  const page = await openPage(port, route, size);
  try {
    const metrics = await collectPageMetrics(page.session);
    const interactions = await collectInteractionAudit(page.session);
    return {
      route,
      size,
      screenshot: null,
      metrics,
      interactions,
      consoleErrorCount: page.consoleErrors.length,
      consoleErrors: page.consoleErrors,
      auditOnly: true,
    };
  } finally {
    await page.session.close();
    await closeTarget(port, page.target.id);
  }
}

function formFillExpression(fields) {
  return `(() => {
    const fields = ${JSON.stringify(fields)};
    const setValue = (selector, value) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error('Missing form control: ' + selector);
      const proto = element.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : element.tagName === 'SELECT'
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    for (const [selector, value] of Object.entries(fields)) setValue(selector, value);
    return true;
  })()`;
}

function formControlsReadyExpression(fields) {
  return `(() => {
    const selectors = ${JSON.stringify(Object.keys(fields))};
    return selectors.every((selector) => Boolean(document.querySelector(selector)));
  })()`;
}

async function submitCurrentForm(session) {
  await evaluate(session, `(() => {
    const button = document.querySelector('form button[type="submit"]');
    if (!button) throw new Error('Missing submit button');
    button.click();
    return true;
  })()`);
}

async function collectSuccessMetrics(session) {
  return evaluate(session, `(() => {
    const text = document.body.innerText || '';
    const hasLcLogo = Array.from(document.querySelectorAll('img,svg,[aria-label]')).some((node) => {
      const alt = node.getAttribute('alt') || '';
      const aria = node.getAttribute('aria-label') || '';
      return /LC Training|Les Chevres|Les Ch[eè]vres|goat/i.test(alt + ' ' + aria);
    });
    const invalidControls = Array.from(document.querySelectorAll('[aria-invalid="true"]'));
    const describedInvalidControls = invalidControls.filter((control) => {
      const describedBy = (control.getAttribute('aria-describedby') || '').split(/\\s+/).filter(Boolean);
      return describedBy.some((id) => {
        const description = document.getElementById(id);
        return description && /required|valid|characters|phone|email/i.test(description.innerText || '');
      });
    });
    const alertTexts = Array.from(document.querySelectorAll('[role="alert"]')).map((node) => node.innerText || '');
    const statusTexts = Array.from(document.querySelectorAll('[role="status"]')).map((node) => node.innerText || '');
    return {
      bodyScrollWidth: document.body.scrollWidth,
      fieldErrorAlertVisible: alertTexts.some((line) => /Enter a valid 10-digit phone number/i.test(line)),
      hasDynamoHeader: Boolean(document.querySelector('.dynamo-site header')),
      hasDynamoShell: Boolean(document.querySelector('.dynamo-site')),
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      hasLcLogo,
      invalidControlDescribedByError: describedInvalidControls.length > 0,
      invalidControlHasAriaInvalid: invalidControls.length > 0,
      meta: {
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
        ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '',
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
        twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
      },
      pathname: window.location.pathname,
      referenceVisible: /Reference:\\s*dd-lead-/i.test(text),
      scrollWidth: document.documentElement.scrollWidth,
      storageErrorAlertVisible: alertTexts.some((line) => /could not store the submission locally/i.test(line)),
      storageErrorVisible: /could not store the submission locally/i.test(text),
      successStatusVisible: statusTexts.some((line) => /Submission Captured/i.test(line)),
      successVisible: /Submission Captured/i.test(text),
      validationErrorVisible: /Enter a valid 10-digit phone number/i.test(text),
      textSignals: {
        bookTraining: /Book Training|Book Player Evaluation|Request Training Info/i.test(text),
        countyBookingContext: /County Interest|Oakland County|future Training Director \\/ Booking workflow/i.test(text),
        programBookingContext: /Program Interest/i.test(text)
          && /Team training/i.test(text)
          && /Training focus:\\s*Team Training/i.test(text),
        tryoutTeamContext: /Team Interest/i.test(text)
          && /Senior Women['’]s Team/i.test(text)
          && /future registrar queue/i.test(text),
        sponsorPackageContext: /Sponsor Package Interest/i.test(text)
          && /Founding Sponsor/i.test(text)
          && /future partnerships queue/i.test(text),
        campClinicContext: /Clinic Interest/i.test(text)
          && /Goalkeeper Training/i.test(text)
          && /future Training Director \\/ Camp workflow/i.test(text),
        contactTopicContext: /Inquiry Topic/i.test(text)
          && /Sponsor Inquiry/i.test(text)
          && /future ContactLead queue/i.test(text),
        youthAgeGroupContext: /Age Group Interest/i.test(text)
          && /U9-U12 Pre-Academy/i.test(text)
          && /future registrar queue/i.test(text),
        currentSite: /Current Booking Flow|current LC Training/i.test(text),
        detroitDynamo: /Detroit Dynamo/i.test(text),
        externalConfirmationWorkflow: /External Confirmation Action Queue/i.test(text)
          && /Publications Unlocked/i.test(text)
          && /detroit-dynamo-external-confirmation-actions\\.md/i.test(text),
        lcTraining: /LC Training|Les Ch[eè]vres/i.test(text),
        leadPipeline: /Follow-Up Status Policy|Lead Pipeline/i.test(text),
        moduleActionGuard: /First Admin Action Contract|Action Guards/i.test(text),
        moduleDataTargets: /Data Targets/i.test(text),
        modulePermissions: /Module Permissions/i.test(text),
        ownerLaunchReview: /Owner Launch Review Packet/i.test(text)
          && /No-Go:\\s*Preview Only/i.test(text)
          && /detroit-dynamo-owner-launch-review\\.md/i.test(text),
        ownerEvidenceIntake: /Owner Evidence Intake Worksheet/i.test(text)
          && /detroit-dynamo-owner-evidence-intake\\.md/i.test(text)
          && /Rows/i.test(text),
        productionPreviewEvidence: /Production Preview Evidence Matrix/i.test(text)
          && /detroit-dynamo-production-preview-evidence\\.md/i.test(text)
          && /Public Forms/i.test(text),
        liveReadinessBoard: /Live Readiness Board/i.test(text)
          && /detroit-dynamo-live-readiness-board\\.md/i.test(text)
          && /No-Go:\\s*Preview Only/i.test(text),
        signInRequired: /Sign In Required/i.test(text),
      },
      title: document.title,
      width: window.innerWidth,
    };
  })()`);
}

const leadFormSubmissions = [
  {
    label: 'training',
    route: '/detroit-dynamo/book',
    screenshot: 'training-success.png',
    fields: {
      '#training-contact-name': 'Alex Rivera',
      '#training-email': 'alex@example.com',
      '#training-phone': '3135550144',
      '#training-program': 'Private training',
      '#training-notes': 'Looking for a technical evaluation and finishing plan.',
    },
  },
  {
    label: 'youth',
    route: '/detroit-dynamo/youth-club',
    screenshot: 'youth-success.png',
    fields: {
      '#youth-player-name': 'Mia Test',
      '#youth-dob': '2014-09-18',
      '#youth-guardian': 'Taylor Parent',
      '#youth-team-interest': 'Youth Club',
      '#youth-position': 'Forward',
      '#youth-club': 'Detroit Area Club',
      '#youth-experience': 'Developing',
      '#youth-email': 'youth-parent@example.com',
      '#youth-phone': '3135550155',
      '#youth-age-group': 'U9-U12 Pre-Academy',
      '#youth-notes': 'Interested in the first youth development cohort.',
    },
  },
  {
    label: 'tryout',
    route: '/detroit-dynamo/tryouts',
    screenshot: 'tryout-success.png',
    fields: {
      '#tryout-player-name': 'Jordan Test',
      '#tryout-dob': '2010-04-12',
      '#tryout-guardian': 'Morgan Parent',
      '#tryout-team-interest': 'Youth Club',
      '#tryout-position': 'Midfielder',
      '#tryout-club': 'Detroit Area Club',
      '#tryout-experience': 'Club',
      '#tryout-email': 'parent@example.com',
      '#tryout-phone': '3135550198',
      '#tryout-notes': 'Interested in a future competitive pathway.',
    },
  },
  {
    label: 'men',
    route: '/detroit-dynamo/senior-men',
    screenshot: 'men-success.png',
    fields: {
      '#men-player-name': 'Marcus Trialist',
      '#men-dob': '2002-01-22',
      '#men-team-interest': "Senior Men's Team",
      '#men-position': 'Defender',
      '#men-club': 'College club program',
      '#men-experience': 'College',
      '#men-email': 'men-player@example.com',
      '#men-phone': '3135550112',
      '#men-notes': 'Interested in future senior men tryout communications.',
    },
  },
  {
    label: 'women',
    route: '/detroit-dynamo/senior-women',
    screenshot: 'women-success.png',
    fields: {
      '#women-player-name': 'Avery Trialist',
      '#women-dob': '2001-07-03',
      '#women-team-interest': "Senior Women's Team",
      '#women-position': 'Midfielder',
      '#women-club': 'College club program',
      '#women-experience': 'College',
      '#women-email': 'women-player@example.com',
      '#women-phone': '3135550123',
      '#women-notes': 'Interested in future senior women tryout communications.',
    },
  },
  {
    label: 'sponsor',
    route: '/detroit-dynamo/sponsors',
    screenshot: 'sponsor-success.png',
    fields: {
      '#sponsor-contact-name': 'Casey Partner',
      '#sponsor-email': 'partner@example.com',
      '#sponsor-phone': '3135550177',
      '#sponsor-organization': 'Detroit Test Business',
      '#sponsor-package': 'Founding Sponsor',
      '#sponsor-notes': 'Interested in founding sponsor inventory when approved.',
    },
  },
  {
    label: 'contact',
    route: '/detroit-dynamo/contact',
    screenshot: 'contact-success.png',
    fields: {
      '#contact-contact-name': 'Riley Contact',
      '#contact-email': 'contact@example.com',
      '#contact-phone': '3135550188',
      '#contact-program': 'Small-group training',
      '#contact-notes': 'General question about the Detroit Dynamo pathway.',
    },
  },
];

async function submitLeadForm(port, submission) {
  const route = `${submission.route} ${submission.label} submit`;
  const page = await openPage(port, submission.route, { width: 390, height: 844 });
  try {
    const controlsReady = await waitForExpression(page.session, formControlsReadyExpression(submission.fields), 10000);
    assertResult(controlsReady, `Form controls did not render before submit: ${route}`);
    await evaluate(page.session, formFillExpression(submission.fields));
    await sleep(200);
    await submitCurrentForm(page.session);
    const success = await waitForExpression(page.session, '/Submission Captured/i.test(document.body.innerText || "")', 5000);
    const metrics = await collectSuccessMetrics(page.session);
    metrics.successVisible = metrics.successVisible || success;
    const interactions = await collectInteractionAudit(page.session);
    const screenshot = await captureScreenshot(page.session, submission.screenshot);
    return {
      route,
      formLabel: submission.label,
      size: { width: 390, height: 844 },
      screenshot,
      metrics,
      interactions,
      consoleErrorCount: page.consoleErrors.length,
      consoleErrors: page.consoleErrors,
    };
  } finally {
    await page.session.close();
    await closeTarget(port, page.target.id);
  }
}

async function submitInvalidTryoutForm(port) {
  const route = '/detroit-dynamo/tryouts validation';
  const page = await openPage(port, '/detroit-dynamo/tryouts', { width: 390, height: 844 });
  try {
    const fields = {
      '#tryout-player-name': 'Jordan Validation',
      '#tryout-dob': '2010-04-12',
      '#tryout-guardian': 'Morgan Parent',
      '#tryout-team-interest': 'Youth Club',
      '#tryout-position': 'Midfielder',
      '#tryout-club': 'Detroit Area Club',
      '#tryout-experience': 'Club',
      '#tryout-email': 'parent-validation@example.com',
      '#tryout-phone': '123',
      '#tryout-notes': 'This should stay on the form and show validation feedback.',
    };
    const controlsReady = await waitForExpression(page.session, formControlsReadyExpression(fields), 10000);
    assertResult(controlsReady, `Form controls did not render before submit: ${route}`);
    await evaluate(page.session, formFillExpression(fields));
    await sleep(200);
    await submitCurrentForm(page.session);
    const validation = await waitForExpression(page.session, '/Enter a valid 10-digit phone number/i.test(document.body.innerText || "")', 5000);
    const metrics = await collectSuccessMetrics(page.session);
    metrics.validationErrorVisible = metrics.validationErrorVisible || validation;
    const interactions = await collectInteractionAudit(page.session);
    const screenshot = await captureScreenshot(page.session, 'tryout-validation-error.png');
    return {
      route,
      formProbe: 'validation',
      size: { width: 390, height: 844 },
      screenshot,
      metrics,
      interactions,
      consoleErrorCount: page.consoleErrors.length,
      consoleErrors: page.consoleErrors,
    };
  } finally {
    await page.session.close();
    await closeTarget(port, page.target.id);
  }
}

async function submitStorageErrorForm(port) {
  const route = '/detroit-dynamo/contact storage-error';
  const page = await openPage(port, '/detroit-dynamo/contact', { width: 390, height: 844 });
  try {
    await evaluate(page.session, `(() => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItemWithDynamoLeadFailure(key, value) {
        if (key === 'detroit-dynamo-preview-leads') {
          throw new Error('Simulated Detroit Dynamo preview lead storage failure');
        }
        return originalSetItem.call(this, key, value);
      };
      return true;
    })()`);
    const fields = {
      '#contact-contact-name': 'Riley Error',
      '#contact-email': 'contact-error@example.com',
      '#contact-phone': '3135550189',
      '#contact-program': 'Small-group training',
      '#contact-notes': 'This should show the polished storage error state.',
    };
    const controlsReady = await waitForExpression(page.session, formControlsReadyExpression(fields), 10000);
    assertResult(controlsReady, `Form controls did not render before submit: ${route}`);
    await evaluate(page.session, formFillExpression(fields));
    await sleep(200);
    await submitCurrentForm(page.session);
    const storageError = await waitForExpression(page.session, '/could not store the submission locally/i.test(document.body.innerText || "")', 5000);
    const metrics = await collectSuccessMetrics(page.session);
    metrics.storageErrorVisible = metrics.storageErrorVisible || storageError;
    const interactions = await collectInteractionAudit(page.session);
    const screenshot = await captureScreenshot(page.session, 'contact-storage-error.png');
    return {
      route,
      formProbe: 'storage-error',
      size: { width: 390, height: 844 },
      screenshot,
      metrics,
      interactions,
      consoleErrorCount: page.consoleErrors.length,
      consoleErrors: page.consoleErrors,
    };
  } finally {
    await page.session.close();
    await closeTarget(port, page.target.id);
  }
}

function assertResult(condition, message) {
  if (!condition) failures.push(message);
}

function validateResults(results) {
  for (const result of results) {
    assertResult(result.consoleErrorCount === 0, `${result.route} produced ${result.consoleErrorCount} console error(s)`);
    assertResult(!result.metrics.hasHorizontalOverflow, `${result.route} has horizontal overflow`);
  }

  const homeDesktop = results.find((result) => result.route === '/detroit-dynamo' && result.size.width === 1440);
  const homeMobile = results.find((result) => result.route === '/detroit-dynamo' && result.size.width === 390);
  const lcHome = results.find((result) => result.route === '/');
  const lcBook = results.find((result) => result.route === '/book');
  const countyBooking = results.find((result) => result.route === '/detroit-dynamo/book?county=Oakland#training-interest');
  const programBooking = results.find((result) => result.route === '/detroit-dynamo/book?program=Team%20training&focus=Team%20Training#training-interest');
  const teamTryout = results.find((result) => result.route === '/detroit-dynamo/tryouts?team=Senior%20Women%27s%20Team#tryout-form');
  const sponsorPackage = results.find((result) => result.route === '/detroit-dynamo/sponsors?package=Founding%20Sponsor#sponsor-inquiry');
  const campClinic = results.find((result) => result.route === '/detroit-dynamo/camps-clinics?clinic=Goalkeeper%20Training#camp-interest');
  const contactTopic = results.find((result) => result.route === '/detroit-dynamo/contact?topic=Sponsor%20Inquiry#contact-form');
  const youthAgeGroup = results.find((result) => result.route === '/detroit-dynamo/youth-club?ageGroup=U9-U12%20Pre-Academy#youth-interest');
  const leadSubmissions = results.filter((result) => result.formLabel);
  const validationProbe = results.find((result) => result.formProbe === 'validation');
  const storageErrorProbe = results.find((result) => result.formProbe === 'storage-error');
  const adminFoundation = results.find((result) => result.route === '/detroit-dynamo/admin-foundation');
  const adminModuleDetails = results.filter((result) => result.route.startsWith('/admin/detroit-dynamo/modules/'));

  for (const result of [homeDesktop, homeMobile]) {
    assertResult(result?.metrics.hasDynamoShell, `${result?.route || 'Dynamo home'} is missing .dynamo-site shell`);
    assertResult(result?.metrics.hasDynamoHeader, `${result?.route || 'Dynamo home'} is missing Dynamo header`);
    assertResult(result?.metrics.hasLcLogo === false, `${result?.route || 'Dynamo home'} leaked LC/goat logo signals`);
    assertResult(result?.metrics.textSignals.contentProofBoard === true, `${result?.route || 'Dynamo home'} is missing content proof board`);
  }

  for (const result of results.filter((item) => item.route.startsWith('/detroit-dynamo'))) {
    assertResult(result.metrics.hasDynamoShell, `${result.route} is missing .dynamo-site shell`);
    assertResult(result.metrics.hasDynamoHeader, `${result.route} is missing Dynamo header`);
    assertResult(result.metrics.hasLcLogo === false, `${result.route} leaked LC/goat logo signals`);
    assertResult(result.metrics.textSignals.detroitDynamo === true, `${result.route} is missing Detroit Dynamo text signal`);
    assertResult(result.metrics.meta.robots === 'index,follow', `${result.route} is missing public index/follow metadata`);
    assertResult(result.metrics.meta.ogTitle.includes('Detroit Dynamo'), `${result.route} is missing Detroit Dynamo Open Graph title`);
    assertResult(result.metrics.meta.ogDescription.length > 40, `${result.route} is missing a useful Open Graph description`);
    assertResult(result.metrics.meta.ogImage.includes('/detroit-dynamo/logo-primary.png'), `${result.route} is missing the Detroit Dynamo Open Graph image`);
    assertResult(result.metrics.meta.ogType === 'website', `${result.route} is missing Open Graph website type`);
    assertResult(result.metrics.meta.ogUrl.includes('/detroit-dynamo'), `${result.route} is missing Detroit Dynamo Open Graph URL`);
    assertResult(result.metrics.meta.twitterCard === 'summary_large_image', `${result.route} is missing summary_large_image Twitter card metadata`);
    assertResult(result.metrics.meta.twitterTitle.includes('Detroit Dynamo'), `${result.route} is missing Detroit Dynamo Twitter title`);
    assertResult(result.metrics.meta.twitterDescription.length > 40, `${result.route} is missing a useful Twitter description`);
    assertResult(result.metrics.meta.twitterImage.includes('/detroit-dynamo/logo-primary.png'), `${result.route} is missing the Detroit Dynamo Twitter image`);
    assertResult(result.metrics.meta.canonical.includes('/detroit-dynamo'), `${result.route} is missing a Detroit Dynamo canonical URL`);
  }

  assertResult(lcHome?.metrics.hasDynamoShell === true, '/ should render the Detroit Dynamo shell after promotion');
  assertResult(lcHome?.metrics.textSignals.detroitDynamo === true, '/ should retain Detroit Dynamo text signals');
  assertResult(lcHome?.metrics.meta.ogImage.includes('/detroit-dynamo/'), '/ should use Detroit Dynamo social image metadata');
  assertResult(lcBook?.metrics.textSignals.detroitDynamo === true, '/book should retain Detroit Dynamo text signals');
  assertResult(lcBook?.metrics.hasLcLogo === false, '/book leaked LC/goat logo signals');
  assertResult(countyBooking?.metrics.textSignals.countyBookingContext === true, 'County booking preview did not preserve Oakland County context');
  assertResult(programBooking?.metrics.textSignals.programBookingContext === true, 'Program booking preview did not preserve Team Training context');
  assertResult(teamTryout?.metrics.textSignals.tryoutTeamContext === true, "Tryout registration did not preserve Senior Women's Team context");
  assertResult(sponsorPackage?.metrics.textSignals.sponsorPackageContext === true, 'Sponsor inquiry did not preserve Founding Sponsor context');
  assertResult(campClinic?.metrics.textSignals.campClinicContext === true, 'Camp/clinic inquiry did not preserve Goalkeeper Training context');
  assertResult(contactTopic?.metrics.textSignals.contactTopicContext === true, 'Contact inquiry did not preserve Sponsor Inquiry context');
  assertResult(youthAgeGroup?.metrics.textSignals.youthAgeGroupContext === true, 'Youth Club inquiry did not preserve U9-U12 Pre-Academy context');
  assertResult(leadSubmissions.length === leadFormSubmissions.length, `Expected ${leadFormSubmissions.length} submitted lead forms, found ${leadSubmissions.length}`);
  for (const submission of leadFormSubmissions) {
    const result = leadSubmissions.find((item) => item.formLabel === submission.label);
    assertResult(result?.metrics.successVisible, `${submission.label} form did not render success state`);
    assertResult(result?.metrics.successStatusVisible, `${submission.label} form success state is missing role=status`);
    assertResult(result?.metrics.referenceVisible, `${submission.label} form did not render a lead reference`);
  }
  assertResult(validationProbe?.metrics.validationErrorVisible, 'Tryout validation probe did not render phone validation feedback');
  assertResult(validationProbe?.metrics.fieldErrorAlertVisible, 'Tryout validation probe did not expose field error with role=alert');
  assertResult(validationProbe?.metrics.invalidControlHasAriaInvalid, 'Tryout validation probe did not mark invalid controls with aria-invalid');
  assertResult(validationProbe?.metrics.invalidControlDescribedByError, 'Tryout validation probe did not connect invalid controls to error text');
  assertResult(validationProbe?.metrics.successVisible === false, 'Tryout validation probe should not render success state');
  assertResult(storageErrorProbe?.metrics.storageErrorVisible, 'Contact storage-error probe did not render polished storage error feedback');
  assertResult(storageErrorProbe?.metrics.storageErrorAlertVisible, 'Contact storage-error probe did not expose submit error with role=alert');
  assertResult(storageErrorProbe?.metrics.successVisible === false, 'Contact storage-error probe should not render success state');
  assertResult(adminFoundation?.metrics.textSignals.moduleActionGuard === true, '/detroit-dynamo/admin-foundation is missing public action guard planning content');
  assertResult(adminFoundation?.metrics.textSignals.leadPipeline === true, '/detroit-dynamo/admin-foundation is missing public lead pipeline planning content');
  assertResult(adminFoundation?.metrics.textSignals.externalConfirmationWorkflow === true, '/detroit-dynamo/admin-foundation is missing external confirmation action workflow content');
  assertResult(adminFoundation?.metrics.textSignals.ownerLaunchReview === true, '/detroit-dynamo/admin-foundation is missing owner launch review packet content');
  assertResult(adminFoundation?.metrics.textSignals.ownerEvidenceIntake === true, '/detroit-dynamo/admin-foundation is missing owner evidence intake worksheet content');
  assertResult(adminFoundation?.metrics.textSignals.productionPreviewEvidence === true, '/detroit-dynamo/admin-foundation is missing production-preview evidence matrix content');
  assertResult(adminFoundation?.metrics.textSignals.liveReadinessBoard === true, '/detroit-dynamo/admin-foundation is missing live readiness board content');
  assertResult(
    adminModuleDetails.length === detroitDynamoAdminModuleDetailRoutes.length,
    `Expected ${detroitDynamoAdminModuleDetailRoutes.length} admin module detail routes in browser QA, found ${adminModuleDetails.length}`,
  );
  for (const result of adminModuleDetails) {
    assertResult(result.metrics.hasDynamoShell === false, `${result.route} should stay out of the public Dynamo shell while protected`);
    assertResult(result.metrics.textSignals.signInRequired === true, `${result.route} should render the admin sign-in guard when unauthenticated`);
  }

  validateRenderedInteractions(results);
}

function normalizeInternalPath(href) {
  const parsed = new URL(href, baseUrl);
  return parsed.pathname;
}

function validateRenderedInteractions(results) {
  for (const result of results) {
    for (const anchor of result.interactions?.anchors || []) {
      if (!anchor.visible) continue;

      const label = anchor.text || anchor.ariaLabel;
      assertResult(Boolean(label), `${result.route} has a visible link without text or aria-label: ${anchor.href || '(empty)'}`);
      assertResult(Boolean(anchor.href), `${result.route} has a visible link without href: ${label || '(unlabeled)'}`);
      assertResult(anchor.href !== '#', `${result.route} has a placeholder # link: ${label}`);
      assertResult(!/^javascript:/i.test(anchor.href), `${result.route} has a javascript: link: ${label}`);

      if (!anchor.href || anchor.href === '#' || /^javascript:/i.test(anchor.href)) continue;
      if (/^(mailto|tel):/i.test(anchor.href)) continue;

      const parsed = new URL(anchor.normalizedHref, baseUrl);
      if (parsed.origin !== new URL(baseUrl).origin) {
        assertResult(/^https?:$/.test(parsed.protocol), `${result.route} has unsupported external link protocol: ${anchor.href}`);
        continue;
      }

      const pathOnly = normalizeInternalPath(anchor.normalizedHref);
      const dynamicAllowed = pathOnly.startsWith('/coaches/');
      assertResult(
        allowedInternalPaths.has(pathOnly) || dynamicAllowed,
        `${result.route} has an internal link outside the verified route map: ${anchor.href}`,
      );
    }

    for (const button of result.interactions?.buttons || []) {
      if (!button.visible) continue;
      const label = button.text || button.ariaLabel;
      assertResult(Boolean(label), `${result.route} has a visible button without text or aria-label`);
    }
  }
}

async function main() {
  await fs.access(chromePath);
  await fetch(baseUrl);
  await fs.mkdir(artifactDir, { recursive: true });

  const port = await getFreePort();
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dynamo-browser-qa-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const stderr = [];
  chrome.stderr.on('data', (chunk) => stderr.push(String(chunk)));

  try {
    await waitForJson(`http://127.0.0.1:${port}/json/version`);

    const results = [
      await visitRoute(port, '/', { width: 1440, height: 1000 }, 'lc-home-desktop.png'),
      await visitRoute(port, '/detroit-dynamo', { width: 1440, height: 1000 }, 'dynamo-home-desktop.png'),
      await visitRoute(port, '/detroit-dynamo', { width: 390, height: 844 }, 'dynamo-home-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/youth-club?ageGroup=U9-U12%20Pre-Academy#youth-interest', { width: 390, height: 844 }, 'dynamo-youth-u9-u12-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/tryouts', { width: 390, height: 844 }, 'dynamo-tryouts-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/tryouts?team=Senior%20Women%27s%20Team#tryout-form', { width: 390, height: 844 }, 'dynamo-tryouts-women-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/camps-clinics?clinic=Goalkeeper%20Training#camp-interest', { width: 390, height: 844 }, 'dynamo-camps-goalkeeper-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/sponsors?package=Founding%20Sponsor#sponsor-inquiry', { width: 390, height: 844 }, 'dynamo-sponsors-founding-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/contact?topic=Sponsor%20Inquiry#contact-form', { width: 390, height: 844 }, 'dynamo-contact-sponsor-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/book?county=Oakland#training-interest', { width: 390, height: 844 }, 'dynamo-book-oakland-mobile.png'),
      await visitRoute(port, '/detroit-dynamo/book?program=Team%20training&focus=Team%20Training#training-interest', { width: 390, height: 844 }, 'dynamo-book-team-training-mobile.png'),
      await visitRoute(port, '/book', { width: 1440, height: 1000 }, 'lc-book-desktop.png'),
      await visitRoute(port, '/admin/detroit-dynamo/modules/players', { width: 1440, height: 1000 }, 'dynamo-admin-module-players.png'),
    ];

    for (const submission of leadFormSubmissions) {
      results.push(await submitLeadForm(port, submission));
    }
    results.push(await submitInvalidTryoutForm(port));
    results.push(await submitStorageErrorForm(port));

    const fullRouteAuditSize = { width: 1440, height: 1000 };
    const alreadyAudited = new Set(results.map((result) => result.route));
    for (const route of detroitDynamoAllRoutePaths) {
      if (alreadyAudited.has(route)) continue;
      results.push(await auditRoute(port, route, fullRouteAuditSize));
      alreadyAudited.add(route);
    }
    for (const route of detroitDynamoAdminModuleDetailRoutes) {
      if (alreadyAudited.has(route)) continue;
      results.push(await auditRoute(port, route, fullRouteAuditSize));
      alreadyAudited.add(route);
    }

    validateResults(results);

    const report = {
      checkedAt: new Date().toISOString(),
      baseUrl,
      artifactDir,
      chromePath,
      interactionSummary: {
        links: results.reduce((count, result) => count + (result.interactions?.anchors?.filter((anchor) => anchor.visible).length || 0), 0),
        buttons: results.reduce((count, result) => count + (result.interactions?.buttons?.filter((button) => button.visible).length || 0), 0),
      },
      routeAuditSummary: {
        totalStates: results.length,
        screenshotStates: results.filter((result) => !result.auditOnly).length,
        auditOnlyStates: results.filter((result) => result.auditOnly).length,
        adminModuleRoutesAudited: results.filter((result) => result.route.startsWith('/admin/detroit-dynamo/modules/')).length,
        detroitRoutesAudited: results.filter((result) => result.route.startsWith('/detroit-dynamo')).length,
      },
      formSubmissionSummary: {
        expected: leadFormSubmissions.map((submission) => submission.label),
        submitted: results.filter((result) => result.formLabel).map((result) => result.formLabel),
        probes: results.filter((result) => result.formProbe).map((result) => result.formProbe),
      },
      results: results.map(({ consoleErrors, ...result }) => result),
      consoleErrors: results.flatMap((result) => result.consoleErrors),
      failures,
    };

    await fs.writeFile(path.join(artifactDir, 'browser-qa-report.json'), JSON.stringify(report, null, 2));

    if (failures.length > 0) {
      console.error(`Detroit Dynamo browser QA failed with ${failures.length} issue(s):`);
      for (const failure of failures) console.error(`- ${failure}`);
      process.exitCode = 1;
      return;
    }

    console.log(`Detroit Dynamo browser QA passed against ${baseUrl}`);
    console.log(`Checked ${results.length} browser states, ${report.interactionSummary.links} visible links, and ${report.interactionSummary.buttons} visible buttons.`);
    console.log(`Submitted ${report.formSubmissionSummary.submitted.length} public lead forms: ${report.formSubmissionSummary.submitted.join(', ')}.`);
    console.log(`Verified ${report.formSubmissionSummary.probes.length} form error probes: ${report.formSubmissionSummary.probes.join(', ')}.`);
    console.log(`Route audit covered ${report.routeAuditSummary.detroitRoutesAudited} Detroit Dynamo route states and ${report.routeAuditSummary.adminModuleRoutesAudited} admin module detail states.`);
    console.log(`Screenshots/report written to ${artifactDir}`);
  } finally {
    await stopProcess(chrome);
    await fs.rm(userDataDir, { recursive: true, force: true });
    if (process.exitCode && stderr.length > 0) {
      console.error(stderr.join('').slice(-2000));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
