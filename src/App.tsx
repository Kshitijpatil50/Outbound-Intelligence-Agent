import React, { useState, useEffect } from 'react';
import { CampaignInput, CampaignState, Account, Contact, ResearchBrief, Email, PipelineLog, StageError, CampaignHistoryRecord, AppNotification } from './types';
import { DEFAULT_CAMPAIGN_INPUT } from './data/defaults';
import { Header } from './components/Header';
import { CampaignBriefPanel } from './components/CampaignBriefPanel';
import { PipelineHealthPanel } from './components/PipelineHealthPanel';
import { Stage1AccountsCard } from './components/Stage1AccountsCard';
import { Stage2ContactsCard } from './components/Stage2ContactsCard';
import { Stage3BriefsCard } from './components/Stage3BriefsCard';
import { Stage4EmailsCard } from './components/Stage4EmailsCard';
import { PipelineFlowVisualizer } from './components/PipelineFlowVisualizer';
import { CampaignStatBar } from './components/CampaignStatBar';
import { ExportModal } from './components/ExportModal';
import { CampaignHistoryModal } from './components/CampaignHistoryModal';
import { NotificationsModal } from './components/NotificationsModal';
import { motion } from 'motion/react';

export default function App() {
  const [inputs, setInputs] = useState<CampaignInput>(DEFAULT_CAMPAIGN_INPUT);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [stageProgressText, setStageProgressText] = useState<string>('');

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [briefs, setBriefs] = useState<ResearchBrief[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [logs, setLogs] = useState<PipelineLog[]>([]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('flytbase_app_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('flytbase_app_theme', theme);
    } catch (err) {
      console.error('Failed to save theme to localStorage', err);
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('flytbase_pipeline_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-notif-1',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        title: 'BDR Intelligence Pipeline Ready',
        message: 'FlytBase Outbound Agent loaded with Google Search Grounding & Gemini 2.5 Flash.',
        type: 'info',
        read: false,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('flytbase_pipeline_notifications', JSON.stringify(notifications));
    } catch (err) {
      console.error('Failed to save notifications to localStorage', err);
    }
  }, [notifications]);

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'info',
    stage?: number
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      type,
      read: false,
      stage,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyRecords, setHistoryRecords] = useState<CampaignHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('flytbase_campaign_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('flytbase_campaign_history', JSON.stringify(historyRecords));
    } catch (err) {
      console.error('Failed to save campaign history to localStorage', err);
    }
  }, [historyRecords]);

  const [health, setHealth] = useState({
    stage1AccountsIdentified: 0,
    stage2ContactsFound: 0,
    stage2ContactsMissing: 0,
    stage3BriefsCompleted: 0,
    stage4EmailsGenerated: 0,
    stage4EmailsSkipped: 0,
    stageErrors: [] as StageError[],
  });


  const [exportModal, setExportModal] = useState<{ isOpen: boolean; mode: 'markdown' | 'json' | 'csv' }>({
    isOpen: false,
    mode: 'markdown',
  });

  // Check API key health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.hasKey === 'boolean') {
          setHasApiKey(data.hasKey);
        }
      })
      .catch(() => setHasApiKey(false));
  }, []);

  const addLog = (stage: number, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newLog: PipelineLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      stage,
      message,
      type,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const addStageError = (stage: number, stageName: string, item: string, error: string) => {
    const newError: StageError = {
      stage,
      stageName,
      item,
      error,
      timestamp: new Date().toLocaleTimeString(),
    };
    setHealth((prev) => ({
      ...prev,
      stageErrors: [...prev.stageErrors, newError],
    }));
  };

  const runPipeline = async () => {
    setIsRunning(true);
    setCurrentStage(1);
    setAccounts([]);
    setContacts([]);
    setBriefs([]);
    setEmails([]);
    setLogs([]);
    setHealth({
      stage1AccountsIdentified: 0,
      stage2ContactsFound: 0,
      stage2ContactsMissing: 0,
      stage3BriefsCompleted: 0,
      stage4EmailsGenerated: 0,
      stage4EmailsSkipped: 0,
      stageErrors: [],
    });

    try {
      // -------------------------------------------------------------
      // STAGE 1: ACCOUNT IDENTIFICATION
      // -------------------------------------------------------------
      setStageProgressText(`Stage 1: Identification of target mining accounts...`);
      addLog(1, `Initiating Stage 1 — Scanning Google Search grounding for LatAm mining operators...`, 'info');
      addNotification('Pipeline Started', `Executing 4-stage BDR pipeline for ${inputs.targetVertical}`, 'info', 1);

      const stage1Res = await fetch('/api/pipeline/stage1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignInput: inputs }),
      });

      if (!stage1Res.ok) {
        const errData = await stage1Res.json();
        throw new Error(errData.error || 'Stage 1 request failed');
      }

      const stage1Data = await stage1Res.json();
      const identifiedAccounts: Account[] = stage1Data.accounts || [];

      if (identifiedAccounts.length === 0) {
        throw new Error('Stage 1 grounding returned zero accounts.');
      }

      setAccounts(identifiedAccounts);
      setHealth((prev) => ({ ...prev, stage1AccountsIdentified: identifiedAccounts.length }));
      addLog(1, `Stage 1 Complete: Found ${identifiedAccounts.length} real target accounts matching ICP profile.`, 'success');
      addNotification('Stage 1 Complete', `Identified ${identifiedAccounts.length} target accounts: ${identifiedAccounts.map(a => a.name).join(', ')}`, 'success', 1);

      // -------------------------------------------------------------
      // STAGE 2: CONTACT DISCOVERY
      // -------------------------------------------------------------
      setCurrentStage(2);
      addLog(2, `Initiating Stage 2 — Grounded contact discovery for ${identifiedAccounts.length} accounts...`, 'info');

      const discoveredContacts: Contact[] = [];
      let foundCount = 0;
      let missingCount = 0;

      for (let i = 0; i < identifiedAccounts.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 400));
        const acc = identifiedAccounts[i];
        setStageProgressText(`Stage 2: Discovering key contacts for ${acc.name} (${i + 1}/${identifiedAccounts.length})...`);

        try {
          const stage2Res = await fetch('/api/pipeline/stage2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: acc, campaignInput: inputs }),
          });

          if (!stage2Res.ok) {
            throw new Error(`Stage 2 call failed for ${acc.name}`);
          }

          const stage2Data = await stage2Res.json();
          const contact: Contact = stage2Data.contact;
          discoveredContacts.push(contact);
          setContacts([...discoveredContacts]);

          if (contact.status === 'found' && contact.name) {
            foundCount++;
            addLog(2, `${acc.name}: Verified contact found → ${contact.name} (${contact.title})`, 'success');
          } else {
            missingCount++;
            addLog(2, `${acc.name}: No verified named contact found in public search. Enforcing non-fabrication rule.`, 'warning');
            addStageError(2, 'Contact Discovery', acc.name, contact.failureReason || 'No verified named contact found in public records.');
          }
        } catch (err: any) {
          addLog(2, `${acc.name}: Contact discovery search error: ${err.message}`, 'error');
          addStageError(2, 'Contact Discovery', acc.name, err.message);
        }

        setHealth((prev) => ({
          ...prev,
          stage2ContactsFound: foundCount,
          stage2ContactsMissing: missingCount,
        }));
      }

      addLog(2, `Stage 2 Complete: ${foundCount} verified contacts found, ${missingCount} accounts missing contacts.`, 'success');
      addNotification(
        'Stage 2 Complete',
        `Discovered ${foundCount} verified contacts. ${missingCount > 0 ? `${missingCount} account(s) skipped (no public named contact found).` : ''}`,
        missingCount > 0 ? 'warning' : 'success',
        2
      );

      // -------------------------------------------------------------
      // STAGE 3: ACCOUNT RESEARCH BRIEF
      // -------------------------------------------------------------
      setCurrentStage(3);
      addLog(3, `Initiating Stage 3 — Grounded research brief synthesis for ${identifiedAccounts.length} accounts...`, 'info');

      const synthesizedBriefs: ResearchBrief[] = [];

      for (let i = 0; i < identifiedAccounts.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 400));
        const acc = identifiedAccounts[i];
        setStageProgressText(`Stage 3: Synthesizing grounded research brief for ${acc.name} (${i + 1}/${identifiedAccounts.length})...`);

        try {
          const stage3Res = await fetch('/api/pipeline/stage3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: acc, campaignInput: inputs }),
          });

          if (!stage3Res.ok) {
            throw new Error(`Stage 3 call failed for ${acc.name}`);
          }

          const stage3Data = await stage3Res.json();
          const brief: ResearchBrief = stage3Data.brief;
          synthesizedBriefs.push(brief);
          setBriefs([...synthesizedBriefs]);

          addLog(3, `${acc.name}: Brief synthesized with grounded news & site footprint details.`, 'success');
        } catch (err: any) {
          addLog(3, `${acc.name}: Brief synthesis error: ${err.message}`, 'error');
          addStageError(3, 'Research Brief', acc.name, err.message);
        }

        setHealth((prev) => ({
          ...prev,
          stage3BriefsCompleted: synthesizedBriefs.length,
        }));
      }

      addLog(3, `Stage 3 Complete: ${synthesizedBriefs.length} grounded research briefs created.`, 'success');
      addNotification('Stage 3 Complete', `Synthesized ${synthesizedBriefs.length} grounded account briefs with value propositions & proof points.`, 'success', 3);

      // -------------------------------------------------------------
      // STAGE 4: PERSONALIZED EMAIL GENERATION
      // -------------------------------------------------------------
      setCurrentStage(4);
      addLog(4, `Initiating Stage 4 — Drafting role-targeted personalized emails...`, 'info');

      const generatedEmails: Email[] = [];
      let emailGeneratedCount = 0;
      let emailSkippedCount = 0;

      for (let i = 0; i < discoveredContacts.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 300));
        const contact = discoveredContacts[i];
        const matchingBrief = synthesizedBriefs.find((b) => b.accountId === contact.accountId) || {
          id: 'brief-fallback',
          accountId: contact.accountId,
          accountName: contact.accountName,
          summary: 'Mining operations in LatAm.',
          recentNews: '',
          operationalFootprint: '',
          vendorFitSignals: '',
          sources: [],
          status: 'success' as const,
        };

        setStageProgressText(`Stage 4: Drafting email for ${contact.accountName} (${i + 1}/${discoveredContacts.length})...`);

        try {
          const stage4Res = await fetch('/api/pipeline/stage4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contact,
              brief: matchingBrief,
              campaignInput: inputs,
            }),
          });

          if (!stage4Res.ok) {
            throw new Error(`Stage 4 call failed for ${contact.accountName}`);
          }

          const stage4Data = await stage4Res.json();
          const email: Email = stage4Data.email;
          generatedEmails.push(email);
          setEmails([...generatedEmails]);

          if (email.status === 'generated') {
            emailGeneratedCount++;
            addLog(4, `${contact.accountName} (${contact.name}): Outbound email drafted addressing ${email.painPointTargeted}.`, 'success');
          } else {
            emailSkippedCount++;
            addLog(4, `${contact.accountName}: Email generation skipped (no verified contact from Stage 2).`, 'warning');
          }
        } catch (err: any) {
          addLog(4, `${contact.accountName}: Email generation error: ${err.message}`, 'error');
          addStageError(4, 'Email Generation', contact.accountName, err.message);
        }

        setHealth((prev) => ({
          ...prev,
          stage4EmailsGenerated: emailGeneratedCount,
          stage4EmailsSkipped: emailSkippedCount,
        }));
      }

      addLog(4, `Stage 4 Complete: ${emailGeneratedCount} outbound emails drafted, ${emailSkippedCount} skipped due to Stage 2 contact bounds.`, 'success');
      addNotification('Stage 4 Complete', `Drafted ${emailGeneratedCount} personalized cold outreach emails (${emailSkippedCount} skipped).`, 'success', 4);

      setCurrentStage(5);
      setStageProgressText('Pipeline completed successfully!');
      addLog(5, 'Full 4-Stage Outbound BDR Pipeline completed successfully!', 'success');
      addNotification('Campaign Ready', 'Full 4-Stage BDR pipeline execution completed. All outputs ready for review & export!', 'success', 5);


      // Save to campaign history
      const newRecord: CampaignHistoryRecord = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        inputs: { ...inputs },
        accounts: [...identifiedAccounts],
        contacts: [...discoveredContacts],
        briefs: [...synthesizedBriefs],
        emails: [...generatedEmails],
        logs: [
          {
            id: `log-complete-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            stage: 5,
            message: 'Pipeline run archived to campaign history log.',
            type: 'success',
          },
          ...logs,
        ],
        health: {
          stage1AccountsIdentified: identifiedAccounts.length,
          stage2ContactsFound: discoveredContacts.filter((c) => c.status === 'found').length,
          stage2ContactsMissing: discoveredContacts.filter((c) => c.status !== 'found').length,
          stage3BriefsCompleted: synthesizedBriefs.length,
          stage4EmailsGenerated: emailGeneratedCount,
          stage4EmailsSkipped: emailSkippedCount,
          stageErrors: health.stageErrors,
        },
      };

      setHistoryRecords((prev) => [newRecord, ...prev]);


    } catch (err: any) {
      console.error('Pipeline error:', err);
      addLog(currentStage || 1, `Pipeline interrupted: ${err.message}`, 'error');
      addNotification('Pipeline Error', `Pipeline interrupted: ${err.message}`, 'error', currentStage || 1);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetDefaults = () => {
    setInputs(DEFAULT_CAMPAIGN_INPUT);
    setAccounts([]);
    setContacts([]);
    setBriefs([]);
    setEmails([]);
    setLogs([]);
    setCurrentStage(0);
    setHealth({
      stage1AccountsIdentified: 0,
      stage2ContactsFound: 0,
      stage2ContactsMissing: 0,
      stage3BriefsCompleted: 0,
      stage4EmailsGenerated: 0,
      stage4EmailsSkipped: 0,
      stageErrors: [],
    });
  };

  const handleUpdateEmail = (id: string, updatedFields: Partial<Email>) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );
  };

  const handleUpdateBrief = (briefId: string, newSummary: string) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, summary: newSummary, isEdited: true } : b))
    );
  };

  const handleRegenerateEmail = async (email: Email, toneTweak: string) => {
    const matchingContact = contacts.find((c) => c.id === email.contactId) || {
      id: email.contactId,
      accountId: email.accountId,
      accountName: email.accountName,
      name: email.contactName,
      title: email.contactTitle,
      linkedin: null,
      email: null,
      source: null,
      sources: [],
      status: 'found' as const,
    };
    const matchingBrief = briefs.find((b) => b.accountId === email.accountId) || {
      id: 'brief-fallback',
      accountId: email.accountId,
      accountName: email.accountName,
      summary: 'Mining operations in LatAm.',
      recentNews: '',
      operationalFootprint: '',
      vendorFitSignals: '',
      sources: [],
      status: 'success' as const,
    };

    try {
      const res = await fetch('/api/pipeline/stage4-regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId: email.id,
          currentSubject: email.subject,
          currentBody: email.body,
          contact: matchingContact,
          brief: matchingBrief,
          campaignInput: inputs,
          toneTweak,
        }),
      });

      if (!res.ok) throw new Error('Regeneration request failed');
      const data = await res.json();
      if (data.email) {
        setEmails((prev) => prev.map((e) => (e.id === email.id ? data.email : e)));
        addLog(4, `Regenerated email for ${email.contactName} (${email.accountName}) with tone: "${toneTweak}"`, 'success');
        addNotification('Email Regenerated', `Updated email for ${email.contactName} with requested tone adjustment.`, 'success', 4);
      }
    } catch (err: any) {
      console.error('Failed to regenerate email:', err);
      addLog(4, `Failed to regenerate email: ${err.message}`, 'error');
    }
  };

  const handleLoadHistoryRecord = (record: CampaignHistoryRecord) => {
    setInputs(record.inputs);
    setAccounts(record.accounts);
    setContacts(record.contacts);
    setBriefs(record.briefs);
    setEmails(record.emails);
    setLogs(record.logs);
    setHealth(record.health);
    setCurrentStage(5);
    setStageProgressText(`Restored campaign run from history (${record.timestamp})`);
  };

  const handleApplyHistoryConfig = (record: CampaignHistoryRecord) => {
    setInputs(record.inputs);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistoryRecords([]);
  };

  const hasData = accounts.length > 0;

  return (
    <div id="app-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden">
      
      {/* Ambient Radial Glass Glow Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/25 blur-[120px] rounded-full"></div>
        <div className="absolute top-[35%] right-[15%] w-[35%] h-[35%] bg-purple-900/20 blur-[140px] rounded-full"></div>
      </div>

      {/* Top Header */}
      <Header
        isRunning={isRunning}
        hasApiKey={hasApiKey}
        onRunCampaign={runPipeline}
        onExportCsv={() => setExportModal({ isOpen: true, mode: 'csv' })}
        onExportMarkdown={() => setExportModal({ isOpen: true, mode: 'markdown' })}
        onExportJson={() => setExportModal({ isOpen: true, mode: 'json' })}
        onResetDefaults={handleResetDefaults}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyRecords.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationCount={notifications.filter((n) => !n.read).length}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasData={hasData}
      />


      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-full relative z-10">
        
        {/* Left Sidebar: Configurator */}
        <CampaignBriefPanel
          input={inputs}
          onChange={setInputs}
          isRunning={isRunning}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />


        {/* Right Content Area */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* Requirement 9: Campaign Summary Metrics Bar */}
          <CampaignStatBar
            state={{
              inputs,
              accounts,
              contacts,
              briefs,
              emails,
              isRunning,
              currentStage,
              stageProgressText,
              logs,
              health,
            }}
          />

          {/* Health & Progress Telemetry */}
          <PipelineHealthPanel
            health={health}
            logs={logs}
            isRunning={isRunning}
            currentStage={currentStage}
            stageProgressText={stageProgressText}
          />

          {/* 4 Stage Sections with Animated Stage Transitions */}
          <div className="space-y-6">
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Stage1AccountsCard accounts={accounts} isRunning={isRunning} referenceAccount={inputs.referenceAccount} />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
              <Stage2ContactsCard contacts={contacts} isRunning={isRunning} />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            >
              <Stage3BriefsCard briefs={briefs} isRunning={isRunning} onUpdateBrief={handleUpdateBrief} />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            >
              <Stage4EmailsCard
                emails={emails}
                briefs={briefs}
                campaignInput={inputs}
                isRunning={isRunning}
                onUpdateEmail={handleUpdateEmail}
                onRegenerateEmail={handleRegenerateEmail}
              />
            </motion.div>
          </div>

        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModal.isOpen}
        onClose={() => setExportModal({ ...exportModal, isOpen: false })}
        mode={exportModal.mode}
        campaignInput={inputs}
        accounts={accounts}
        contacts={contacts}
        briefs={briefs}
        emails={emails}
        health={health}
      />

      {/* Campaign History Modal */}
      <CampaignHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyRecords={historyRecords}
        onLoadRecord={handleLoadHistoryRecord}
        onApplyConfig={handleApplyHistoryConfig}
        onDeleteRecord={handleDeleteHistoryRecord}
        onClearAll={handleClearAllHistory}
      />

      {/* Pipeline Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Glassmorphic Footer Status Bar */}
      <footer className="border-t border-white/10 bg-slate-900/60 backdrop-blur-md px-6 py-2.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Outbound Intelligence Agent</span>
          <span className="text-slate-600">|</span>
          <span>Google Search Grounding Engine Active</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-300 font-mono">Gemini 2.5 Flash</span>
          <span>•</span>
          <span>Zero-Hallucination Contact Bounds</span>
        </div>
      </footer>

    </div>
  );
}
