// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Database,
  Download,
  ExternalLink,
  Eye,
  Inbox,
  LockKeyhole,
  Search,
  RefreshCcw,
  Send,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import {
  detroitDynamoAdminModuleRegistry,
  detroitDynamoLeadRouting,
  detroitDynamoRolePermissionMatrix,
} from '@/lib/detroitDynamoDataModel';
import { detroitDynamoModuleActionGuards } from '@/lib/detroitDynamoAdminAccess';
import { getDetroitDynamoModuleDraftsForLeads } from '@/lib/detroitDynamoAdminDrafts';
import { buildDetroitDynamoExternalGateContractReport } from '@/lib/detroitDynamoExternalGateContracts';
import { buildDetroitDynamoClaimSafetyContractReport } from '@/lib/detroitDynamoClaimSafetyContract';
import { buildDetroitDynamoSafeguardingReport } from '@/lib/detroitDynamoSafeguardingContract';
import { getDetroitDynamoModulePipelineCards } from '@/lib/detroitDynamoLeadPipeline';
import { detroitDynamoAppwriteCollections } from '@/lib/detroitDynamoAppwriteSchema';
import {
  getDetroitDynamoPreviewAuditEvents,
  getDetroitDynamoPreviewLeads,
  updateDetroitDynamoPreviewLeadPipelineStatus,
} from '@/lib/detroitDynamoLeads';
import {
  getDetroitDynamoModuleWriteBackendMode,
  getDetroitDynamoPreviewModuleWriteActions,
  setDetroitDynamoModuleWriteBackendMode,
  submitDetroitDynamoAdminModuleWriteAction,
} from '@/lib/detroitDynamoAdminModuleWrites';
import {
  getDetroitDynamoModuleReadBackendMode,
  getDetroitDynamoPreviewModuleReadActions,
  setDetroitDynamoModuleReadBackendMode,
  submitDetroitDynamoAdminModuleReadAction,
} from '@/lib/detroitDynamoAdminModuleReads';
import {
  buildDetroitDynamoCollectionDisplayProfile as buildCollectionDisplayProfile,
  buildDetroitDynamoModuleRecordCsv as buildModuleRecordCsv,
  buildDetroitDynamoPreparedRecordPayload as buildPreparedRecordPayload,
  buildDetroitDynamoRecordFieldRows as buildRecordFieldRows,
  flattenDetroitDynamoModuleRecordCollections as flattenModuleRecordCollections,
  labelDetroitDynamoRecordField as labelForField,
  stringifyDetroitDynamoRecordValue as stringifyRecordValue,
} from '@/lib/detroitDynamoAdminRecordWorkspace';

function sourceRoutePath(value) {
  return String(value || '').split('#')[0];
}

function leadMatchesModule(lead, modulePlan) {
  const routing = detroitDynamoLeadRouting[lead.lead_type] || detroitDynamoLeadRouting.contact;
  const routePath = sourceRoutePath(lead.source_route);
  const routeMatch = modulePlan.sourceRoutes.some((route) => routePath === route || routePath.startsWith(`${route}/`));
  const collectionMatch = (routing.collectionIds || []).some((collectionId) => modulePlan.collectionIds.includes(collectionId));
  const modelMatch = (routing.destinationModels || []).some((model) => modulePlan.primaryModels.includes(model));
  return routeMatch || collectionMatch || modelMatch;
}

function urgencyBadgeClass(urgency) {
  if (urgency === 'overdue') return 'border-red-300/35 bg-red-500/10 text-red-100';
  if (urgency === 'due_soon') return 'border-yellow-300/35 bg-yellow-500/10 text-yellow-100';
  if (urgency === 'closed') return 'border-border bg-background text-muted-foreground';
  return 'border-accent/35 bg-accent/10 text-accent';
}

function buildDefaultModuleWriteForm(modulePlan) {
  return {
    module_slug: modulePlan?.slug || '',
    collection_id: modulePlan?.collectionIds?.[0] || '',
    mutation: 'create_record',
    module_action: modulePlan?.enabledActions?.[0] || '',
    actor_role: modulePlan?.ownerRoles?.[0] || 'Master Admin',
    record_id: '',
    external_gate_confirmed: false,
    payload: JSON.stringify({
      status: 'preview',
      source: 'protected-module-write-console',
    }, null, 2),
  };
}

function buildDefaultModuleReadForm(modulePlan) {
  return {
    module_slug: modulePlan?.slug || '',
    collection_id: modulePlan?.collectionIds?.[0] || '',
    actor_role: modulePlan?.ownerRoles?.[0] || 'Master Admin',
    limit: 25,
    cursor: '',
  };
}

export default function AdminDetroitDynamoModule() {
  const { moduleSlug } = useParams();
  const [previewLeads, setPreviewLeads] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [moduleWriteMode, setModuleWriteMode] = useState('local');
  const [moduleWriteActions, setModuleWriteActions] = useState([]);
  const [moduleWriteForm, setModuleWriteForm] = useState(() => buildDefaultModuleWriteForm(null));
  const [moduleWriteSubmitting, setModuleWriteSubmitting] = useState(false);
  const [moduleWriteMessage, setModuleWriteMessage] = useState('');
  const [moduleWriteError, setModuleWriteError] = useState('');
  const [moduleReadMode, setModuleReadMode] = useState('local');
  const [moduleReadActions, setModuleReadActions] = useState([]);
  const [moduleReadForm, setModuleReadForm] = useState(() => buildDefaultModuleReadForm(null));
  const [moduleReadResult, setModuleReadResult] = useState(null);
  const [moduleReadSubmitting, setModuleReadSubmitting] = useState(false);
  const [moduleReadMessage, setModuleReadMessage] = useState('');
  const [moduleReadError, setModuleReadError] = useState('');
  const [moduleRecordQuery, setModuleRecordQuery] = useState('');
  const [moduleRecordCollectionFilter, setModuleRecordCollectionFilter] = useState('');
  const [moduleRecordPage, setModuleRecordPage] = useState(1);
  const [moduleRecordPageSize, setModuleRecordPageSize] = useState(10);
  const [selectedModuleRecordKey, setSelectedModuleRecordKey] = useState('');
  const [moduleRecordExportMessage, setModuleRecordExportMessage] = useState('');
  const modulePlan = detroitDynamoAdminModuleRegistry.find((item) => item.slug === moduleSlug);

  const refreshPreviewData = () => {
    setPreviewLeads(getDetroitDynamoPreviewLeads());
    setAuditEvents(getDetroitDynamoPreviewAuditEvents());
    setModuleWriteActions(getDetroitDynamoPreviewModuleWriteActions());
    setModuleReadActions(getDetroitDynamoPreviewModuleReadActions());
  };

  const transitionLead = (leadId, nextStatus, ownerRole) => {
    try {
      const updated = updateDetroitDynamoPreviewLeadPipelineStatus(leadId, nextStatus, {
        actorRole: ownerRole || 'Preview Module Admin',
        note: `Local module preview moved to ${nextStatus}.`,
      });
      refreshPreviewData();
      setTransitionMessage(`${updated.player_name || updated.contact_name || updated.organization || 'Lead'} moved to ${nextStatus}.`);
    } catch (error) {
      setTransitionMessage(error?.message || 'Could not update the local preview lead.');
    }
  };

  useEffect(() => {
    refreshPreviewData();
    setModuleWriteMode(getDetroitDynamoModuleWriteBackendMode());
    setModuleReadMode(getDetroitDynamoModuleReadBackendMode());
    setModuleWriteForm(buildDefaultModuleWriteForm(modulePlan));
    setModuleReadForm(buildDefaultModuleReadForm(modulePlan));
    setModuleReadResult(null);
    setModuleRecordQuery('');
    setModuleRecordCollectionFilter('');
    setModuleRecordPage(1);
    setModuleRecordPageSize(10);
    setSelectedModuleRecordKey('');
    setModuleRecordExportMessage('');
    setModuleWriteMessage('');
    setModuleWriteError('');
    setModuleReadMessage('');
    setModuleReadError('');
  }, [modulePlan]);

  const setModuleReadBackendMode = (mode) => {
    setDetroitDynamoModuleReadBackendMode(mode);
    setModuleReadMode(mode);
  };

  const setModuleWriteBackendMode = (mode) => {
    setDetroitDynamoModuleWriteBackendMode(mode);
    setModuleWriteMode(mode);
  };

  const updateModuleReadForm = (field, value) => {
    setModuleReadForm((current) => ({
      ...current,
      [field]: value,
    }));
    setModuleReadMessage('');
    setModuleReadError('');
  };

  const updateModuleWriteForm = (field, value) => {
    setModuleWriteForm((current) => ({
      ...current,
      [field]: value,
    }));
    setModuleWriteMessage('');
    setModuleWriteError('');
  };

  const updateModuleRecordQuery = (value) => {
    setModuleRecordQuery(value);
    setModuleRecordPage(1);
    setSelectedModuleRecordKey('');
    setModuleRecordExportMessage('');
  };

  const updateModuleRecordCollectionFilter = (value) => {
    setModuleRecordCollectionFilter(value);
    setModuleRecordPage(1);
    setSelectedModuleRecordKey('');
    setModuleRecordExportMessage('');
  };

  const updateModuleRecordPageSize = (value) => {
    setModuleRecordPageSize(Number.parseInt(value, 10) || 10);
    setModuleRecordPage(1);
    setSelectedModuleRecordKey('');
    setModuleRecordExportMessage('');
  };

  const submitModuleWrite = async (event) => {
    event.preventDefault();
    setModuleWriteSubmitting(true);
    setModuleWriteMessage('');
    setModuleWriteError('');

    try {
      const result = await submitDetroitDynamoAdminModuleWriteAction({
        ...moduleWriteForm,
        module_slug: modulePlan.slug,
      });
      refreshPreviewData();
      const stored = getDetroitDynamoPreviewModuleWriteActions();
      setModuleWriteActions(stored.some((item) => item.id === result.id) ? stored : [result, ...stored].slice(0, 100));
      setModuleWriteMessage(`${result.mutation.replaceAll('_', ' ')} captured for ${result.module || modulePlan.module}.`);
      if (moduleWriteForm.mutation === 'create_record') {
        setModuleWriteForm((current) => ({
          ...current,
          record_id: result.record_id || '',
        }));
      }
    } catch (error) {
      setModuleWriteError(error?.message || 'Could not submit the Detroit Dynamo module write action.');
    } finally {
      setModuleWriteSubmitting(false);
    }
  };

  const submitModuleRead = async (event) => {
    event.preventDefault();
    setModuleReadSubmitting(true);
    setModuleReadMessage('');
    setModuleReadError('');

    try {
      const result = await submitDetroitDynamoAdminModuleReadAction({
        ...moduleReadForm,
        module_slug: modulePlan.slug,
      }, {
        localDocuments: moduleReadLocalDocuments,
      });
      refreshPreviewData();
      const stored = getDetroitDynamoPreviewModuleReadActions();
      setModuleReadActions(stored.some((item) => item.id === result.id) ? stored : [result, ...stored].slice(0, 100));
      setModuleReadResult(result);
      setModuleReadMessage(`${result.document_count || 0} preview records returned for ${result.module || modulePlan.module}.`);
    } catch (error) {
      setModuleReadError(error?.message || 'Could not submit the Detroit Dynamo module read action.');
    } finally {
      setModuleReadSubmitting(false);
    }
  };

  const moduleDrafts = useMemo(() => (
    getDetroitDynamoModuleDraftsForLeads(modulePlan, previewLeads)
  ), [modulePlan, previewLeads]);

  const modulePipelineCards = useMemo(() => (
    getDetroitDynamoModulePipelineCards(modulePlan, previewLeads)
  ), [modulePlan, previewLeads]);

  const moduleDraftLeadIds = useMemo(() => (
    new Set(moduleDrafts.map((draft) => draft.sourceLeadId))
  ), [moduleDrafts]);

  const moduleLeads = useMemo(() => (
    modulePlan
      ? previewLeads.filter((lead) => leadMatchesModule(lead, modulePlan) || moduleDraftLeadIds.has(lead.id))
      : []
  ), [moduleDraftLeadIds, modulePlan, previewLeads]);

  const moduleLeadIds = useMemo(() => (
    new Set(moduleLeads.map((lead) => lead.id))
  ), [moduleLeads]);

  const moduleAuditEvents = useMemo(() => {
    if (!modulePlan) return [];
    return auditEvents.filter((event) => (
      modulePlan.collectionIds.includes(event.target_collection_id)
      || modulePlan.primaryModels.includes(event.target_model)
      || moduleLeadIds.has(event.target_record_id)
    ));
  }, [auditEvents, moduleLeadIds, modulePlan]);

  const moduleWriteActionsForModule = useMemo(() => {
    if (!modulePlan) return [];
    return moduleWriteActions.filter((action) => (
      action.module_slug === modulePlan.slug
      || modulePlan.collectionIds.includes(action.collection_id)
      || modulePlan.primaryModels.includes(action.model)
    ));
  }, [modulePlan, moduleWriteActions]);

  const moduleReadLocalDocuments = useMemo(() => {
    const draftDocuments = moduleDrafts.map((draft) => ({
      collection_id: draft.collectionId,
      model: draft.model,
      document: {
        id: draft.id,
        source: 'local_record_draft',
        title: draft.title,
        status: draft.status,
        lead_type: draft.leadType,
        source_lead_id: draft.sourceLeadId,
        source_route: draft.sourceRoute,
        ...draft.document,
      },
    }));
    const writeDocuments = moduleWriteActionsForModule.map((action) => ({
      collection_id: action.collection_id,
      model: action.model,
      document: {
        id: action.record_id || action.id,
        source: 'preview_module_write',
        status: action.status,
        module_action: action.module_action,
        mutation: action.mutation,
        actor_role: action.actor_role,
        audit_event_id: action.audit_event_id,
        created_at: action.created_at,
        updated_at: action.updated_at,
        ...(action.payload || {}),
      },
    }));

    return [...writeDocuments, ...draftDocuments];
  }, [moduleDrafts, moduleWriteActionsForModule]);

  const moduleReadActionsForModule = useMemo(() => {
    if (!modulePlan) return [];
    return moduleReadActions.filter((action) => (
      action.module_slug === modulePlan.slug
      || modulePlan.collectionIds.includes(action.collection_id)
      || (action.collections || []).some((collection) => modulePlan.collectionIds.includes(collection.collection_id))
    ));
  }, [modulePlan, moduleReadActions]);

  const moduleRecordCollections = useMemo(() => {
    if (!modulePlan) return [];
    if (Array.isArray(moduleReadResult?.collections) && moduleReadResult.collections.length > 0) {
      return moduleReadResult.collections;
    }

    const groupedCollections = new Map();
    for (const collectionId of modulePlan.collectionIds) {
      const collectionPlan = detroitDynamoAppwriteCollections.find((item) => item.collectionId === collectionId);
      groupedCollections.set(collectionId, {
        collection_id: collectionId,
        model: collectionPlan?.model || collectionId,
        total: 0,
        documents: [],
      });
    }

    for (const item of moduleReadLocalDocuments) {
      if (!modulePlan.collectionIds.includes(item.collection_id)) continue;
      const current = groupedCollections.get(item.collection_id) || {
        collection_id: item.collection_id,
        model: item.model || item.collection_id,
        total: 0,
        documents: [],
      };
      current.documents.push(item.document || {});
      current.total = current.documents.length;
      groupedCollections.set(item.collection_id, current);
    }

    return Array.from(groupedCollections.values());
  }, [modulePlan, moduleReadLocalDocuments, moduleReadResult]);

  const moduleRecords = useMemo(() => (
    flattenModuleRecordCollections(moduleRecordCollections)
  ), [moduleRecordCollections]);

  const moduleFilteredRecords = useMemo(() => {
    const query = moduleRecordQuery.trim().toLowerCase();
    return moduleRecords.filter((record) => {
      const collectionMatch = !moduleRecordCollectionFilter || record.collectionId === moduleRecordCollectionFilter;
      const queryMatch = !query || record.searchText.includes(query);
      return collectionMatch && queryMatch;
    });
  }, [moduleRecordCollectionFilter, moduleRecordQuery, moduleRecords]);

  const moduleRecordPageCount = useMemo(() => (
    Math.max(1, Math.ceil(moduleFilteredRecords.length / moduleRecordPageSize))
  ), [moduleFilteredRecords.length, moduleRecordPageSize]);

  useEffect(() => {
    setModuleRecordPage((currentPage) => Math.min(Math.max(1, currentPage), moduleRecordPageCount));
  }, [moduleRecordPageCount]);

  const moduleRecordRangeStart = moduleFilteredRecords.length === 0
    ? 0
    : ((moduleRecordPage - 1) * moduleRecordPageSize) + 1;
  const moduleRecordRangeEnd = Math.min(moduleFilteredRecords.length, moduleRecordPage * moduleRecordPageSize);

  const modulePaginatedRecords = useMemo(() => (
    moduleFilteredRecords.slice(moduleRecordRangeStart > 0 ? moduleRecordRangeStart - 1 : 0, moduleRecordRangeEnd)
  ), [moduleFilteredRecords, moduleRecordRangeEnd, moduleRecordRangeStart]);

  const selectedModuleRecord = useMemo(() => (
    modulePaginatedRecords.find((record) => record.key === selectedModuleRecordKey)
    || modulePaginatedRecords[0]
    || null
  ), [modulePaginatedRecords, selectedModuleRecordKey]);

  const selectedModuleCollectionPlan = useMemo(() => (
    selectedModuleRecord
      ? detroitDynamoAppwriteCollections.find((collection) => collection.collectionId === selectedModuleRecord.collectionId)
      : null
  ), [selectedModuleRecord]);

  const selectedModuleFieldRows = useMemo(() => (
    buildRecordFieldRows(selectedModuleRecord, selectedModuleCollectionPlan)
  ), [selectedModuleCollectionPlan, selectedModuleRecord]);

  const selectedModuleDisplayProfile = useMemo(() => (
    buildCollectionDisplayProfile(selectedModuleRecord, selectedModuleCollectionPlan)
  ), [selectedModuleCollectionPlan, selectedModuleRecord]);

  const prepareModuleRecordWriteAction = (mutation) => {
    if (!modulePlan || !selectedModuleRecord) return;
    const preparedPayload = buildPreparedRecordPayload(selectedModuleRecord, mutation);
    setModuleWriteForm((current) => ({
      ...current,
      mutation,
      collection_id: selectedModuleRecord.collectionId,
      record_id: selectedModuleRecord.id,
      module_action: current.module_action || modulePlan.enabledActions?.[0] || '',
      actor_role: current.actor_role || modulePlan.ownerRoles?.[0] || 'Master Admin',
      payload: JSON.stringify(preparedPayload, null, 2),
    }));
    setModuleWriteError('');
    setModuleWriteMessage(`${mutation.replaceAll('_', ' ')} prepared for ${selectedModuleRecord.title}. Review the write console before submitting.`);
  };

  const downloadModuleRecordsCsv = () => {
    if (moduleFilteredRecords.length === 0) {
      setModuleRecordExportMessage('No module records match the current workspace filters.');
      return;
    }

    const csv = buildModuleRecordCsv(moduleFilteredRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `detroit-dynamo-${modulePlan.slug}-module-records.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setModuleRecordExportMessage(`${moduleFilteredRecords.length} module records exported from the current workspace view.`);
  };

  const externalGateContract = useMemo(() => buildDetroitDynamoExternalGateContractReport(), []);
  const claimSafetyContract = useMemo(() => buildDetroitDynamoClaimSafetyContractReport(), []);
  const safeguardingContract = useMemo(() => buildDetroitDynamoSafeguardingReport(), []);
  const moduleGateTracks = useMemo(() => {
    if (modulePlan?.module === 'Payments/packages') return externalGateContract.paymentPackageTracks;
    if (modulePlan?.module === 'Waivers/forms') return externalGateContract.waiverTracks;
    return [];
  }, [externalGateContract, modulePlan?.module]);
  const moduleGateMode = modulePlan?.module === 'Payments/packages' ? 'payment' : modulePlan?.module === 'Waivers/forms' ? 'waiver' : '';
  const moduleClaimSafetyTracks = useMemo(() => {
    if (!modulePlan) return [];
    return claimSafetyContract.claimSafetyTracks.filter((track) => (
      track.adminModules.includes(modulePlan.module)
      || track.relatedModels.some((model) => modulePlan.primaryModels.includes(model))
      || track.collectionIds.some((collectionId) => modulePlan.collectionIds.includes(collectionId))
    ));
  }, [claimSafetyContract, modulePlan]);
  const moduleSafeguardingTracks = useMemo(() => {
    if (!modulePlan) return [];
    return safeguardingContract.safeguardingTracks.filter((track) => (
      track.adminModules.includes(modulePlan.module)
      || track.relatedModels.some((model) => modulePlan.primaryModels.includes(model))
      || track.collectionIds.some((collectionId) => modulePlan.collectionIds.includes(collectionId))
    ));
  }, [modulePlan, safeguardingContract]);

  if (!modulePlan) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            to="/admin/detroit-dynamo"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dynamo Admin
          </Link>
          <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
            <h1 className="font-oswald text-3xl font-bold tracking-wide text-foreground">MODULE NOT FOUND</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              This Detroit Dynamo admin module is not in the current registry. Use the foundation dashboard to choose
              a planned module.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const actionGuard = detroitDynamoModuleActionGuards.find((guard) => guard.module === modulePlan.module);
  const collections = detroitDynamoAppwriteCollections.filter((collection) => (
    modulePlan.collectionIds.includes(collection.collectionId)
  ));
  const roleRows = detroitDynamoRolePermissionMatrix.map((role) => ({
    role: role.role,
    permission: role.permissions.find((permission) => permission.module === modulePlan.module),
  })).filter((item) => item.permission);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to="/admin/detroit-dynamo"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Dynamo Admin
            </Link>
            <p className="mt-6 font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Detroit Dynamo Module
            </p>
            <h1 className="mt-3 font-oswald text-4xl font-bold tracking-tight text-foreground">{modulePlan.module}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{modulePlan.purpose}</p>
          </div>
          <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
            {modulePlan.status.replaceAll('_', ' ')}
          </span>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-border bg-card p-5">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
            <p className="mt-4 font-oswald text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Owner Roles</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{modulePlan.ownerRoles.join(', ')}</p>
          </article>
          <article className="rounded-lg border border-border bg-card p-5">
            <Database className="h-5 w-5 text-accent" aria-hidden="true" />
            <p className="mt-4 font-oswald text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Collections</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{modulePlan.collectionIds.length} planned collections</p>
          </article>
          <article className="rounded-lg border border-border bg-card p-5">
            <ExternalLink className="h-5 w-5 text-accent" aria-hidden="true" />
            <p className="mt-4 font-oswald text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Source Routes</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{modulePlan.sourceRoutes.length || 'Internal'} route signals</p>
          </article>
          <article className="rounded-lg border border-border bg-card p-5">
            <LockKeyhole className="h-5 w-5 text-accent" aria-hidden="true" />
            <p className="mt-4 font-oswald text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Launch Phase</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{modulePlan.launchPhase}</p>
          </article>
        </section>

        {moduleGateTracks.length > 0 && (
          <section className="mt-8 rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">External Gates</p>
                <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">EXTERNAL READINESS GATES</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Module-specific launch blockers for {modulePlan.module}. These records are planning contracts only;
                  checkout, provider products, and signature collection stay disabled until the owner, payment, and legal
                  approvals are complete.
                </p>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {moduleGateTracks.length} {moduleGateMode} gates
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {moduleGateTracks.map((track) => {
                const status = moduleGateMode === 'payment' ? track.providerStatus : track.signatureMode;
                const mode = moduleGateMode === 'payment' ? track.publishMode : track.approvalStatus;
                const approvals = moduleGateMode === 'payment' ? track.approvalRequired : track.requiredApprovals;
                const Icon = moduleGateMode === 'payment' ? CircleDollarSign : ShieldCheck;

                return (
                  <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                        <h3 className="mt-3 font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
                      </div>
                      <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                        {status}
                      </code>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.blockedAction}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Mode</p>
                        <p className="mt-1 font-mono text-xs text-accent">{mode}</p>
                      </div>
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Routes</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{track.publicRoutes.join(', ')}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-md border border-border bg-background p-3">
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Approval Required
                      </p>
                      <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
                        {approvals.slice(0, 4).map((approval) => (
                          <li key={approval}>{approval}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {moduleClaimSafetyTracks.length > 0 && (
          <section className="mt-8 rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Claim Safety</p>
                <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">CLAIM SAFETY GUARDS</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Module-specific public-claim guardrails for {modulePlan.module}. These keep external facts, proof,
                  rosters, facilities, fixtures, sponsors, and launch claims approval-gated while the preview remains isolated.
                </p>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {moduleClaimSafetyTracks.length} guards
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {moduleClaimSafetyTracks.map((track) => (
                <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <LockKeyhole className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h3 className="mt-3 font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
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
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Routes</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{track.publicRoutes.join(', ')}</p>
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
        )}

        {moduleSafeguardingTracks.length > 0 && (
          <section className="mt-8 rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Safeguarding</p>
                <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">SAFEGUARDING PRIVACY GUARDS</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Module-specific youth safety, guardian consent, data privacy, staff verification, release, retention,
                  and audit controls for {modulePlan.module}. These stay policy, legal, or backend gated until the live
                  dashboard enforces them.
                </p>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {moduleSafeguardingTracks.length} safeguards
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {moduleSafeguardingTracks.map((track) => (
                <article key={track.id} className="rounded-md border border-border bg-secondary/45 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                      <h3 className="mt-3 font-oswald text-xl font-bold tracking-wide text-foreground">{track.label}</h3>
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
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Routes</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{track.publicRoutes.join(', ')}</p>
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
        )}

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div>
            <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Action Guards</p>
            <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">FIRST ADMIN ACTION CONTRACT</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              These are not live database mutations yet. They define the role access each future Appwrite-backed action
              must enforce before the module becomes operational.
            </p>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-border bg-secondary/45">
            <div className="grid gap-3 border-b border-border bg-secondary px-4 py-3 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground md:grid-cols-[1fr_0.45fr_1fr_1fr]">
              <span>Action</span>
              <span>Access</span>
              <span>Owner Roles Allowed</span>
              <span>All Roles Allowed</span>
            </div>
            <div className="divide-y divide-border">
              {(actionGuard?.actions || []).map((action) => (
                <article key={action.action} className="grid gap-3 px-4 py-4 text-sm text-muted-foreground md:grid-cols-[1fr_0.45fr_1fr_1fr]">
                  <p className="font-semibold text-foreground">{action.action}</p>
                  <p className="font-mono text-xs text-accent">{action.requiredAccess}</p>
                  <p>{action.permittedOwnerRoles.join(', ') || 'None'}</p>
                  <p>{action.permittedRoles.join(', ') || 'None'}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Record Workspace</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">MODULE RECORD WORKSPACE</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Search, inspect, and export the same module records returned by the read console. Before live Appwrite
                reads are connected, this workspace uses local record drafts and preview-write records for operator review.
              </p>
            </div>
            <span className="w-fit rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              {moduleReadResult ? moduleReadResult.status.replaceAll('_', ' ') : 'local preview baseline'}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="rounded-md border border-border bg-secondary/45 p-4">
              <Table2 className="h-5 w-5 text-accent" aria-hidden="true" />
              <p className="mt-3 font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workspace Records</p>
              <p className="mt-1 font-oswald text-2xl font-bold text-foreground">{moduleRecords.length}</p>
            </article>
            <article className="rounded-md border border-border bg-secondary/45 p-4">
              <Search className="h-5 w-5 text-accent" aria-hidden="true" />
              <p className="mt-3 font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Current View</p>
              <p className="mt-1 font-oswald text-2xl font-bold text-foreground">{moduleFilteredRecords.length}</p>
            </article>
            <article className="rounded-md border border-border bg-secondary/45 p-4">
              <Database className="h-5 w-5 text-accent" aria-hidden="true" />
              <p className="mt-3 font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Collections With Records</p>
              <p className="mt-1 font-oswald text-2xl font-bold text-foreground">
                {moduleRecordCollections.filter((collection) => (collection.documents || []).length > 0).length}
              </p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.7fr_0.45fr_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Search records
              <input
                type="search"
                value={moduleRecordQuery}
                onChange={(event) => updateModuleRecordQuery(event.target.value)}
                placeholder="Search player, parent, sponsor, status, id, or payload"
                className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Collection filter
              <select
                value={moduleRecordCollectionFilter}
                onChange={(event) => updateModuleRecordCollectionFilter(event.target.value)}
                className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
              >
                <option value="">All workspace collections</option>
                {modulePlan.collectionIds.map((collectionId) => (
                  <option key={collectionId} value={collectionId}>{collectionId}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Page size
              <select
                value={moduleRecordPageSize}
                onChange={(event) => updateModuleRecordPageSize(event.target.value)}
                className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>{size} rows</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={downloadModuleRecordsCsv}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
          </div>

          {moduleRecordExportMessage && (
            <div className="mt-4 rounded-md border border-border bg-secondary/65 px-4 py-3 text-sm leading-6 text-muted-foreground">
              {moduleRecordExportMessage}
            </div>
          )}

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-secondary/45">
              <div className="hidden border-b border-border bg-secondary px-4 py-3 font-oswald text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground md:grid md:grid-cols-[0.85fr_0.65fr_0.45fr_0.45fr_0.25fr]">
                <span>Record</span>
                <span>Collection</span>
                <span>Status</span>
                <span>Updated</span>
                <span>Open</span>
              </div>

              {moduleFilteredRecords.length === 0 ? (
                <div className="p-6 text-sm leading-6 text-muted-foreground">
                  No module records match the current workspace filters. Run a preview read, submit a related Detroit
                  Dynamo form, or capture a preview write to populate this module.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {modulePaginatedRecords.map((record) => (
                    <button
                      key={record.key}
                      type="button"
                      onClick={() => setSelectedModuleRecordKey(record.key)}
                      className={`grid w-full gap-3 px-4 py-4 text-left text-sm transition hover:bg-background/65 md:grid-cols-[0.85fr_0.65fr_0.45fr_0.45fr_0.25fr] ${
                        selectedModuleRecord?.key === record.key ? 'bg-background/70' : 'bg-transparent'
                      }`}
                      aria-label={`Inspect ${record.title}`}
                    >
                      <span>
                        <span className="block font-semibold text-foreground">{record.title}</span>
                        <span className="mt-1 block break-all font-mono text-[10px] text-accent">{record.id}</span>
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-foreground">{record.model}</span>
                        <span className="mt-1 block break-all font-mono text-[10px] text-muted-foreground">{record.collectionId}</span>
                      </span>
                      <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                        {record.status}
                      </span>
                      <span className="text-xs leading-5 text-muted-foreground">{record.updatedAt || 'No timestamp'}</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-accent">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {moduleFilteredRecords.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-border bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-muted-foreground">
                    Showing {moduleRecordRangeStart}-{moduleRecordRangeEnd} of {moduleFilteredRecords.length} matching records.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModuleRecordPage((page) => Math.max(1, page - 1))}
                      disabled={moduleRecordPage <= 1}
                      className="inline-flex min-h-9 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Previous module record page"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Prev
                    </button>
                    <span className="rounded-md border border-border bg-background px-3 py-2 font-mono text-[10px] text-accent">
                      {moduleRecordPage} / {moduleRecordPageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModuleRecordPage((page) => Math.min(moduleRecordPageCount, page + 1))}
                      disabled={moduleRecordPage >= moduleRecordPageCount}
                      className="inline-flex min-h-9 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Next module record page"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-border bg-secondary/45 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Selected Record</p>
                  <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">RECORD DETAIL PREVIEW</h3>
                </div>
                <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                  {selectedModuleRecord?.model || 'No record'}
                </code>
              </div>

              {!selectedModuleRecord ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Select a workspace record to inspect the future admin payload.
                </p>
              ) : (
                <div className="mt-4 grid gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedModuleRecord.title}</h4>
                    <p className="mt-1 break-all font-mono text-[10px] text-accent">{selectedModuleRecord.collectionId}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => prepareModuleRecordWriteAction('update_record')}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Prepare Update
                    </button>
                    <button
                      type="button"
                      onClick={() => prepareModuleRecordWriteAction('archive_record')}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
                    >
                      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                      Prepare Archive
                    </button>
                  </div>
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Field Display Profile
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        ['Schema fields', selectedModuleDisplayProfile.schemaFieldCount],
                        ['Required', selectedModuleDisplayProfile.requiredFieldCount],
                        ['Missing required', selectedModuleDisplayProfile.missingRequiredFieldCount],
                        ['Indexed', selectedModuleDisplayProfile.indexedFieldCount],
                        ['Payload-only', selectedModuleDisplayProfile.unknownFieldCount],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-md border border-border bg-secondary/60 p-2">
                          <p className="font-mono text-[10px] text-accent">{value}</p>
                          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-3 rounded-md border px-3 py-2 text-xs leading-5 ${
                      selectedModuleDisplayProfile.missingRequiredFieldCount > 0
                        ? 'border-yellow-300/30 bg-yellow-500/10 text-yellow-100'
                        : 'border-accent/35 bg-accent/10 text-accent'
                    }`}
                    >
                      {selectedModuleDisplayProfile.missingRequiredFieldCount > 0
                        ? `Missing required fields: ${selectedModuleDisplayProfile.missingRequiredFields.map(labelForField).join(', ')}`
                        : 'Required field readiness is satisfied for the selected record payload.'}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {selectedModuleFieldRows.slice(0, 14).map((field) => (
                      <div key={field.key} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.4fr_1fr]">
                        <div>
                          <p className="break-all font-mono text-accent">{field.key}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                              {field.group}
                            </span>
                            <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                              {field.type}{field.array ? '[]' : ''}
                            </span>
                            {field.required && (
                              <span className="rounded border border-accent/35 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] text-accent">
                                required
                              </span>
                            )}
                            {field.indexed && (
                              <span className="rounded border border-accent/35 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] text-accent">
                                indexed
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{field.label}</p>
                          <p className="mt-1 break-words text-muted-foreground">{stringifyRecordValue(field.value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-md border border-border bg-background p-3 text-[10px] leading-5 text-muted-foreground">
                    {JSON.stringify(selectedModuleRecord.document, null, 2)}
                  </pre>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Protected Read Test</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">MODULE READ ACTION CONSOLE</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Preview mode reads from local draft and preview-write records. Appwrite mode calls
                `detroitDynamoAdminModuleRead` as the signed-in dashboard user after role grants and collections are live.
              </p>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
              {['local', 'appwrite'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModuleReadBackendMode(mode)}
                  className={`min-h-10 rounded-md border px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                    moduleReadMode === mode
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {mode === 'local' ? 'Preview' : 'Appwrite'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submitModuleRead} className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.65fr_0.8fr]">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Collection
                <select
                  value={moduleReadForm.collection_id}
                  onChange={(event) => updateModuleReadForm('collection_id', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  <option value="">All module collections</option>
                  {modulePlan.collectionIds.map((collectionId) => (
                    <option key={collectionId} value={collectionId}>{collectionId}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Actor role
                <select
                  value={moduleReadForm.actor_role}
                  onChange={(event) => updateModuleReadForm('actor_role', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {roleRows.map(({ role }) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Limit
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={moduleReadForm.limit}
                  onChange={(event) => updateModuleReadForm('limit', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Cursor
                <input
                  type="text"
                  value={moduleReadForm.cursor}
                  onChange={(event) => updateModuleReadForm('cursor', event.target.value)}
                  placeholder="Optional Appwrite cursor"
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
            </div>

            {moduleReadError && (
              <div className="mt-4 rounded-md border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
                {moduleReadError}
              </div>
            )}
            {moduleReadMessage && (
              <div className="mt-4 rounded-md border border-accent/35 bg-accent/10 px-4 py-3 text-sm leading-6 text-accent">
                {moduleReadMessage}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Local reads combine generated record drafts and any preview module writes in this browser. Live reads
                stay capped at 25 records by the Appwrite function contract.
              </p>
              <button
                type="submit"
                disabled={moduleReadSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                {moduleReadSubmitting ? 'Reading' : 'Read Module Records'}
              </button>
            </div>
          </form>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Current Read Result
                  </p>
                  <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">READ RESULT PREVIEW</h3>
                </div>
                <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                  {moduleReadResult?.document_count || 0} records
                </code>
              </div>

              {!moduleReadResult ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Run a preview read to inspect the module dataset that future Appwrite reads should return.
                </p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {(moduleReadResult.collections || []).map((collection) => (
                    <article key={collection.collection_id} className="rounded-md border border-border bg-background p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{collection.model || 'Module record'}</p>
                          <code className="mt-1 block break-all text-[10px] text-accent">{collection.collection_id}</code>
                        </div>
                        <span className="w-fit rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-accent">
                          {collection.total || 0}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {(collection.documents || []).slice(0, 3).map((document, index) => (
                          <div key={`${collection.collection_id}:${document.id || index}`} className="rounded-md border border-border bg-secondary/55 p-3">
                            <p className="break-all font-mono text-[10px] text-accent">{document.id || `record-${index + 1}`}</p>
                            <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-5 text-muted-foreground">
                              {JSON.stringify(document, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-md border border-border bg-secondary/45 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Recent Preview Reads
                  </p>
                  <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">MODULE READ LEDGER</h3>
                </div>
                <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                  {moduleReadActionsForModule.length} actions
                </span>
              </div>

              {moduleReadActionsForModule.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  No module read actions have been captured for {modulePlan.module} in this browser.
                </p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {moduleReadActionsForModule.slice(0, 6).map((action) => (
                    <article key={action.id} className="rounded-md border border-border bg-background p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{action.actor_role}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{action.created_at}</p>
                        </div>
                        <code className="w-fit rounded-md border border-border bg-secondary px-2 py-1 text-[10px] text-accent">
                          {action.status}
                        </code>
                      </div>
                      <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">
                        {action.collection_id || 'all module collections'} / {action.document_count || 0} records
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Protected Write Test</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">MODULE WRITE ACTION CONSOLE</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Preview mode stores a local module-write action and audit event without touching Appwrite. Appwrite mode
                calls `detroitDynamoAdminModuleWriteAction` as the signed-in dashboard user after collections, role grants,
                and external gates are ready.
              </p>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
              {['local', 'appwrite'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModuleWriteBackendMode(mode)}
                  className={`min-h-10 rounded-md border px-3 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                    moduleWriteMode === mode
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {mode === 'local' ? 'Preview' : 'Appwrite'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submitModuleWrite} className="mt-5 rounded-md border border-border bg-secondary/45 p-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Mutation
                <select
                  value={moduleWriteForm.mutation}
                  onChange={(event) => updateModuleWriteForm('mutation', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {['create_record', 'update_record', 'archive_record'].map((mutation) => (
                    <option key={mutation} value={mutation}>{mutation.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Module action
                <select
                  value={moduleWriteForm.module_action}
                  onChange={(event) => updateModuleWriteForm('module_action', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {modulePlan.enabledActions.map((action) => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Actor role
                <select
                  value={moduleWriteForm.actor_role}
                  onChange={(event) => updateModuleWriteForm('actor_role', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {roleRows.map(({ role }) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_0.75fr]">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Collection
                <select
                  value={moduleWriteForm.collection_id}
                  onChange={(event) => updateModuleWriteForm('collection_id', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
                >
                  {modulePlan.collectionIds.map((collectionId) => (
                    <option key={collectionId} value={collectionId}>{collectionId}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Record id
                <input
                  type="text"
                  value={moduleWriteForm.record_id}
                  onChange={(event) => updateModuleWriteForm('record_id', event.target.value)}
                  placeholder="Required for update/archive"
                  className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
                />
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={moduleWriteForm.external_gate_confirmed}
                  onChange={(event) => updateModuleWriteForm('external_gate_confirmed', event.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--accent))]"
                />
                External gate confirmed
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
              Payload JSON
              <textarea
                value={moduleWriteForm.payload}
                onChange={(event) => updateModuleWriteForm('payload', event.target.value)}
                rows={7}
                className="min-h-40 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
            </label>

            {modulePlan.status === 'external_gate' && (
              <div className="mt-4 rounded-md border border-yellow-300/30 bg-yellow-500/10 px-4 py-3 text-sm leading-6 text-yellow-100">
                This module is external-gated. Preview and live writes must explicitly confirm the gate after proof,
                approvals, and owner sign-off are complete.
              </div>
            )}

            {moduleWriteError && (
              <div className="mt-4 rounded-md border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
                {moduleWriteError}
              </div>
            )}
            {moduleWriteMessage && (
              <div className="mt-4 rounded-md border border-accent/35 bg-accent/10 px-4 py-3 text-sm leading-6 text-accent">
                {moduleWriteMessage}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Local preview actions are capped at 100 records and append a matching local `admin_module_write_action`
                audit event for this module ledger.
              </p>
              <button
                type="submit"
                disabled={moduleWriteSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {moduleWriteSubmitting ? 'Submitting' : 'Submit Write Action'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Recent Preview Writes</p>
                <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">MODULE WRITE LEDGER</h3>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-accent">
                {moduleWriteActionsForModule.length} actions
              </span>
            </div>

            {moduleWriteActionsForModule.length === 0 ? (
              <div className="mt-5 rounded-md border border-border bg-secondary/45 p-5 text-sm leading-6 text-muted-foreground">
                No preview module write actions have been captured for {modulePlan.module} in this browser.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {moduleWriteActionsForModule.slice(0, 8).map((action) => (
                  <article key={action.id} className="rounded-lg border border-border bg-secondary/45 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                          {action.mutation}
                        </p>
                        <h4 className="mt-1 font-semibold text-foreground">{action.module_action}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{action.actor_role}</p>
                      </div>
                      <code className="w-fit rounded-md border border-border bg-background px-2 py-1 text-[10px] text-accent">
                        {action.status}
                      </code>
                    </div>
                    <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                      <p className="break-all text-muted-foreground">{action.collection_id}</p>
                      <p className="break-all text-muted-foreground">{action.record_id}</p>
                    </div>
                    <p className="mt-3 break-all font-mono text-[10px] text-muted-foreground">
                      Audit event: {action.audit_event_id || 'pending Appwrite response'}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Collections</p>
            <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">DATA TARGETS</h2>
            <div className="mt-5 grid gap-3">
              {collections.map((collection) => (
                <article key={collection.collectionId} className="rounded-md border border-border bg-secondary p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-oswald text-lg font-bold tracking-wide text-foreground">{collection.model}</p>
                      <code className="mt-1 block break-all text-xs text-accent">{collection.collectionId}</code>
                    </div>
                    <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                      {collection.attributes.length} fields
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{collection.accessPolicy}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{collection.writePath}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Role Scope</p>
            <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">MODULE PERMISSIONS</h2>
            <div className="mt-5 grid gap-3">
              {roleRows.map(({ role, permission }) => (
                <article key={role} className="rounded-md border border-border bg-secondary p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="font-semibold text-foreground">{role}</p>
                    <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                      {permission.access}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{permission.scope}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Preview Intake</p>
              <h2 className="mt-2 font-oswald text-2xl font-bold tracking-wide text-foreground">MODULE QUEUE SIGNALS</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Local preview submissions that would route into this module once Appwrite intake and dashboard records are live.
                This uses the same browser-only queue as the protected foundation page.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshPreviewData}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-accent/40"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>

          {moduleLeads.length === 0 ? (
            <div className="mt-5 rounded-md border border-border bg-secondary/45 p-6 text-center">
              <Inbox className="mx-auto h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-oswald text-xl font-bold tracking-wide text-foreground">NO LOCAL SIGNALS FOR THIS MODULE</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Submit a related Detroit Dynamo preview form in this browser, then refresh this module plan.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/45">
              {moduleLeads.slice(0, 12).map((lead) => {
                const routing = detroitDynamoLeadRouting[lead.lead_type] || detroitDynamoLeadRouting.contact;
                const title = lead.player_name || lead.contact_name || lead.organization || 'Unnamed lead';
                return (
                  <article key={lead.id} className="grid gap-3 px-4 py-4 text-sm text-muted-foreground lg:grid-cols-[0.8fr_0.9fr_1fr]">
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                        {lead.lead_type || 'lead'}
                      </p>
                      <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
                      <p className="mt-1 text-xs">{lead.created_at || 'No timestamp'}</p>
                    </div>
                    <div className="leading-6">
                      <p className="text-foreground">{lead.email || 'No email'}</p>
                      <p>{lead.phone || 'No phone'}</p>
                      <p>{lead.team_interest || lead.program_interest || lead.package_interest || 'General inquiry'}</p>
                    </div>
                    <div className="rounded-md border border-border bg-background p-3">
                      <p className="font-semibold text-foreground">{routing.destinationModel}</p>
                      <p className="mt-1 text-xs leading-5">{routing.nextAction}</p>
                      <p className="mt-2 break-all font-mono text-[10px] text-accent">{lead.source_route || 'No source route'}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Module Follow-Up Queue</p>
                <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">OWNER WORK PREVIEW</h3>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-accent">
                {modulePipelineCards.length} tasks
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Matching local leads are translated into the future follow-up workflow for this module, including owner
              action, due window, and allowed next statuses.
            </p>

            {transitionMessage && (
              <div className="mt-5 rounded-md border border-border bg-secondary/65 px-4 py-3 text-sm leading-6 text-muted-foreground">
                {transitionMessage}
              </div>
            )}

            {modulePipelineCards.length === 0 ? (
              <div className="mt-5 rounded-md border border-border bg-secondary/45 p-5 text-sm leading-6 text-muted-foreground">
                No local follow-up tasks currently route to {modulePlan.module}.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {modulePipelineCards.slice(0, 8).map((card) => (
                  <article key={`${card.id}:${card.status}`} className="rounded-lg border border-border bg-secondary/45 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                          {card.leadType} / {card.ownerRole}
                        </p>
                        <h4 className="mt-1 font-semibold text-foreground">{card.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{card.interest}</p>
                      </div>
                      <span className={`w-fit rounded-md border px-2 py-1 font-mono text-[10px] ${urgencyBadgeClass(card.urgency)}`}>
                        {card.urgency.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{card.ownerAction}</p>
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
                        Last moved by {card.lastTransitionBy || 'Preview Module Admin'} at {card.lastTransitionAt || 'unknown time'}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Module Audit Trail</p>
                <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">MODULE AUDIT EVENT LEDGER</h3>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-accent">
                {moduleAuditEvents.length} events
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Local transition audit events that map to {modulePlan.module} by target collection, target model, or source lead id.
              The future dashboard should replace this with live `dd_admin_audit_events` reads.
            </p>

            {moduleAuditEvents.length === 0 ? (
              <div className="mt-5 rounded-md border border-border bg-secondary/45 p-5 text-sm leading-6 text-muted-foreground">
                No local audit events currently map to {modulePlan.module}. Move a matching local lead through the module
                follow-up queue to create one.
              </div>
            ) : (
              <div className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/45">
                {moduleAuditEvents.slice(0, 8).map((event) => (
                  <article key={event.id} className="grid gap-3 px-4 py-4 text-sm text-muted-foreground lg:grid-cols-[0.75fr_0.75fr_1fr]">
                    <div>
                      <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                        {event.action}
                      </p>
                      <h4 className="mt-1 font-semibold text-foreground">{event.actor_role}</h4>
                      <p className="mt-1 text-xs">{event.created_at}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-accent">
                        {event.previous_status || event.action} to {event.next_status || event.action}
                      </p>
                      <p className="mt-2 break-all text-xs">{event.target_model} / {event.target_record_id}</p>
                    </div>
                    <div className="rounded-md border border-border bg-background p-3">
                      <p className="text-xs leading-5">{event.event_summary}</p>
                      <code className="mt-2 block break-all text-[10px] text-accent">{event.id}</code>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Local Record Drafts</p>
                <h3 className="mt-2 font-oswald text-xl font-bold tracking-wide text-foreground">MODEL WRITE PREVIEW</h3>
              </div>
              <span className="w-fit rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-accent">
                {moduleDrafts.length} drafts
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              These drafts show the future Appwrite records that would be created from the same local queue. They are
              read-only planning objects; no database write happens on this protected page.
            </p>

            {moduleDrafts.length === 0 ? (
              <div className="mt-5 rounded-md border border-border bg-secondary/45 p-5 text-sm leading-6 text-muted-foreground">
                No local submissions currently produce {modulePlan.module} records. Submit a related form or use another
                module to inspect its draft records.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {moduleDrafts.slice(0, 10).map((draft) => (
                  <article key={draft.id} className="rounded-lg border border-border bg-secondary/45 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-oswald text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                          {draft.model}
                        </p>
                        <h4 className="mt-1 font-semibold text-foreground">{draft.title}</h4>
                        <code className="mt-1 block break-all text-[10px] text-muted-foreground">{draft.collectionId}</code>
                      </div>
                      <span className="w-fit rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-accent">
                        {draft.leadType}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {draft.fields.slice(0, 7).map((field) => (
                        <div key={`${draft.id}:${field.key}`} className="grid gap-2 rounded-md border border-border bg-background p-3 text-xs sm:grid-cols-[0.45fr_1fr]">
                          <p className="font-mono text-accent">{field.key}</p>
                          <p className="break-words text-muted-foreground">{field.value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 break-all font-mono text-[10px] text-muted-foreground">
                      Source lead: {draft.sourceLeadId}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <p className="font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent">Blocked Until</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{modulePlan.blockedUntil}</p>
          {modulePlan.sourceRoutes.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {modulePlan.sourceRoutes.map((route) => (
                <Link
                  key={route}
                  to={route}
                  className="rounded-md border border-border bg-secondary px-3 py-2 font-mono text-xs text-accent transition hover:border-accent/40"
                >
                  {route}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
