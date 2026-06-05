import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDetroitDynamoRouteMeta } from '@/lib/detroitDynamoRouteManifest';

const DYNAMO_FAVICON = '/detroit-dynamo/favicon.svg?v=1';
const DYNAMO_SOCIAL_IMAGE = '/detroit-dynamo/logo-primary.png';
const DYNAMO_SOCIAL_IMAGE_ALT = 'Detroit Dynamo interlocking DD logo';

function rememberLink(rel) {
  const link = document.querySelector(`link[rel="${rel}"]`);
  return {
    rel,
    link,
    existed: Boolean(link),
    href: link?.getAttribute('href') ?? null,
    type: link?.getAttribute('type') ?? null,
  };
}

function applyHeadLink(record, href, type = 'image/svg+xml') {
  const link = record.link || document.createElement('link');
  record.link = link;
  link.setAttribute('rel', record.rel);
  link.setAttribute('href', href);

  if (type) {
    link.setAttribute('type', type);
  }

  if (!record.existed) {
    document.head.appendChild(link);
  }
}

function absoluteUrl(pathname) {
  return new URL(pathname, window.location.origin).toString();
}

function restoreIconLink(record) {
  if (!record.existed) {
    record.link?.remove();
    return;
  }

  if (record.href === null) {
    record.link.removeAttribute('href');
  } else {
    record.link.setAttribute('href', record.href);
  }

  if (record.type === null) {
    record.link.removeAttribute('type');
  } else {
    record.link.setAttribute('type', record.type);
  }
}

function rememberMeta(selector) {
  const meta = document.querySelector(selector);
  return {
    meta,
    existed: Boolean(meta),
    content: meta?.getAttribute('content') ?? null,
  };
}

function applyMeta(record, createAttrs, content) {
  const meta = record.meta || document.createElement('meta');
  record.meta = meta;
  Object.entries(createAttrs).forEach(([key, value]) => meta.setAttribute(key, value));
  meta.setAttribute('content', content);
  if (!record.existed) document.head.appendChild(meta);
}

function restoreMeta(record) {
  if (!record.existed) {
    record.meta?.remove();
    return;
  }
  if (record.content === null) {
    record.meta.removeAttribute('content');
  } else {
    record.meta.setAttribute('content', record.content);
  }
}

export default function useDetroitDynamoMeta() {
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector('meta[name="robots"]');
    const previousRobotsContent = existingRobots?.getAttribute('content') ?? null;
    const robotsMeta = existingRobots || document.createElement('meta');
    const iconLinks = ['icon', 'shortcut icon', 'apple-touch-icon'].map(rememberLink);

    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index,follow');

    if (!existingRobots) {
      robotsMeta.setAttribute('data-detroit-dynamo-brand', 'true');
      document.head.appendChild(robotsMeta);
    }

    applyHeadLink(iconLinks[0], DYNAMO_FAVICON);
    applyHeadLink(iconLinks[1], DYNAMO_FAVICON);
    applyHeadLink(iconLinks[2], DYNAMO_FAVICON, null);

    return () => {
      document.title = previousTitle;

      if (!existingRobots) {
        robotsMeta.remove();
      } else if (previousRobotsContent === null) {
        existingRobots.removeAttribute('content');
      } else {
        existingRobots.setAttribute('content', previousRobotsContent);
      }

      iconLinks.forEach(restoreIconLink);
    };
  }, []);

  useEffect(() => {
    const meta = getDetroitDynamoRouteMeta(location.pathname);
    const description = meta?.description || "Detroit Dynamo is Detroit's player development pathway for training, youth club growth, and senior team ambition.";
    const descriptionRecord = rememberMeta('meta[name="description"]');
    const ogTitleRecord = rememberMeta('meta[property="og:title"]');
    const ogDescriptionRecord = rememberMeta('meta[property="og:description"]');
    const ogTypeRecord = rememberMeta('meta[property="og:type"]');
    const ogUrlRecord = rememberMeta('meta[property="og:url"]');
    const ogImageRecord = rememberMeta('meta[property="og:image"]');
    const ogImageAltRecord = rememberMeta('meta[property="og:image:alt"]');
    const twitterCardRecord = rememberMeta('meta[name="twitter:card"]');
    const twitterTitleRecord = rememberMeta('meta[name="twitter:title"]');
    const twitterDescriptionRecord = rememberMeta('meta[name="twitter:description"]');
    const twitterImageRecord = rememberMeta('meta[name="twitter:image"]');
    const canonicalRecord = rememberLink('canonical');
    const canonicalUrl = absoluteUrl(meta?.path || location.pathname);
    const socialImageUrl = absoluteUrl(DYNAMO_SOCIAL_IMAGE);

    document.title = meta?.title || 'Detroit Dynamo';
    applyMeta(descriptionRecord, { name: 'description' }, description);
    applyMeta(ogTitleRecord, { property: 'og:title' }, document.title);
    applyMeta(ogDescriptionRecord, { property: 'og:description' }, description);
    applyMeta(ogTypeRecord, { property: 'og:type' }, 'website');
    applyMeta(ogUrlRecord, { property: 'og:url' }, canonicalUrl);
    applyMeta(ogImageRecord, { property: 'og:image' }, socialImageUrl);
    applyMeta(ogImageAltRecord, { property: 'og:image:alt' }, DYNAMO_SOCIAL_IMAGE_ALT);
    applyMeta(twitterCardRecord, { name: 'twitter:card' }, 'summary_large_image');
    applyMeta(twitterTitleRecord, { name: 'twitter:title' }, document.title);
    applyMeta(twitterDescriptionRecord, { name: 'twitter:description' }, description);
    applyMeta(twitterImageRecord, { name: 'twitter:image' }, socialImageUrl);
    applyHeadLink(canonicalRecord, canonicalUrl, null);

    return () => {
      restoreMeta(descriptionRecord);
      restoreMeta(ogTitleRecord);
      restoreMeta(ogDescriptionRecord);
      restoreMeta(ogTypeRecord);
      restoreMeta(ogUrlRecord);
      restoreMeta(ogImageRecord);
      restoreMeta(ogImageAltRecord);
      restoreMeta(twitterCardRecord);
      restoreMeta(twitterTitleRecord);
      restoreMeta(twitterDescriptionRecord);
      restoreMeta(twitterImageRecord);
      restoreIconLink(canonicalRecord);
    };
  }, [location.pathname]);
}
