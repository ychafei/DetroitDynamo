// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Database,
  Download,
  ExternalLink,
  Inbox,
  RefreshCcw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY,
  getDetroitDynamoPreviewAuditEvents,
  getDetroitDynamoPreviewLeads,
  updateDetroitDynamoPreviewLeadPipelineStatus,
} from '@/lib/detroitDynamoLeads';
import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoBackendActivationSteps,
  detroitDynamoExternalConfirmationRegister,
  detroitDynamoLaunchReadiness,
  detroitDynamoLeadPipelineStages,
  detroitDynamoLeadRouting,
  detroitDynamoPromotionGates,
} from '@/lib/detroitDynamoDataModel';
import {
  detroitDynamoModuleActionGuards,
  detroitDynamoRoleAccessSummaries,
} from '@/lib/detroitDynamoAdminAccess';
import { buildDetroitDynamoExternalGateContractReport } from '@/lib/detroitDynamoExternalGateContracts';
import { buildDetroitDynamoClaimSafetyContractReport } from '@/lib/detroitDynamoClaimSafetyContract';
import { buildDetroitDynamoLeadIntakeContractReport } from '@/lib/detroitDynamoLeadIntakeContract';
import { buildDetroitDynamoLeadPipelineQueue } from '@/lib/detroitDynamoLeadPipeline';
import { buildDetroitDynamoPipelineActionContractReport } from '@/lib/detroitDynamoPipelineActionContract';
import { buildDetroitDynamoAdminModuleReadContractReport } from '@/lib/detroitDynamoAdminModuleReadContract';
import { buildDetroitDynamoAdminModuleWriteContractReport } from '@/lib/detroitDynamoAdminModuleWriteContract';
import { buildDetroitDynamoAdminRoleGrantContractReport } from '@/lib/detroitDynamoAdminRoleGrantContract';
import { buildDetroitDynamoAdminRecordWorkspaceReport } from '@/lib/detroitDynamoAdminRecordWorkspaceContract';
import { buildDetroitDynamoLaunchEvidenceReport } from '@/lib/detroitDynamoLaunchEvidenceContract';
import {
  buildDetroitDynamoLaunchEvidenceActionCsv,
  detroitDynamoLaunchEvidenceActionTypes,
  getDetroitDynamoPreviewLaunchEvidenceActions,
  submitDetroitDynamoLaunchEvidenceAction,
} from '@/lib/detroitDynamoLaunchEvidenceActions';
import {
  buildDetroitDynamoExternalConfirmationActionCsv,
  buildDetroitDynamoExternalConfirmationActionReport,
  detroitDynamoExternalConfirmationActionTypes,
  getDetroitDynamoPreviewExternalConfirmationActions,
  submitDetroitDynamoExternalConfirmationAction,
} from '@/lib/detroitDynamoExternalConfirmationActions';
import { buildDetroitDynamoOwnerLaunchReviewReport } from '@/lib/detroitDynamoOwnerLaunchReview';
import {
  buildDetroitDynamoOwnerEvidenceIntakeCsv,
  buildDetroitDynamoOwnerEvidenceIntakeReport,
} from '@/lib/detroitDynamoOwnerEvidenceIntake';
import { buildDetroitDynamoOwnerHandoffPacketReport } from '@/lib/detroitDynamoOwnerHandoffPacket';
import { buildDetroitDynamoProductionPreviewEvidenceReport } from '@/lib/detroitDynamoProductionPreviewEvidence';
import { buildDetroitDynamoLiveReadinessBoardReport } from '@/lib/detroitDynamoLiveReadinessBoard';
import { buildDetroitDynamoLaunchArtifactIndexReport } from '@/lib/detroitDynamoLaunchArtifactIndex';
import { buildDetroitDynamoDeploymentReadinessReport } from '@/lib/detroitDynamoDeploymentReadiness';
import { buildDetroitDynamoVercelPreviewRunbookReport } from '@/lib/detroitDynamoVercelPreviewRunbook';
import { buildDetroitDynamoSecretRedactionReport } from '@/lib/detroitDynamoSecretRedactionContract';
import { buildDetroitDynamoExternalGateClosureReport } from '@/lib/detroitDynamoExternalGateClosurePacket';
import { buildDetroitDynamoOwnerSignoffRegisterReport } from '@/lib/detroitDynamoOwnerSignoffRegister';
import { buildDetroitDynamoFinalAcceptanceMatrixReport } from '@/lib/detroitDynamoFinalAcceptanceMatrix';
import {
  getDetroitDynamoPreviewRoleGrantActions,
  getDetroitDynamoRoleGrantBackendMode,
  setDetroitDynamoRoleGrantBackendMode,
  submitDetroitDynamoAdminRoleGrantAction,
} from '@/lib/detroitDynamoAdminRoleGrants';
import { buildDetroitDynamoPromotionCutoverReport } from '@/lib/detroitDynamoPromotionCutoverContract';
import { buildDetroitDynamoSafeguardingReport } from '@/lib/detroitDynamoSafeguardingContract';
import { detroitDynamoAppwriteCollections } from '@/lib/detroitDynamoAppwriteSchema';
import {
  detroitDynamoRedirectPlan,
  detroitDynamoSitemapRoutes,
} from '@/lib/detroitDynamoRouteManifest';

function LeadStat({ label, value, hint, icon: Icon }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 font-oswald text-3xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>}
    </article>
  );
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function buildLeadCsv(leads) {
  const columns = [
    'id',
    'created_at',
    'updated_at',
    'lead_type',
    'pipeline_status',
    'pipeline_updated_at',
    'pipeline_updated_by',
    'pipeline_note',
    'source_route',
    'contact_name',
    'player_name',
    'parent_guardian_name',
    'organization',
    'email',
    'phone',
    'team_interest',
    'program_interest',
    'package_interest',
    'position',
    'date_of_birth',
    'experience_level',
    'current_club',
    'notes',
  ];

  return [
    columns.join(','),
    ...leads.map((lead) => columns.map((column) => csvEscape(lead[column])).join(',')),
  ].join('\n');
}

function buildAuditCsv(events) {
  const columns = [
    'id',
    'created_at',
    'actor_user_id',
    'actor_role',
    'action',
    'target_model',
    'target_collection_id',
    'target_record_id',
    'lead_type',
    'previous_status',
    'next_status',
    'event_summary',
    'metadata_json',
    'ip_address',
  ];

  return [
    columns.join(','),
    ...events.map((event) => columns.map((column) => csvEscape(event[column])).join(',')),
  ].join('\n');
}

function downloadPreviewLeads(leads) {
  const csv = buildLeadCsv(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `detroit-dynamo-preview-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadPreviewAuditEvents(events) {
  const csv = buildAuditCsv(events);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `detroit-dynamo-preview-audit-events-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadLaunchEvidenceActions(actions) {
  const csv = buildDetroitDynamoLaunchEvidenceActionCsv(actions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `detroit-dynamo-launch-evidence-actions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadExternalConfirmationActions(actions) {
  const csv = buildDetroitDynamoExternalConfirmationActionCsv(actions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `detroit-dynamo-external-confirmation-actions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadOwnerEvidenceIntake(report) {
  const csv = buildDetroitDynamoOwnerEvidenceIntakeCsv(report);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `detroit-dynamo-owner-evidence-intake-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function urgencyBadgeClass(urgency) {
  if (urgency === 'overdue') return 'border-red-300/35 bg-red-500/10 text-red-100';
  if (urgency === 'due_soon') return 'border-yellow-300/35 bg-yellow-500/10 text-yellow-100';
  if (urgency === 'closed') return 'border-border bg-background text-muted-foreground';
  return 'border-accent/35 bg-accent/10 text-accent';
}

export default function AdminDetroitDynamo() {
  const [leads, setLeads] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [backendMode, setBackendMode] = useState('local');
  const [transitionMessage, setTransitionMessage] = useState('');
  const [roleGrantMode, setRoleGrantMode] = useState('local');
  const [roleGrantActions, setRoleGrantActions] = useState([]);
  const [roleGrantForm, setRoleGrantForm] = useState({
    action: 'grant_role',
    role: 'Registrar',
    target_user_id: '',
    assignment_id: '',
    email: '',
    expires_at: '',
    scope_note: '',
  });
  const [roleGrantSubmitting, setRoleGrantSubmitting] = useState(false);
  const [roleGrantMessage, setRoleGrantMessage] = useState('');
  const [roleGrantError, setRoleGrantError] = useState('');
  const [launchEvidenceActions, setLaunchEvidenceActions] = useState([]);
  const [launchEvidenceForm, setLaunchEvidenceForm] = useState({
    checklist_item_id: 'current-site-route-snapshot',
    action: 'attach_evidence',
    actor_role: 'Master Admin',
    evidence_label: '',
    artifact_reference: '',
    note: '',
  });
  const [launchEvidenceSubmitting, setLaunchEvidenceSubmitting] = useState(false);
  const [launchEvidenceMessage, setLaunchEvidenceMessage] = useState('');
  const [launchEvidenceError, setLaunchEvidenceError] = useState('');
  const [externalConfirmationActions, setExternalConfirmationActions] = useState([]);
  const [externalConfirmationForm, setExternalConfirmationForm] = useState({
    confirmation_area: 'Payments & Packages',
    action: 'request_owner_signoff',
    actor_role: 'Master Admin',
    evidence_label: '',
    artifact_reference: '',
    note: '',
  });
  const [externalConfirmationSubmitting, setExternalConfirmationSubmitting] = useState(false);
  const [externalConfirmationMessage, setExternalConfirmationMessage] = useState('');
  const [externalConfirmationError, setExternalConfirmationError] = useState('');

  const refreshLeads = () => {
    setLeads(getDetroitDynamoPreviewLeads());
    setAuditEvents(getDetroitDynamoPreviewAuditEvents());
    setRoleGrantActions(getDetroitDynamoPreviewRoleGrantActions());
    setLaunchEvidenceActions(getDetroitDynamoPreviewLaunchEvidenceActions());
    setExternalConfirmationActions(getDetroitDynamoPreviewExternalConfirmationActions());
  };

  useEffect(() => {
    refreshLeads();
    setBackendMode(window.localStorage.getItem(DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY) === 'appwrite' ? 'appwrite' : 'local');
    setRoleGrantMode(getDetroitDynamoRoleGrantBackendMode());
  }, []);

  const setLeadBackendMode = (mode) => {
    if (mode === 'appwrite') {
      window.localStorage.setItem(DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY, 'appwrite');
    } else {
      window.localStorage.removeItem(DETROIT_DYNAMO_LEAD_BACKEND_STORAGE_KEY);
    }
    setBackendMode(mode);
  };

  const setRoleGrantBackendMode = (mode) => {
    setDetroitDynamoRoleGrantBackendMode(mode);
    setRoleGrantMode(mode);
  };

  const updateRoleGrantForm = (field, value) => {
    setRoleGrantForm((current) => ({
      ...current,
      [field]: value,
    }));
    setRoleGrantMessage('');
    setRoleGrantError('');
  };

  const submitRoleGrant = async (event) => {
    event.preventDefault();
    setRoleGrantSubmitting(true);
    setRoleGrantMessage('');
    setRoleGrantError('');

    try {
      const result = await submitDetroitDynamoAdminRoleGrantAction(roleGrantForm);
      refreshLeads();
      setRoleGrantMessage(`${result.action.replaceAll('_', ' ')} captured for ${result.role}.`);
      if (roleGrantForm.action === 'grant_role') {
        setRoleGrantForm((current) => ({
          ...current,
          target_user_id: '',
          email: '',
          scope_note: '',
        }));
      }
    } catch (error) {
      setRoleGrantError(error?.message || 'Could not submit the Detroit Dynamo role grant action.');
    } finally {
      setRoleGrantSubmitting(false);
    }
  };

  const updateLaunchEvidenceForm = (field, value) => {
    setLaunchEvidenceForm((current) => ({
      ...current,
      [field]: value,
    }));
    setLaunchEvidenceMessage('');
    setLaunchEvidenceError('');
  };

  const submitLaunchEvidence = (event) => {
    event.preventDefault();
    setLaunchEvidenceSubmitting(true);
    setLaunchEvidenceMessage('');
    setLaunchEvidenceError('');

    try {
      const result = submitDetroitDynamoLaunchEvidenceAction(launchEvidenceForm);
      refreshLeads();
      setLaunchEvidenceMessage(`${result.action.replaceAll('_', ' ')} captured for ${result.checklist_item_id}. Live gate cleared: no.`);
      setLaunchEvidenceForm((current) => ({
        ...current,
        evidence_label: '',
        artifact_reference: '',
        note: '',
      }));
    } catch (error) {
      setLaunchEvidenceError(error?.message || 'Could not capture the launch evidence action.');
    } finally {
      setLaunchEvidenceSubmitting(false);
    }
  };

  const updateExternalConfirmationForm = (field, value) => {
    setExternalConfirmationForm((current) => ({
      ...current,
      [field]: value,
    }));
    setExternalConfirmationMessage('');
    setExternalConfirmationError('');
  };

  const submitExternalConfirmation = (event) => {
    event.preventDefault();
    setExternalConfirmationSubmitting(true);
    setExternalConfirmationMessage('');
    setExternalConfirmationError('');

    try {
      const result = submitDetroitDynamoExternalConfirmationAction(externalConfirmationForm);
      refreshLeads();
      setExternalConfirmationMessage(`${result.action.replaceAll('_', ' ')} captured for ${result.confirmation_area}. Publication unlocked: no.`);
      setExternalConfirmationForm((current) => ({
        ...current,
        evidence_label: '',
        artifact_reference: '',
        note: '',
      }));
    } catch (error) {
      setExternalConfirmationError(error?.message || 'Could not capture the external confirmation action.');
    } finally {
      setExternalConfirmationSubmitting(false);
    }
  };

  const transitionLead = (leadId, nextStatus, ownerRole) => {
    try {
      const updated = updateDetroitDynamoPreviewLeadPipelineStatus(leadId, nextStatus, {
        actorRole: ownerRole || 'Preview Admin',
        note: `Local preview moved to ${nextStatus}.`,
      });
      refreshLeads();
      setTransitionMessage(`${updated.player_name || updated.contact_name || updated.organization || 'Lead'} moved to ${nextStatus}.`);
    } catch (error) {
      setTransitionMessage(error?.message || 'Could not update the local preview lead.');
    }
  };

  const counts = useMemo(() => {
    return leads.reduce((totals, lead) => {
      const type = lead.lead_type || 'unknown';
      totals[type] = (totals[type] || 0) + 1;
      return totals;
    }, {});
  }, [leads]);

  const pipelineQueue = useMemo(() => buildDetroitDynamoLeadPipelineQueue(leads), [leads]);
  const externalGateContract = useMemo(() => buildDetroitDynamoExternalGateContractReport(), []);
  const claimSafetyContract = useMemo(() => buildDetroitDynamoClaimSafetyContractReport(), []);
  const promotionCutoverContract = useMemo(() => buildDetroitDynamoPromotionCutoverReport(), []);
  const launchEvidenceContract = useMemo(() => buildDetroitDynamoLaunchEvidenceReport(), []);
  const externalConfirmationActionContract = useMemo(() => buildDetroitDynamoExternalConfirmationActionReport(), []);
  const ownerLaunchReview = useMemo(() => buildDetroitDynamoOwnerLaunchReviewReport(), []);
  const ownerEvidenceIntake = useMemo(() => buildDetroitDynamoOwnerEvidenceIntakeReport(), []);
  const ownerHandoffPacket = useMemo(() => buildDetroitDynamoOwnerHandoffPacketReport(), []);
  const productionPreviewEvidence = useMemo(() => buildDetroitDynamoProductionPreviewEvidenceReport(), []);
  const liveReadinessBoard = useMemo(() => buildDetroitDynamoLiveReadinessBoardReport(), []);
  const launchArtifactIndex = useMemo(() => buildDetroitDynamoLaunchArtifactIndexReport(), []);
  const deploymentReadiness = useMemo(() => buildDetroitDynamoDeploymentReadinessReport(), []);
  const vercelPreviewRunbook = useMemo(() => buildDetroitDynamoVercelPreviewRunbookReport(), []);
  const secretRedaction = useMemo(() => buildDetroitDynamoSecretRedactionReport(), []);
  const externalGateClosure = useMemo(() => buildDetroitDynamoExternalGateClosureReport(), []);
  const ownerSignoffRegister = useMemo(() => buildDetroitDynamoOwnerSignoffRegisterReport(), []);
  const finalAcceptanceMatrix = useMemo(() => buildDetroitDynamoFinalAcceptanceMatrixReport(), []);
  const safeguardingContract = useMemo(() => buildDetroitDynamoSafeguardingReport(), []);
  const leadIntakeContract = useMemo(() => buildDetroitDynamoLeadIntakeContractReport(), []);
  const pipelineActionContract = useMemo(() => buildDetroitDynamoPipelineActionContractReport(), []);
  const adminModuleReadContract = useMemo(() => buildDetroitDynamoAdminModuleReadContractReport(), []);
  const adminModuleWriteContract = useMemo(() => buildDetroitDynamoAdminModuleWriteContractReport(), []);
  const adminRoleGrantContract = useMemo(() => buildDetroitDynamoAdminRoleGrantContractReport(), []);
  const adminRecordWorkspaceContract = useMemo(() => buildDetroitDynamoAdminRecordWorkspaceReport(), []);

  const collectionTargets = useMemo(() => {
    const names = new Set(['ContactLead', 'TryoutRegistration', 'Booking', 'Sponsor', 'Player', 'ParentGuardian']);
    return detroitDynamoAppwriteCollections.filter((item) => names.has(item.model));
  }, []);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Detroit Dynamo</p>
            <h1 className="mt-3 font-oswald text-4xl font-bold tracking-tight text-foreground">PREVIEW ADMIN FOUNDATION</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              Protected admin view for the Detroit Dynamo preview queue, role plan, and Appwrite collection targets.
              Local preview storage remains the default; Appwrite intake can be enabled here after the function and
              collections are deployed.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/detroit-dynamo/admin-foundation"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              Public Foundation
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={refreshLeads}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10">
          <LeadStat label="Preview Leads" value={leads.length} hint="Stored in this browser only" icon={Inbox} />
          <LeadStat label="Audit Events" value={auditEvents.length} hint="Local admin action ledger" icon={Database} />
          <LeadStat label="Lead Types" value={Object.keys(counts).length} hint="Contact, training, tryout, sponsor, youth, senior" icon={ClipboardList} />
          <LeadStat label="Admin Roles" value={detroitDynamoAdminRoles.length} hint="Future role gates" icon={ShieldCheck} />
          <LeadStat label="SEO Routes" value={detroitDynamoSitemapRoutes.length} hint="Sitemap-ready Dynamo pages" icon={ExternalLink} />
          <LeadStat label="Launch Gates" value={detroitDynamoPromotionGates.length} hint="Required before full brand promotion" icon={ShieldCheck} />
          <LeadStat label="Fact Gates" value={detroitDynamoExternalConfirmationRegister.length} hint="External approvals before public claims" icon={ClipboardList} />
          <LeadStat label="Claim Guards" value={claimSafetyContract.claimSafetyTracks.length} hint="Public proof stays gated" icon={ShieldCheck} />
          <LeadStat label="Cutover Steps" value={promotionCutoverContract.cutoverTracks.length} hint="Root switch stays gated" icon={RefreshCcw} />
          <LeadStat label="Evidence Items" value={launchEvidenceContract.checklistItems.length} hint="Launch proof checklist" icon={ClipboardList} />
          <LeadStat label="Safeguards" value={safeguardingContract.safeguardingTracks.length} hint="Youth data controls" icon={Users} />
          <LeadStat label="Role Grants" value={roleGrantActions.length} hint="Local grant action queue" icon={ShieldCheck} />
          <LeadStat label="Evidence Actions" value={launchEvidenceActions.length} hint="Local proof ledger" icon={ClipboardList} />
          <LeadStat label="Confirm Actions" value={externalConfirmationActions.length} hint="Local approval rehearsal" icon={ShieldCheck} />
          <LeadStat label="Launch Review" value={ownerLaunchReview.summary.sectionsTotal} hint={ownerLaunchReview.decision.label} icon={ShieldCheck} />
          <LeadStat label="Intake Rows" value={ownerEvidenceIntake.summary.intakeRows} hint="Owner proof worksheet" icon={ClipboardList} />
          <LeadStat label="Prod Evidence" value={productionPreviewEvidence.summary.tracksTotal} hint="Preview proof matrix" icon={Database} />
          <LeadStat label="Live Board" value={liveReadinessBoard.summary.rowsTotal} hint={liveReadinessBoard.decision.label} icon={ShieldCheck} />
          <LeadStat label="Artifact Index" value={launchArtifactIndex.summary.artifactsTotal} hint="Launch handoff map" icon={ClipboardList} />
          <LeadStat label="Deploy Tracks" value={deploymentReadiness.summary.tracksTotal} hint={deploymentReadiness.decision.label} icon={ExternalLink} />
          <LeadStat label="Gate Closure" value={externalGateClosure.summary.rowsTotal} hint="External proof rows" icon={ShieldCheck} />
          <LeadStat label="Signoffs" value={ownerSignoffRegister.summary.signoffRows} hint="Unsigned owner approvals" icon={ShieldCheck} />
          <LeadStat label="Acceptance" value={finalAcceptanceMatrix.summary.acceptanceRows} hint="Goal evidence rows" icon={ClipboardList} />
          <LeadStat label="Record Fixtures" value={adminRecordWorkspaceContract.flattenedRecords.length} hint="Record workspace proof" icon={Database} />
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Owner Review</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">OWNER LAUNCH REVIEW PACKET</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                One review packet gathers the launch evidence checklist, confirmation queues, cutover contract,
                payment/waiver gates, claim-safety rules, safeguarding controls, and backend activation plan into a
                clear launch-gated go/no-go decision. It keeps payments, signatures, and external claims blocked until real evidence and
                owner approval exist.
              </p>
            </div>
            <span className="w-fit rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-red-100">
              {ownerLaunchReview.decision.label}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <LeadStat
              label="Review Sections"
              value={ownerLaunchReview.summary.sectionsTotal}
              hint="Owner decision areas"
              icon={ClipboardList}
            />
            <LeadStat
              label="Blocked"
              value={ownerLaunchReview.summary.blockedSections}
              hint="Not ready for launch"
              icon={ShieldCheck}
            />
            <LeadStat
              label="External"
              value={ownerLaunchReview.summary.externalApprovalsRequired}
              hint="Approvals still required"
              icon={Users}
            />
            <LeadStat
              label="Evidence"
              value={ownerLaunchReview.summary.unresolvedEvidenceItems}
              hint="Items unresolved"
              icon={Database}
            />
            <LeadStat
              label="Live Gates"
              value={ownerLaunchReview.summary.liveGatesCleared}
              hint="Must stay zero"
              icon={RefreshCcw}
            />
            <LeadStat
              label="Publications"
              value={ownerLaunchReview.summary.publicationsUnlocked}
              hint="Must stay zero"
              icon={Inbox}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Required Owner Actions
              </p>
              <div className="mt-3 grid gap-2">
                {ownerLaunchReview.requiredOwnerActions.map((action) => (
                  <div key={action} className="rounded-md border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
                    {action}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Generated artifact: `artifacts/detroit-dynamo/launch/detroit-dynamo-owner-launch-review.md`.
              </p>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Review Sections
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {ownerLaunchReview.sections.map((section) => (
                  <article key={section.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-semibold text-foreground">{section.label}</p>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {section.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">{section.ownerRole}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.decisionQuestion}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  EXTERNAL GATE CLOSURE PACKET
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The closure packet turns the remaining external gates into role-owned evidence rows for backend
                  activation, payments, waivers, league/facility facts, proof publication, Vercel cutover, rollback,
                  and owner closeout. It keeps every row blocked until real proof is attached.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {externalGateClosure.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Rows"
                value={externalGateClosure.summary.rowsTotal}
                hint="Closure checklist"
                icon={ClipboardList}
              />
              <LeadStat
                label="External"
                value={externalGateClosure.summary.externalEvidenceRows}
                hint="Evidence required"
                icon={Database}
              />
              <LeadStat
                label="Critical"
                value={externalGateClosure.summary.criticalRows}
                hint="Launch blockers"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Ready"
                value={externalGateClosure.summary.readyToCloseRows}
                hint="Must stay zero"
                icon={Inbox}
              />
              <LeadStat
                label="Live Gates"
                value={externalGateClosure.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Completion"
                value={String(externalGateClosure.summary.completionClaimAllowed)}
                hint="Blocked"
                icon={ExternalLink}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {externalGateClosure.rows.slice(0, 6).map((row) => (
                <article key={row.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {row.priority}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{row.ownerRole} / {row.status}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.requiredEvidence[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-external-gate-closure.md`, `.json`, and `.csv`. The packet names
              required proof only; it does not close gates or approve launch.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  OWNER HANDOFF PACKET
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The owner handoff packet gives the launch meeting one redacted agenda: proof artifacts, verification
                  commands, unresolved evidence, signoff state, redaction status, and the live actions that must remain
                  blocked until real approvals are attached.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {ownerHandoffPacket.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Sections"
                value={ownerHandoffPacket.summary.packetSections}
                hint="Owner agenda"
                icon={ClipboardList}
              />
              <LeadStat
                label="Evidence"
                value={ownerHandoffPacket.summary.evidenceRequiredSections}
                hint="Required"
                icon={Database}
              />
              <LeadStat
                label="Redaction"
                value={ownerHandoffPacket.summary.redactionReviewSections}
                hint="Review needed"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Unsigned"
                value={ownerHandoffPacket.summary.unsignedRows}
                hint="Signoff rows"
                icon={Users}
              />
              <LeadStat
                label="Live Gates"
                value={ownerHandoffPacket.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={Inbox}
              />
              <LeadStat
                label="Publish"
                value={String(ownerHandoffPacket.summary.publishAllowed)}
                hint="Blocked"
                icon={ExternalLink}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {ownerHandoffPacket.sections.slice(0, 6).map((section) => (
                <article key={section.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{section.title}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {section.decisionStatus}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{section.ownerRole} / {section.signoffStatus}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.evidenceRequired[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-owner-handoff-packet.md`, `.json`, and `.csv`. This packet is the
              owner meeting agenda, not launch approval.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  SECRET REDACTION CONTRACT
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The secret redaction contract keeps owner handoffs share-safe by scanning generated artifacts, source
                  files, scripts, function scaffolds, and deployment docs for exact local secret values, Vercel project
                  identifiers, and high-confidence provider-token patterns before any launch packet is shared.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {secretRedaction.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Rules"
                value={secretRedaction.summary.rulesTotal}
                hint="Redaction checks"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Evidence"
                value={secretRedaction.summary.evidenceRequiredRules}
                hint="Required rules"
                icon={ClipboardList}
              />
              <LeadStat
                label="Leaks"
                value={secretRedaction.summary.leakagesDetected}
                hint="Must stay zero"
                icon={Inbox}
              />
              <LeadStat
                label="Secrets"
                value={String(secretRedaction.summary.exactSecretValuesWritten)}
                hint="Values written"
                icon={Database}
              />
              <LeadStat
                label="Publish"
                value={String(secretRedaction.summary.publishAllowed)}
                hint="Blocked"
                icon={ExternalLink}
              />
              <LeadStat
                label="Live Gates"
                value={secretRedaction.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {secretRedaction.rules.slice(0, 6).map((rule) => (
                <article key={rule.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{rule.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {rule.status}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{rule.ownerRole}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.requiredChecks[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-secret-redaction.md`, `.json`, `.csv`, and violation CSV. Exact
              secret values are never written to the report.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  VERCEL PREVIEW DEPLOYMENT RUNBOOK
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The Vercel preview runbook turns deployment into a redacted evidence workflow: upgrade the CLI,
                  confirm the linked project without exposing ids, pull preview env, deploy a prebuilt preview, inspect
                  it, run route/form QA, record rollback proof, and keep promotion held until owner signoff.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {vercelPreviewRunbook.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Steps"
                value={vercelPreviewRunbook.summary.stepsTotal}
                hint="Deployment runbook"
                icon={ClipboardList}
              />
              <LeadStat
                label="Evidence"
                value={vercelPreviewRunbook.summary.evidenceRequiredSteps}
                hint="Required steps"
                icon={Database}
              />
              <LeadStat
                label="CLI Upgrade"
                value={String(vercelPreviewRunbook.summary.cliUpgradeRecommended)}
                hint="Recommended"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Preview"
                value={vercelPreviewRunbook.summary.previewDeploymentRecorded}
                hint="Recorded"
                icon={ExternalLink}
              />
              <LeadStat
                label="Promote"
                value={String(vercelPreviewRunbook.summary.productionPromotionAllowed)}
                hint="Held"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Live Gates"
                value={vercelPreviewRunbook.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={Inbox}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {vercelPreviewRunbook.steps.slice(0, 6).map((step) => (
                <article key={step.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {step.status}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{step.ownerRole} / {step.phase}</p>
                  <p className="mt-2 break-words font-mono text-[11px] leading-5 text-muted-foreground">{step.commands[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-vercel-preview-runbook.md`, `.json`, and `.csv`. Project ids,
              org ids, tokens, and env values stay out of the handoff.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  OWNER EVIDENCE INTAKE WORKSHEET
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The intake worksheet converts every launch evidence item into a fillable owner review row with proof
                  location, approver, date, decision, notes, blocked live actions, and verification command fields.
                  It stays preview-only and cannot clear live gates by itself.
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadOwnerEvidenceIntake(ownerEvidenceIntake)}
                className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export Intake CSV
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <LeadStat
                label="Rows"
                value={ownerEvidenceIntake.summary.intakeRows}
                hint="Owner fill-in items"
                icon={ClipboardList}
              />
              <LeadStat
                label="Unresolved"
                value={ownerEvidenceIntake.summary.unresolvedRows}
                hint="Still need proof"
                icon={Inbox}
              />
              <LeadStat
                label="Safe Publish"
                value={ownerEvidenceIntake.summary.safeToPublishRows}
                hint="Must stay zero"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Live Gates"
                value={ownerEvidenceIntake.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Publications"
                value={ownerEvidenceIntake.summary.publicationsUnlocked}
                hint="Must stay zero"
                icon={Database}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {ownerEvidenceIntake.intakeRows.slice(0, 6).map((row) => (
                <article key={row.intake_id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{row.review_section}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {row.current_status}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{row.owner_role} / {row.confirmation_area}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.required_artifact}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-owner-evidence-intake.md`, `.json`, and `.csv`.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  OWNER SIGNOFF REGISTER
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The signoff register turns final owner and external approvals into unsigned rows tied to source
                  artifacts, evidence requirements, verification commands, and blocked live actions. It stays
                  preview-only until real evidence and named approvers are attached.
                </p>
              </div>
              <span className="w-fit rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-red-100">
                {ownerSignoffRegister.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Signoffs"
                value={ownerSignoffRegister.summary.signoffRows}
                hint="Final approval rows"
                icon={ClipboardList}
              />
              <LeadStat
                label="Signed"
                value={ownerSignoffRegister.summary.signedRows}
                hint="Must stay zero"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Unsigned"
                value={ownerSignoffRegister.summary.unsignedRows}
                hint="Still required"
                icon={Inbox}
              />
              <LeadStat
                label="Live Gates"
                value={ownerSignoffRegister.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Publications"
                value={ownerSignoffRegister.summary.publicationsUnlocked}
                hint="Must stay zero"
                icon={Database}
              />
              <LeadStat
                label="Redirects"
                value={String(ownerSignoffRegister.summary.permanentRedirectsAllowed)}
                hint="Blocked"
                icon={ExternalLink}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {ownerSignoffRegister.signoffRows.slice(0, 6).map((row) => (
                <article key={row.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {row.status}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{row.signerRole} / {row.signoffArea}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.requiredEvidence[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-owner-signoff-register.md`, `.json`, and `.csv`.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  FINAL ACCEPTANCE MATRIX
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The final acceptance matrix maps the original Detroit Dynamo objective into auditable rows. It
                  separates preview-complete work from external evidence that still requires owner, backend, legal,
                  payment, league, facility, production deployment, or launch-window proof.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {finalAcceptanceMatrix.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Rows"
                value={finalAcceptanceMatrix.summary.acceptanceRows}
                hint="Original objective checks"
                icon={ClipboardList}
              />
              <LeadStat
                label="Preview Done"
                value={finalAcceptanceMatrix.summary.previewCompleteRows}
                hint="Preview scope only"
                icon={ShieldCheck}
              />
              <LeadStat
                label="External"
                value={finalAcceptanceMatrix.summary.externalEvidenceRequiredRows}
                hint="Still needs proof"
                icon={Inbox}
              />
              <LeadStat
                label="Live Gates"
                value={finalAcceptanceMatrix.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Signoffs"
                value={finalAcceptanceMatrix.summary.ownerSignedRows}
                hint="Signed rows"
                icon={Users}
              />
              <LeadStat
                label="Root"
                value={String(finalAcceptanceMatrix.summary.rootPromotionAllowed)}
                hint="Promotion blocked"
                icon={ExternalLink}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {finalAcceptanceMatrix.rows.slice(0, 6).map((row) => (
                <article key={row.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {row.completionStatus}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{row.ownerRole} / {row.acceptanceArea}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.currentEvidence[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-final-acceptance-matrix.md`, `.json`, and `.csv`.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  PRODUCTION PREVIEW EVIDENCE MATRIX
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The production-preview matrix ties public form submissions, protected admin actions, route QA,
                  Appwrite activation steps, and external confirmations into one proof checklist before live backend
                  mode or root-brand promotion can be considered.
                </p>
              </div>
              <span className="w-fit rounded-md border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                {productionPreviewEvidence.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Tracks"
                value={productionPreviewEvidence.summary.tracksTotal}
                hint="Proof tracks"
                icon={ClipboardList}
              />
              <LeadStat
                label="Public Forms"
                value={productionPreviewEvidence.summary.publicFormTracks}
                hint="Production-preview posts"
                icon={Inbox}
              />
              <LeadStat
                label="Admin Actions"
                value={productionPreviewEvidence.summary.adminActionTracks}
                hint="Authenticated functions"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Backend Steps"
                value={productionPreviewEvidence.summary.backendActivationTracks}
                hint="Activation runbook"
                icon={Database}
              />
              <LeadStat
                label="Live Gates"
                value={productionPreviewEvidence.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Publications"
                value={productionPreviewEvidence.summary.publicationsUnlocked}
                hint="Must stay zero"
                icon={Users}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {productionPreviewEvidence.tracks.slice(0, 8).map((track) => (
                <article key={track.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{track.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {track.productionPreviewEvidenceId}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{track.ownerRole} / {track.trackType}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.requiredEvidence[0]}</p>
                </article>
              ))}
            </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Generated artifacts: `detroit-dynamo-production-preview-evidence.md` and `.json`. This matrix is a
            preview evidence handoff only; it does not enable Appwrite live mode, payment collection, waiver
            signatures, public claims, noindex removal, redirects, or root-route promotion.
          </p>
        </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  LIVE READINESS BOARD
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The live-readiness board turns the owner review packet, evidence intake worksheet, production-preview
                  matrix, launch gates, and external confirmation register into one final no-go/go surface. Every row
                  stays blocked until real proof is attached and the owner approves promotion.
                </p>
              </div>
              <span className="w-fit rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-red-100">
                {liveReadinessBoard.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Rows"
                value={liveReadinessBoard.summary.rowsTotal}
                hint="Launch phases"
                icon={ClipboardList}
              />
              <LeadStat
                label="Blocked"
                value={liveReadinessBoard.summary.blockedRows}
                hint="Cannot go live"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Allowed"
                value={liveReadinessBoard.summary.goLiveAllowedRows}
                hint="Must stay zero"
                icon={Inbox}
              />
              <LeadStat
                label="Live Gates"
                value={liveReadinessBoard.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Checkout"
                value={String(liveReadinessBoard.summary.checkoutAllowed)}
                hint="Blocked"
                icon={Database}
              />
              <LeadStat
                label="Redirects"
                value={String(liveReadinessBoard.summary.permanentRedirectsAllowed)}
                hint="Blocked"
                icon={ExternalLink}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {liveReadinessBoard.rows.slice(0, 6).map((row) => (
                <article key={row.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {row.liveDecision}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{row.ownerRole} / {row.phase}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.requiredProof[0]}</p>
                </article>
              ))}
            </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Generated artifacts: `detroit-dynamo-live-readiness-board.md`, `.json`, and `.csv`.
          </p>
        </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  LAUNCH ARTIFACT INDEX
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  The artifact index is the map for the full Detroit Dynamo launch packet. It names each handoff,
                  owner, launch question, verify command, and blocked live action so the owner can review the packet
                  without missing a dependency.
                </p>
              </div>
              <span className="w-fit rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {launchArtifactIndex.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Artifacts"
                value={launchArtifactIndex.summary.artifactsTotal}
                hint="Indexed handoffs"
                icon={ClipboardList}
              />
              <LeadStat
                label="Categories"
                value={launchArtifactIndex.summary.categories}
                hint="Packet groups"
                icon={Database}
              />
              <LeadStat
                label="Owner Roles"
                value={launchArtifactIndex.summary.ownerRoles}
                hint="Review owners"
                icon={Users}
              />
              <LeadStat
                label="Live Gates"
                value={launchArtifactIndex.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Publications"
                value={launchArtifactIndex.summary.publicationsUnlocked}
                hint="Must stay zero"
                icon={ShieldCheck}
              />
              <LeadStat
                label="Blocked"
                value={launchArtifactIndex.summary.blockedLiveActions}
                hint="Unique live actions"
                icon={Inbox}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {launchArtifactIndex.items.slice(0, 8).map((item) => (
                <article key={item.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {item.category}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{item.ownerRole} / {item.format}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.launchQuestion}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-launch-artifact-index.md`, `.json`, and `.csv`.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  DEPLOYMENT READINESS HANDOFF
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Deployment readiness collects the hosting, environment, production-preview, SEO, redirect, domain,
                  and rollback proof that must be attached before Detroit Dynamo can finalize production launch controls.
                  It keeps production deployments and public submissions at zero until real evidence exists.
                </p>
              </div>
              <span className="w-fit rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-red-100">
                {deploymentReadiness.decision.label}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <LeadStat
                label="Tracks"
                value={deploymentReadiness.summary.tracksTotal}
                hint="Deployment proof"
                icon={ClipboardList}
              />
              <LeadStat
                label="Evidence"
                value={deploymentReadiness.summary.evidenceRequiredTracks}
                hint="Still required"
                icon={Database}
              />
              <LeadStat
                label="Deployments"
                value={deploymentReadiness.summary.productionDeploymentsRecorded}
                hint="Must stay zero"
                icon={ExternalLink}
              />
              <LeadStat
                label="Submissions"
                value={deploymentReadiness.summary.productionSubmissionsRecorded}
                hint="Must stay zero"
                icon={Inbox}
              />
              <LeadStat
                label="Live Gates"
                value={deploymentReadiness.summary.liveGatesCleared}
                hint="Must stay zero"
                icon={RefreshCcw}
              />
              <LeadStat
                label="Redirects"
                value={String(deploymentReadiness.summary.permanentRedirectsAllowed)}
                hint="Blocked"
                icon={ShieldCheck}
              />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {deploymentReadiness.tracks.slice(0, 6).map((track) => (
                <article key={track.id} className="rounded-md border border-border bg-background p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">{track.label}</p>
                    <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                      {track.status}
                    </code>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{track.ownerRole} / {track.phase}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.requiredEvidence[0]}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Generated artifacts: `detroit-dynamo-deployment-readiness.md`, `.json`, and `.csv`.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Blocked Live Actions
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ownerLaunchReview.blockedLiveActions.slice(0, 16).map((action) => (
                <div key={action} className="rounded-md border border-border bg-background p-3 text-xs font-semibold text-foreground">
                  {action}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Launch Evidence</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LAUNCH EVIDENCE CHECKLIST</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                The external gates now have operator-ready evidence requirements. Each item names the owner, required
                artifact, verification action, blocked live actions, and acceptance criteria before the preview can
                become the public Detroit Dynamo brand.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              Preview Locked
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <LeadStat
              label="Evidence Items"
              value={launchEvidenceContract.summary.total}
              hint="Proof required before launch"
              icon={ClipboardList}
            />
            <LeadStat
              label="Evidence Required"
              value={launchEvidenceContract.summary.evidenceRequired}
              hint="Backend/provider/workflow proof"
              icon={Database}
            />
            <LeadStat
              label="Pending Confirmations"
              value={launchEvidenceContract.summary.pendingConfirmation}
              hint="Owner/legal/club approvals"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Preview Only"
              value={launchEvidenceContract.summary.previewOnly}
              hint="SEO and redirects gated"
              icon={RefreshCcw}
            />
            <LeadStat
              label="Blocked Actions"
              value={launchEvidenceContract.summary.blockedActions}
              hint="Cannot go live yet"
              icon={Inbox}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Gate Evidence Status
              </p>
              <div className="mt-3 grid gap-2">
                {launchEvidenceContract.checklistItems.slice(0, 7).map((item) => (
                  <article key={item.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-semibold text-foreground">{item.promotionGate}</p>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {item.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">{item.ownerRole} / {item.confirmationArea}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.requiredArtifact}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Blocked Live Actions
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {launchEvidenceContract.blockedActions.slice(0, 12).map((action) => (
                  <div key={action} className="rounded-md border border-border bg-background p-3 text-xs font-semibold text-foreground">
                    {action}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-border bg-background p-3">
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Artifact
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  `artifacts/detroit-dynamo/launch/detroit-dynamo-launch-evidence-checklist.md` is generated by
                  `npm run verify:dynamo-launch-evidence` and `npm run generate:dynamo-launch-assets`.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submitLaunchEvidence} className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  LAUNCH EVIDENCE ACTION LEDGER
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Capture local preview evidence actions for owner review. These records can attach proof, request
                  review, request changes, or rehearse a preview signoff, but they never clear live promotion gates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadLaunchEvidenceActions(launchEvidenceActions)}
                disabled={launchEvidenceActions.length === 0}
                className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export Actions
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Checklist item
                <select
                  value={launchEvidenceForm.checklist_item_id}
                  onChange={(event) => updateLaunchEvidenceForm('checklist_item_id', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {launchEvidenceContract.checklistItems.map((item) => (
                    <option key={item.id} value={item.id}>{item.confirmationArea} / {item.id}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Action
                <select
                  value={launchEvidenceForm.action}
                  onChange={(event) => updateLaunchEvidenceForm('action', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoLaunchEvidenceActionTypes.map((action) => (
                    <option key={action} value={action}>{action.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Actor role
                <select
                  value={launchEvidenceForm.actor_role}
                  onChange={(event) => updateLaunchEvidenceForm('actor_role', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoAdminRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Evidence label
                <input
                  type="text"
                  value={launchEvidenceForm.evidence_label}
                  onChange={(event) => updateLaunchEvidenceForm('evidence_label', event.target.value)}
                  placeholder="Package matrix draft, route QA report, waiver version register..."
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Artifact reference
                <input
                  type="text"
                  value={launchEvidenceForm.artifact_reference}
                  onChange={(event) => updateLaunchEvidenceForm('artifact_reference', event.target.value)}
                  placeholder="artifact path, provider test id, owner document link, deployment id..."
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
              Note
              <textarea
                value={launchEvidenceForm.note}
                onChange={(event) => updateLaunchEvidenceForm('note', event.target.value)}
                rows={3}
                placeholder="Local preview note. This does not approve launch or enable live gates."
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Live gate cleared is always stored as `false` in this preview ledger.
              </p>
              <button
                type="submit"
                disabled={launchEvidenceSubmitting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {launchEvidenceSubmitting ? 'Capturing...' : 'Capture Evidence Action'}
              </button>
            </div>

            {launchEvidenceMessage && (
              <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">{launchEvidenceMessage}</p>
            )}
            {launchEvidenceError && (
              <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{launchEvidenceError}</p>
            )}
          </form>

          <div className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Recent Preview Evidence Actions
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Browser-local rehearsal records for launch proof collection.
                </p>
              </div>
              <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                {launchEvidenceActions.length} actions
              </span>
            </div>
            {launchEvidenceActions.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                No preview launch evidence actions yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-2">
                {launchEvidenceActions.slice(0, 6).map((action) => (
                  <article key={action.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{action.evidence_label || action.checklist_item_id}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{action.confirmation_area} / {action.actor_role}</p>
                      </div>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {action.status}
                      </code>
                    </div>
                    <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">{action.artifact_reference || action.note}</p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Live gate cleared: {String(action.live_gate_cleared)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">External Confirmations</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">EXTERNAL CONFIRMATION ACTION QUEUE</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Rehearse owner approval routing for prices, waivers, league/facility facts, staff/roster proof, sponsor
                assets, media rights, SEO, and redirects. These preview actions never unlock publication, checkout,
                signatures, noindex removal, or permanent redirects.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadExternalConfirmationActions(externalConfirmationActions)}
              disabled={externalConfirmationActions.length === 0}
              className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export Actions
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <LeadStat
              label="Fixture Actions"
              value={externalConfirmationActionContract.actions.length}
              hint="All confirmation areas"
              icon={ClipboardList}
            />
            <LeadStat
              label="Areas Touched"
              value={externalConfirmationActionContract.summary.confirmationAreasTouched}
              hint="Payments, waivers, facts, proof"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Signoffs"
              value={externalConfirmationActionContract.summary.ownerSignoffsRequested}
              hint="Owner review requests"
              icon={Users}
            />
            <LeadStat
              label="Changes"
              value={externalConfirmationActionContract.summary.changesRequested}
              hint="Revision paths"
              icon={RefreshCcw}
            />
            <LeadStat
              label="Live Gates"
              value={externalConfirmationActionContract.summary.liveGatesCleared}
              hint="Must stay zero"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Publications"
              value={externalConfirmationActionContract.summary.publicationsUnlocked}
              hint="Must stay zero"
              icon={Inbox}
            />
          </div>

          <form onSubmit={submitExternalConfirmation} className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Confirmation area
                <select
                  value={externalConfirmationForm.confirmation_area}
                  onChange={(event) => updateExternalConfirmationForm('confirmation_area', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoExternalConfirmationRegister.map((item) => (
                    <option key={item.area} value={item.area}>{item.area} / {item.ownerRole}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Action
                <select
                  value={externalConfirmationForm.action}
                  onChange={(event) => updateExternalConfirmationForm('action', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoExternalConfirmationActionTypes.map((action) => (
                    <option key={action} value={action}>{action.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Actor role
                <select
                  value={externalConfirmationForm.actor_role}
                  onChange={(event) => updateExternalConfirmationForm('actor_role', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoAdminRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Evidence label
                <input
                  type="text"
                  value={externalConfirmationForm.evidence_label}
                  onChange={(event) => updateExternalConfirmationForm('evidence_label', event.target.value)}
                  placeholder="Facility permit, waiver version, package matrix, sponsor logo approval..."
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Artifact reference
                <input
                  type="text"
                  value={externalConfirmationForm.artifact_reference}
                  onChange={(event) => updateExternalConfirmationForm('artifact_reference', event.target.value)}
                  placeholder="artifact path, owner document link, official email id, provider test id..."
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
              Note
              <textarea
                value={externalConfirmationForm.note}
                onChange={(event) => updateExternalConfirmationForm('note', event.target.value)}
                rows={3}
                placeholder="Preview confirmation note. This does not approve publication or clear live gates."
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Live gate cleared and publication unlocked are always stored as `false` in this preview queue.
              </p>
              <button
                type="submit"
                disabled={externalConfirmationSubmitting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {externalConfirmationSubmitting ? 'Capturing...' : 'Capture Confirmation Action'}
              </button>
            </div>

            {externalConfirmationMessage && (
              <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">{externalConfirmationMessage}</p>
            )}
            {externalConfirmationError && (
              <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{externalConfirmationError}</p>
            )}
          </form>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Fixture Confirmation Actions
              </p>
              <div className="mt-3 grid gap-2">
                {externalConfirmationActionContract.actions.slice(0, 6).map((action) => (
                  <article key={action.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-semibold text-foreground">{action.confirmation_area}</p>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {action.status}
                      </code>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{action.evidence_label}</p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Publication unlocked: {String(action.publication_unlocked)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Recent Preview Confirmation Actions
              </p>
              {externalConfirmationActions.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  No preview external confirmation actions yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {externalConfirmationActions.slice(0, 6).map((action) => (
                    <article key={action.id} className="rounded-md border border-border bg-background p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{action.evidence_label || action.confirmation_area}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{action.confirmation_area} / {action.actor_role}</p>
                        </div>
                        <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                          {action.status}
                        </code>
                      </div>
                      <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">{action.artifact_reference || action.note}</p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Live gate cleared: {String(action.live_gate_cleared)} / Publication unlocked: {String(action.publication_unlocked)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Protected Writes</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LIVE MODULE WRITE CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                `detroitDynamoAdminModuleWriteAction` is the authenticated mutation path planned for future dashboard
                modules. It scopes create, update, and archive requests to a module action, a permitted `dd_*`
                collection, an active trusted role grant, and an audit event before any live Appwrite write is treated
                as complete.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {adminModuleWriteContract.functionExecutePermission} only
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LeadStat
              label="Write Modules"
              value={adminModuleWriteContract.supportedModules.length}
              hint="Protected dashboard surfaces"
              icon={Database}
            />
            <LeadStat
              label="Mutations"
              value={adminModuleWriteContract.mutations.length}
              hint="Create, update, archive"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Success Fixtures"
              value={adminModuleWriteContract.successFixtures.length}
              hint="Guarded module writes"
              icon={ClipboardList}
            />
            <LeadStat
              label="Rejection Fixtures"
              value={adminModuleWriteContract.rejectionFixtures.length}
              hint="Auth, role, gate, collection guards"
              icon={Inbox}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Write Contract Targets
              </p>
              <div className="mt-3 grid gap-2">
                {[
                  ['Role Grants', adminModuleWriteContract.roleAssignmentCollectionId],
                  ['Audit Events', adminModuleWriteContract.auditEventCollectionId],
                  ['External Gate', 'Required for payment, waiver, schedule/result, and launch-content modules'],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.45fr_1fr]">
                    <span className="font-semibold text-foreground">{label}</span>
                    <code className="break-all text-accent">{value}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Example Write Fixtures
              </p>
              <div className="mt-3 grid gap-2">
                {adminModuleWriteContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs md:grid-cols-[0.8fr_0.55fr_0.6fr]">
                    <span className="font-semibold text-foreground">{fixture.label}</span>
                    <code className="break-all text-accent">{fixture.mutation}</code>
                    <span className="text-muted-foreground">{fixture.actorRole}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {adminModuleWriteContract.rejectionFixtures.map((fixture) => (
                  <article key={fixture.id} className="rounded-md border border-border bg-background p-3">
                    <p className="font-semibold text-foreground">{fixture.label}</p>
                    <p className="mt-1 font-mono text-xs text-accent">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{fixture.reason}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Protected Records</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LIVE RECORD WORKSPACE CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                The protected module detail pages use a reusable record workspace for flattened records, search-ready
                text, CSV export, schema-required field checks, and safe update/archive payload preparation. This
                contract verifies those operator behaviors without submitting live writes or bypassing the module write
                console.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              verify:dynamo-admin-record-workspace
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <LeadStat
              label="Fixture Records"
              value={adminRecordWorkspaceContract.flattenedRecords.length}
              hint="Flattened module rows"
              icon={Database}
            />
            <LeadStat
              label="Collections"
              value={adminRecordWorkspaceContract.fixtureCollections.length}
              hint="Player and sponsor fixtures"
              icon={ClipboardList}
            />
            <LeadStat
              label="Covered Helpers"
              value={adminRecordWorkspaceContract.coveredHelpers.length}
              hint="Workspace behavior checks"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Complete Missing"
              value={adminRecordWorkspaceContract.completePlayerProfile.missingRequiredFieldCount}
              hint="Required field readiness"
              icon={Users}
            />
            <LeadStat
              label="Archive Prep"
              value={adminRecordWorkspaceContract.preparedArchive.status}
              hint="Review payload only"
              icon={Inbox}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Workspace Evidence
              </p>
              <div className="mt-3 grid gap-2">
                {[
                  ['CSV Header', adminRecordWorkspaceContract.csvHeader],
                  ['Incomplete Required Fields', adminRecordWorkspaceContract.incompletePlayerProfile.missingRequiredFields.join(', ') || 'None'],
                  ['Prepared Update Source', adminRecordWorkspaceContract.preparedUpdate.source],
                  ['Prepared Archive Previous Status', adminRecordWorkspaceContract.preparedArchive.previous_status],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.45fr_1fr]">
                    <span className="font-semibold text-foreground">{label}</span>
                    <code className="break-all text-accent">{value}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Helper Coverage
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {adminRecordWorkspaceContract.coveredHelpers.map((helper) => (
                  <code key={helper} className="rounded-md border border-border bg-background p-3 text-xs text-accent">
                    {helper}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Trusted Role Grants</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LIVE ROLE GRANT CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                `detroitDynamoAdminRoleGrantAction` is the authenticated mutation path planned for Master Admin role
                management. It creates, suspends, revokes, expires, or reactivates `dd_admin_role_assignments` records
                server-side, then writes a matching `dd_admin_audit_events` record before returning success.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {adminRoleGrantContract.functionExecutePermission} only
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LeadStat
              label="Grant Actions"
              value={adminRoleGrantContract.actions.length}
              hint="Grant, suspend, revoke, expire, reactivate"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Success Fixtures"
              value={adminRoleGrantContract.successFixtures.length}
              hint="Master Admin role paths"
              icon={ClipboardList}
            />
            <LeadStat
              label="Rejection Fixtures"
              value={adminRoleGrantContract.rejectionFixtures.length}
              hint="Auth, bootstrap, self-lockout guards"
              icon={Inbox}
            />
            <LeadStat
              label="Audit Target"
              value="1"
              hint={adminRoleGrantContract.auditEventCollectionId}
              icon={Database}
            />
          </div>

          <form onSubmit={submitRoleGrant} className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  ROLE GRANT ACTION CONSOLE
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Local preview mode captures the action without network calls. Appwrite mode invokes
                  `detroitDynamoAdminRoleGrantAction` as the signed-in dashboard user after the function is deployed.
                </p>
              </div>
              <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
                {['local', 'appwrite'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setRoleGrantBackendMode(mode)}
                    className={`min-h-10 rounded-md border px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                      roleGrantMode === mode
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-background text-foreground hover:border-accent/40'
                    }`}
                  >
                    {mode === 'local' ? 'Preview' : 'Appwrite'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Action
                <select
                  value={roleGrantForm.action}
                  onChange={(event) => updateRoleGrantForm('action', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {adminRoleGrantContract.actions.map((action) => (
                    <option key={action} value={action}>{action.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Role
                <select
                  value={roleGrantForm.role}
                  onChange={(event) => updateRoleGrantForm('role', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {detroitDynamoAdminRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Expires at
                <input
                  type="datetime-local"
                  value={roleGrantForm.expires_at}
                  onChange={(event) => updateRoleGrantForm('expires_at', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Target Appwrite user id
                <input
                  type="text"
                  value={roleGrantForm.target_user_id}
                  onChange={(event) => updateRoleGrantForm('target_user_id', event.target.value)}
                  placeholder="Required for grant_role"
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Assignment document id
                <input
                  type="text"
                  value={roleGrantForm.assignment_id}
                  onChange={(event) => updateRoleGrantForm('assignment_id', event.target.value)}
                  placeholder="Required for mutation actions"
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Email
                <input
                  type="email"
                  value={roleGrantForm.email}
                  onChange={(event) => updateRoleGrantForm('email', event.target.value)}
                  placeholder="staff@detroitdynamo.com"
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
              Scope note
              <textarea
                value={roleGrantForm.scope_note}
                onChange={(event) => updateRoleGrantForm('scope_note', event.target.value)}
                placeholder="Why this role is being granted or changed"
                rows={3}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm leading-6">
                {roleGrantMessage && <p className="font-semibold text-emerald-600">{roleGrantMessage}</p>}
                {roleGrantError && <p className="font-semibold text-destructive">{roleGrantError}</p>}
                {!roleGrantMessage && !roleGrantError && (
                  <p className="text-muted-foreground">
                    Preview actions are stored in this browser. Appwrite mode falls back cleanly if credentials or the function are unavailable.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={roleGrantSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {roleGrantSubmitting ? 'Submitting' : 'Submit Role Action'}
              </button>
            </div>

            {roleGrantActions.length > 0 && (
              <div className="mt-5 rounded-md border border-border bg-background p-3">
                <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Recent Preview Role Actions
                </p>
                <div className="mt-3 grid gap-2">
                  {roleGrantActions.slice(0, 4).map((item) => (
                    <div key={item.id} className="grid gap-2 rounded-md border border-border bg-secondary/45 p-3 text-xs md:grid-cols-[0.65fr_0.55fr_0.55fr_0.8fr]">
                      <span className="font-semibold text-foreground">{item.action?.replaceAll('_', ' ')}</span>
                      <span className="text-muted-foreground">{item.role}</span>
                      <code className="break-all text-accent">{item.status}</code>
                      <span className="break-all text-muted-foreground">{item.assignment_id || item.target_user_id || item.audit_event_id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Contract Collections
              </p>
              <div className="mt-3 grid gap-2">
                <div className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.55fr_1fr]">
                  <span className="font-semibold text-foreground">Assignments</span>
                  <code className="break-all text-accent">{adminRoleGrantContract.assignmentCollectionId}</code>
                </div>
                <div className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.55fr_1fr]">
                  <span className="font-semibold text-foreground">Audit Events</span>
                  <code className="break-all text-accent">{adminRoleGrantContract.auditEventCollectionId}</code>
                </div>
                <div className="grid gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-xs sm:grid-cols-[0.55fr_1fr]">
                  <span className="font-semibold text-foreground">Bootstrap Env</span>
                  <code className="break-all text-accent">{adminRoleGrantContract.bootstrapEnv}</code>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Example Grant Fixtures
              </p>
              <div className="mt-3 grid gap-2">
                {adminRoleGrantContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs md:grid-cols-[0.9fr_0.55fr_0.7fr]">
                    <span className="font-semibold text-foreground">{fixture.label}</span>
                    <code className="text-accent">{fixture.action}</code>
                    <span className="text-muted-foreground">{fixture.role}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {adminRoleGrantContract.rejectionFixtures.map((fixture) => (
                  <article key={fixture.id} className="rounded-md border border-border bg-background p-3">
                    <p className="font-semibold text-foreground">{fixture.label}</p>
                    <p className="mt-1 font-mono text-xs text-accent">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{fixture.reason}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Audit Trail</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LOCAL AUDIT EVENT LEDGER</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Browser-local admin transitions now create audit events shaped like the future `dd_admin_audit_events`
                records. This keeps preview queue work aligned with the live Appwrite mutation contract before credentials
                are used.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadPreviewAuditEvents(auditEvents)}
              disabled={auditEvents.length === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export Audit CSV
            </button>
          </div>

          {auditEvents.length === 0 ? (
            <div className="mt-5 rounded-md border border-border bg-secondary/45 p-6 text-center">
              <ShieldCheck className="mx-auto h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-oswald text-xl font-bold tracking-wide text-foreground">NO LOCAL AUDIT EVENTS YET</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Move a local preview lead through the follow-up queue to create a browser-only audit event.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/45">
              {auditEvents.slice(0, 10).map((event) => (
                <article key={event.id} className="grid gap-3 px-4 py-4 text-sm text-muted-foreground lg:grid-cols-[0.75fr_0.75fr_1fr]">
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                      {event.action}
                    </p>
                    <h3 className="mt-2 font-semibold text-foreground">{event.actor_role}</h3>
                    <p className="mt-1 text-xs">{event.created_at}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-accent">{event.previous_status} to {event.next_status}</p>
                    <p className="mt-2 break-all text-xs">{event.target_model} / {event.target_record_id}</p>
                  </div>
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="text-xs leading-5 text-muted-foreground">{event.event_summary}</p>
                    <code className="mt-2 block break-all text-[10px] text-accent">{event.id}</code>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-oswald text-lg font-bold tracking-wide text-foreground">FORM INTAKE MODE</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Current browser mode:{' '}
                <span className="font-semibold text-foreground">
                  {backendMode === 'appwrite' ? 'Appwrite intake with local fallback' : 'Local preview queue'}
                </span>
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setLeadBackendMode('local')}
                className={`min-h-10 rounded-md border px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] transition ${
                  backendMode === 'local'
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-secondary text-foreground hover:border-accent/40'
                }`}
              >
                Local Preview
              </button>
              <button
                type="button"
                onClick={() => setLeadBackendMode('appwrite')}
                className={`min-h-10 rounded-md border px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] transition ${
                  backendMode === 'appwrite'
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-secondary text-foreground hover:border-accent/40'
                }`}
              >
                Appwrite Intake
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Safeguarding</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">SAFEGUARDING AND DATA PRIVACY CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Youth club operations need more than good forms. These tracks keep guardian consent, coach verification,
                youth communication, medical data, media releases, roster clearance, data retention, and audit trails
                explicit before live registration or sensitive admin workflows go online.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {safeguardingContract.safeguardingTracks.length} Tracks
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {safeguardingContract.safeguardingTracks.map((track) => (
              <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{track.ownerRole}</p>
                  </div>
                  <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                    {track.activationStatus}
                  </code>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.blockedAction}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Protection Mode</p>
                    <p className="mt-1 font-mono text-xs text-accent">{track.protectionMode}</p>
                  </div>
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Admin Modules</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{track.adminModules.join(', ')}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-border bg-background p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Preview Handling
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.previewHandling}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Promotion Cutover</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">PROMOTION CUTOVER CONTROL</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                This is the root-switch contract for eventually replacing DetroitDynamo.com with Detroit Dynamo. It keeps
                route promotion, redirects, backend intake, payments, waivers, legal/support communications, proof
                publication, monitoring, and rollback evidence explicit before the preview becomes the public brand.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {promotionCutoverContract.cutoverTracks.length} Tracks
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {promotionCutoverContract.cutoverTracks.map((track) => (
              <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{track.ownerRole} / {track.phase}</p>
                  </div>
                  <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                    {track.status}
                  </code>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.blockedUntil}</p>
                <div className="mt-4 rounded-md border border-border bg-background p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Rollback
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.rollbackAction}</p>
                </div>
                <div className="mt-4">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Evidence</p>
                  <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
                    {track.requiredEvidence.slice(0, 3).map((evidence) => (
                      <li key={evidence}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Claim Safety</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">PUBLIC CLAIM SAFETY CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                These guards keep the preview competitive without overstating reality. League membership, facilities,
                staff, rosters, sponsors, fixtures, player outcomes, launch status, and proof content stay in
                future-pathway, placeholder, or approval-required language until evidence exists.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {claimSafetyContract.claimSafetyTracks.length} Guards
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {claimSafetyContract.claimSafetyTracks.map((track) => (
              <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{track.confirmationArea}</p>
                  </div>
                  <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                    {track.confirmationStatus}
                  </code>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.blockedClaim}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Publish Mode</p>
                    <p className="mt-1 font-mono text-xs text-accent">{track.publishMode}</p>
                  </div>
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Admin Modules</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{track.adminModules.join(', ')}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-border bg-background p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Safe Language
                  </p>
                  <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
                    {track.safeLanguage.slice(0, 3).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Lead Intake</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">PUBLIC FORM HANDOFF CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                `detroitDynamoLeadIntake` is the public Appwrite function planned for Detroit Dynamo form submissions.
                These fixtures show which form variants are accepted, which records each variant should create, and
                which malformed submissions must be rejected before anything writes to the isolated `dd_*` collections.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {leadIntakeContract.functionExecutePermission} execute
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <LeadStat
              label="Form Variants"
              value={leadIntakeContract.variants.length}
              hint="Contact, training, youth, tryout, senior, sponsor"
              icon={Inbox}
            />
            <LeadStat
              label="Success Fixtures"
              value={leadIntakeContract.successFixtures.length}
              hint="Expected records and pipeline fields"
              icon={Database}
            />
            <LeadStat
              label="Rejection Fixtures"
              value={leadIntakeContract.rejectionFixtures.length}
              hint="Route, type, player, and sponsor guards"
              icon={ShieldCheck}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Accepted Public Payloads
              </p>
              <div className="mt-3 grid gap-2">
                {leadIntakeContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs md:grid-cols-[0.45fr_0.6fr_1fr]">
                    <span className="font-semibold text-foreground">{fixture.leadType}</span>
                    <code className="break-all text-accent">{fixture.sourceRoute}</code>
                    <span className="text-muted-foreground">{fixture.functionCreatedModels.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Rejection Guards
              </p>
              <div className="mt-3 grid gap-2">
                {leadIntakeContract.rejectionFixtures.map((fixture) => (
                  <div key={fixture.id} className="rounded-md border border-border bg-background p-3 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-foreground">{fixture.label}</span>
                      <code className="text-accent">{fixture.expectedResponse.httpStatus}</code>
                    </div>
                    <p className="mt-2 leading-5 text-muted-foreground">{fixture.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Preview Follow-Up Queue</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">OPERATOR INTAKE BOARD</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Browser-local submissions are grouped into the future lead pipeline with owner roles, urgency windows,
                next statuses, and target modules. This is a read-only operating preview until Appwrite-backed actions go live.
              </p>
            </div>
            <div className="grid min-w-48 grid-cols-3 overflow-hidden rounded-md border border-border bg-secondary text-center">
              <div className="border-r border-border px-3 py-2">
                <p className="font-oswald text-xl font-bold text-foreground">{pipelineQueue.active}</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Active</p>
              </div>
              <div className="border-r border-border px-3 py-2">
                <p className="font-oswald text-xl font-bold text-yellow-100">{pipelineQueue.dueSoon}</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Due</p>
              </div>
              <div className="px-3 py-2">
                <p className="font-oswald text-xl font-bold text-red-100">{pipelineQueue.overdue}</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Late</p>
              </div>
            </div>
          </div>

          {transitionMessage && (
            <div className="mt-5 rounded-md border border-border bg-secondary/65 px-4 py-3 text-sm leading-6 text-muted-foreground">
              {transitionMessage}
            </div>
          )}

          {pipelineQueue.cards.length === 0 ? (
            <div className="mt-5 rounded-md border border-border bg-secondary/45 p-6 text-center">
              <Inbox className="mx-auto h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-oswald text-xl font-bold tracking-wide text-foreground">NO FOLLOW-UP WORK YET</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Submit a Detroit Dynamo preview form in this browser to see the future intake queue.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {pipelineQueue.cards.slice(0, 8).map((card) => (
                <article key={card.id} className="rounded-lg border border-border bg-secondary/45 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                        {card.leadType} / {card.ownerRole}
                      </p>
                      <h3 className="mt-2 font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{card.interest}</p>
                    </div>
                    <span className={`w-fit rounded-md border px-2 py-1 font-mono text-[10px] ${urgencyBadgeClass(card.urgency)}`}>
                      {card.urgency.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 rounded-md border border-border bg-background p-3 text-xs text-muted-foreground sm:grid-cols-[0.55fr_1fr]">
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Status</p>
                      <p className="mt-1 font-semibold text-foreground">{card.label}</p>
                      <p className="mt-1 font-mono text-[10px] text-accent">
                        {card.hoursUntilDue >= 0 ? `${card.hoursUntilDue}h left` : `${Math.abs(card.hoursUntilDue)}h late`}
                      </p>
                    </div>
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Owner Action</p>
                      <p className="mt-1 leading-5">{card.ownerAction}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {card.nextStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => transitionLead(card.id, status, card.ownerRole)}
                        className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
                        aria-label={`Move ${card.title} to ${status}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {card.transitionCount > 0 && (
                    <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
                      Last moved by {card.lastTransitionBy || 'Preview Admin'} at {card.lastTransitionAt || 'unknown time'}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Lead Pipeline</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">FOLLOW-UP STATUS POLICY</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Status stages for turning preview leads into real booking, tryout, player, team, sponsor, waiver, or
                payment records once the Appwrite-backed dashboard is active.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {detroitDynamoLeadPipelineStages.length} Stages
            </span>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {detroitDynamoLeadPipelineStages.map((stage) => (
              <article key={stage.status} className="rounded-md border border-border bg-secondary/45 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-oswald text-lg font-bold tracking-wide text-foreground">{stage.label}</p>
                    <code className="mt-1 block text-xs text-accent">{stage.status}</code>
                  </div>
                  <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                    {stage.maxAgeHours}h
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{stage.ownerAction}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {stage.appliesTo.map((leadType) => (
                    <span key={leadType} className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {leadType}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Backend Activation</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">APPWRITE HANDOFF PATH</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Ordered steps for moving Detroit Dynamo forms from local preview storage into isolated Appwrite collections.
                The sequence keeps the current Detroit Dynamo backend untouched until promotion is approved.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {detroitDynamoBackendActivationSteps.length} Steps
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {detroitDynamoBackendActivationSteps.map((item) => (
              <article key={item.step} className="grid gap-3 rounded-md border border-border bg-secondary/45 p-4 md:grid-cols-[0.35fr_0.85fr_1fr_1fr]">
                <div>
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Step</p>
                  <p className="mt-1 font-oswald text-2xl font-bold text-foreground">{item.step}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.ownerRole}</p>
                </div>
                <code className="h-fit break-all rounded-md border border-border bg-background px-3 py-2 text-xs text-accent">
                  {item.command}
                </code>
                <p className="text-xs leading-5 text-muted-foreground">{item.nextAction}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Pipeline Actions</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LIVE STATUS MUTATION CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                The future Appwrite admin dashboard should call `detroitDynamoLeadPipelineAction` only for authenticated
                status changes on pipeline-backed records. These fixtures are the handoff between local preview
                transitions, Appwrite collections, server-side validation, and durable admin audit events.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {pipelineActionContract.functionExecutePermission} only
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LeadStat
              label="Pipeline Models"
              value={pipelineActionContract.supportedModels.length}
              hint="ContactLead, Booking, TryoutRegistration, Sponsor"
              icon={Database}
            />
            <LeadStat
              label="Success Fixtures"
              value={pipelineActionContract.successFixtures.length}
              hint="Allowed transitions with expected updates"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Rejection Fixtures"
              value={pipelineActionContract.rejectionFixtures.length}
              hint="Auth, transition, and target guards"
              icon={ClipboardList}
            />
            <LeadStat
              label="Audit Events"
              value="1"
              hint={pipelineActionContract.auditEventCollectionId}
              icon={ShieldCheck}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Supported Targets
              </p>
              <div className="mt-3 grid gap-2">
                {pipelineActionContract.supportedModels.map((item) => (
                  <div key={item.model} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.5fr_1fr]">
                    <span className="font-semibold text-foreground">{item.model}</span>
                    <code className="break-all text-accent">{item.collectionId}</code>
                  </div>
                ))}
                <div className="grid gap-2 rounded-md border border-accent/30 bg-accent/10 p-3 text-xs sm:grid-cols-[0.5fr_1fr]">
                  <span className="font-semibold text-foreground">AdminAuditEvent</span>
                  <code className="break-all text-accent">{pipelineActionContract.auditEventCollectionId}</code>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Example Allowed Actions
              </p>
              <div className="mt-3 grid gap-2">
                {pipelineActionContract.successFixtures.slice(0, 4).map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs md:grid-cols-[0.8fr_0.45fr_0.45fr]">
                    <span className="font-semibold text-foreground">{fixture.label}</span>
                    <code className="text-muted-foreground">{fixture.currentStatus}</code>
                    <code className="text-accent">{fixture.nextStatus}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-3">
            {pipelineActionContract.rejectionFixtures.map((fixture) => (
              <article key={fixture.id} className="rounded-md border border-border bg-secondary/45 p-3">
                <p className="font-semibold text-foreground">{fixture.label}</p>
                <p className="mt-1 font-mono text-xs text-accent">{fixture.expectedResponse.httpStatus}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{fixture.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Protected Reads</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">LIVE MODULE READ CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                `detroitDynamoAdminModuleRead` is the authenticated read path planned for future protected admin modules.
                It scopes each request to a module slug, a permitted `dd_*` collection, a capped document limit, and an
                admin role with view access, then verifies that role against `dd_admin_role_assignments` before Appwrite
                records are returned.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {adminModuleReadContract.functionExecutePermission} only
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LeadStat
              label="Read Modules"
              value={adminModuleReadContract.supportedModules.length}
              hint="Protected dashboard surfaces"
              icon={Database}
            />
            <LeadStat
              label="Success Fixtures"
              value={adminModuleReadContract.successFixtures.length}
              hint="Role-scoped read paths"
              icon={ShieldCheck}
            />
            <LeadStat
              label="Rejection Fixtures"
              value={adminModuleReadContract.rejectionFixtures.length}
              hint="Auth, role, module, collection guards"
              icon={ClipboardList}
            />
            <LeadStat
              label="Read Limit"
              value={adminModuleReadContract.defaultLimit}
              hint="Documents per collection"
              icon={Inbox}
            />
            <LeadStat
              label="Role Grants"
              value="1+"
              hint={adminModuleReadContract.roleAssignmentCollectionId}
              icon={ShieldCheck}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Supported Modules
              </p>
              <div className="mt-3 grid gap-2">
                {adminModuleReadContract.supportedModules.slice(0, 8).map((item) => (
                  <div key={item.slug} className="rounded-md border border-border bg-background p-3 text-xs">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <span className="font-semibold text-foreground">{item.module}</span>
                      <code className="text-accent">{item.slug}</code>
                    </div>
                    <p className="mt-2 leading-5 text-muted-foreground">{item.collectionIds.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Example Read Fixtures
              </p>
              <div className="mt-3 grid gap-2">
                {adminModuleReadContract.successFixtures.map((fixture) => (
                  <div key={fixture.id} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs md:grid-cols-[0.9fr_0.7fr_0.8fr]">
                    <span className="font-semibold text-foreground">{fixture.label}</span>
                    <code className="break-all text-accent">{fixture.collectionId}</code>
                    <span className="text-muted-foreground">{fixture.actorRole}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {adminModuleReadContract.rejectionFixtures.map((fixture) => (
                  <article key={fixture.id} className="rounded-md border border-border bg-background p-3">
                    <p className="font-semibold text-foreground">{fixture.label}</p>
                    <p className="mt-1 font-mono text-xs text-accent">{fixture.expectedResponse.httpStatus}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{fixture.reason}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Role Permissions</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">ADMIN ACCESS MATRIX</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Role-by-module access for the future dashboard. This keeps payment, waiver, roster, sponsor, and
                publishing controls separated instead of giving every staff member the same permissions.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {detroitDynamoRoleAccessSummaries.length} Roles
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {detroitDynamoRoleAccessSummaries.map((role) => (
              <article key={role.role} className="rounded-md border border-border bg-secondary/45 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{role.role}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{role.purpose}</p>
                  </div>
                  <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                    {role.controlModules.length} control
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Manage / Approve
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {role.controlModules.join(', ') || 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Contribute
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {role.contributeModules.join(', ') || 'None'}
                    </p>
                  </div>
                </div>
                {role.sensitiveControls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.sensitiveControls.map((control) => (
                      <span key={control} className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                        {control}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">External Confirmations</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">FACTS BEFORE CLAIMS</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                These approvals keep Detroit Dynamo from publishing pricing, legal, league, facility, staff, roster,
                sponsor, or proof claims before the organization has evidence.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {detroitDynamoExternalConfirmationRegister.length} Registers
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {detroitDynamoExternalConfirmationRegister.map((item) => (
              <article key={item.area} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{item.area}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.ownerRole}</p>
                  </div>
                  <span className="w-fit rounded-md border border-border bg-secondary px-3 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    {item.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.publishRule}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.relatedModels.map((model) => (
                    <code key={model} className="rounded-md border border-border bg-secondary px-2 py-1 text-[10px] text-accent">
                      {model}
                    </code>
                  ))}
                </div>
                <div className="mt-4 rounded-md border border-border bg-secondary/50 p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Required Facts
                  </p>
                  <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
                    {item.requiredFacts.slice(0, 3).map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Payment / Waiver Gates</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">CHECKOUT AND SIGNATURE SAFETY CONTRACT</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                These tracks keep Detroit Dynamo in inquiry-only mode until package prices, provider products, refund
                rules, waiver text, and signature workflows are approved. No checkout or signature collection should go
                live from the preview state.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              Preview Locked
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <LeadStat
              label="Payment Tracks"
              value={externalGateContract.paymentPackageTracks.length}
              hint="Provider products not connected"
              icon={Database}
            />
            <LeadStat
              label="Waiver Tracks"
              value={externalGateContract.waiverTracks.length}
              hint="Signatures not enabled"
              icon={ShieldCheck}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Payment / Package Tracks
              </p>
              <div className="mt-3 grid gap-2">
                {externalGateContract.paymentPackageTracks.map((track) => (
                  <article key={track.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-semibold text-foreground">{track.label}</p>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {track.providerStatus}
                      </code>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.blockedAction}</p>
                    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                      Approval: {track.approvalRequired.slice(0, 3).join(', ')}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Waiver / Signature Tracks
              </p>
              <div className="mt-3 grid gap-2">
                {externalGateContract.waiverTracks.map((track) => (
                  <article key={track.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-semibold text-foreground">{track.label}</p>
                      <code className="w-fit rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-accent">
                        {track.signatureMode}
                      </code>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.blockedAction}</p>
                    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                      Approval: {track.requiredApprovals.slice(0, 3).join(', ')}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Launch Readiness</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">PROMOTION GATES</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                This keeps the Detroit Dynamo launch from becoming just a skin swap. Each gate needs proof before the
                preview becomes the public brand.
              </p>
            </div>
            <Link
              to="/detroit-dynamo/admin-foundation"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              View Full Foundation
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {detroitDynamoLaunchReadiness.map((item) => (
              <article key={item.category} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-foreground">{item.category}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.ownerRole}</p>
                  </div>
                  <span className="w-fit rounded-md border border-border bg-secondary px-3 py-1 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    {item.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.nextAction}</p>
                <div className="mt-4 rounded-md border border-border bg-secondary/50 p-3">
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Evidence Needed
                  </p>
                  <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
                    {item.evidenceNeeded.map((evidence) => (
                      <li key={evidence}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid gap-3 border-b border-border bg-secondary px-4 py-3 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground md:grid-cols-[0.8fr_0.55fr_1.25fr_1fr]">
              <span>Gate</span>
              <span>Status</span>
              <span>Required Evidence</span>
              <span>Next Action</span>
            </div>
            <div className="divide-y divide-border">
              {detroitDynamoPromotionGates.map((item) => (
                <article key={item.gate} className="grid gap-3 px-4 py-4 text-sm text-muted-foreground md:grid-cols-[0.8fr_0.55fr_1.25fr_1fr]">
                  <p className="font-semibold text-foreground">{item.gate}</p>
                  <p className="font-mono text-xs text-accent">{item.status}</p>
                  <p className="leading-6">{item.requiredEvidence}</p>
                  <p className="leading-6">{item.nextAction}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-oswald text-xl font-bold tracking-wide text-foreground">PREVIEW LEAD INBOX</h2>
                <p className="mt-1 text-xs text-muted-foreground">Use this to review form shape before Appwrite persistence.</p>
              </div>
              <button
                type="button"
                onClick={() => downloadPreviewLeads(leads)}
                disabled={leads.length === 0}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export CSV
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-oswald text-2xl font-bold tracking-wide text-foreground">NO PREVIEW LEADS YET</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  Submit a Detroit Dynamo training, tryout, youth, sponsor, senior-team, or contact form in this browser,
                  then refresh this admin view.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leads.map((lead) => {
                  const routing = detroitDynamoLeadRouting[lead.lead_type] || detroitDynamoLeadRouting.contact;
                  const title = lead.player_name || lead.contact_name || lead.organization || 'Unnamed lead';
                  return (
                    <article key={lead.id} className="grid gap-4 p-4 lg:grid-cols-[0.85fr_1fr_1fr]">
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                          {lead.lead_type || 'lead'}
                        </p>
                        <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">{title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{lead.created_at}</p>
                      </div>
                      <div className="text-sm leading-6 text-muted-foreground">
                        <p className="text-foreground">{lead.email || 'No email'}</p>
                        <p>{lead.phone || 'No phone'}</p>
                        <p>{lead.team_interest || lead.program_interest || lead.package_interest || 'General inquiry'}</p>
                        {lead.notes && <p className="mt-2 line-clamp-2">{lead.notes}</p>}
                      </div>
                      <div className="rounded-md border border-border bg-secondary/50 p-3 text-sm leading-6 text-muted-foreground">
                        <p className="font-semibold text-foreground">{routing.destinationModel}</p>
                        <p>{routing.ownerRole}</p>
                        <p className="mt-1">{routing.nextAction}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="grid gap-6">
            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-oswald text-xl font-bold tracking-wide text-foreground">ROLE PLAN</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {detroitDynamoAdminRoles.map((role) => (
                  <span key={role} className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {role}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-oswald text-xl font-bold tracking-wide text-foreground">REDIRECT PLAN</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {detroitDynamoRedirectPlan.map((item) => (
                  <div key={`${item.from}-${item.to}`} className="rounded-md border border-border bg-secondary p-3">
                    <p className="font-mono text-xs text-accent">{item.from} {'->'} {item.to}</p>
                    <p className="mt-2 text-xs font-semibold text-foreground">{item.timing}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-oswald text-xl font-bold tracking-wide text-foreground">MODULES</h2>
              </div>
              <div className="mt-4 grid gap-2">
                {detroitDynamoAdminModuleRegistry.map((item) => (
                  <div key={item.module} className="rounded-md border border-border bg-secondary px-3 py-3">
                    {(() => {
                      const actionGuard = detroitDynamoModuleActionGuards.find((guard) => guard.module === item.module);
                      return (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-foreground">{item.module}</p>
                            <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-accent">
                              {item.status.replaceAll('_', ' ')}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.purpose}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.collectionIds.map((collectionId) => (
                              <code key={collectionId} className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-accent">
                                {collectionId}
                              </code>
                            ))}
                          </div>
                          {actionGuard && (
                          <div className="mt-3 grid gap-1">
                            {actionGuard.actions.slice(0, 2).map((action) => (
                              <p key={action.action} className="text-[10px] leading-4 text-muted-foreground">
                                  <span className="font-semibold text-foreground">{action.requiredAccess}</span>
                                  {' · '}
                                  {action.action}
                                </p>
                            ))}
                          </div>
                        )}
                        <Link
                          to={`/admin/detroit-dynamo/modules/${item.slug}`}
                          className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
                        >
                          Open Module Plan
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </>
                    );
                  })()}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-oswald text-xl font-bold tracking-wide text-foreground">FIRST COLLECTIONS</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {collectionTargets.map((item) => (
                  <div key={item.collectionId} className="rounded-md border border-border bg-secondary p-3">
                    <p className="font-oswald text-sm font-bold tracking-wide text-foreground">{item.model}</p>
                    <code className="mt-1 block break-all text-xs text-accent">{item.collectionId}</code>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.accessPolicy}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.attributes.length} attributes, {item.indexes.length} indexes
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
