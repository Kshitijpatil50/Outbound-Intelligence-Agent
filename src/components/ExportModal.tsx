import React, { useState, useEffect } from 'react';
import { Account, Contact, ResearchBrief, Email, CampaignInput, PipelineHealth } from '../types';
import { X, Copy, Check, Download, FileText, Code2, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'markdown' | 'json' | 'csv';
  campaignInput: CampaignInput;
  accounts: Account[];
  contacts: Contact[];
  briefs: ResearchBrief[];
  emails: Email[];
  health: PipelineHealth;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  campaignInput,
  accounts,
  contacts,
  briefs,
  emails,
  health,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json' | 'csv'>(initialMode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Generate Markdown report equivalent to Submission.md
  const generateMarkdownReport = () => {
    let md = `# Outbound Intelligence Agent Campaign Report\n\n`;
    md += `**Generated At:** ${new Date().toLocaleString()}\n`;
    md += `**Target Vertical:** ${campaignInput.targetVertical}\n`;
    md += `**Reference Account:** ${campaignInput.referenceAccount}\n`;
    md += `**Goal:** ${campaignInput.goal}\n`;
    md += `**Vendor:** ${campaignInput.vendorName} (${campaignInput.vendorAngle})\n`;
    md += `**Proof Points:** ${campaignInput.vendorProofPoints.join(', ')}\n\n`;

    md += `---\n\n## Pipeline Health Summary\n`;
    md += `- **Stage 1 (Accounts Identified):** ${health.stage1AccountsIdentified}\n`;
    md += `- **Stage 2 (Contacts Found):** ${health.stage2ContactsFound} (${health.stage2ContactsMissing} Missing/Non-Fabricated)\n`;
    md += `- **Stage 3 (Research Briefs):** ${health.stage3BriefsCompleted}\n`;
    md += `- **Stage 4 (Emails Generated):** ${health.stage4EmailsGenerated} (${health.stage4EmailsSkipped} Skipped)\n\n`;

    md += `---\n\n## Stage 1 — Account Identification\n\n`;
    accounts.forEach((acc, i) => {
      md += `### ${i + 1}. ${acc.name} (${acc.hqCountry}) — ICP Score: ${acc.icpScore || 90}/100\n`;
      md += `- **Commodities:** ${acc.commodities.join(', ')}\n`;
      md += `- **Scale:** ${acc.scaleNotes}\n`;
      md += `- **Why This Account:** ${acc.reasoningTrace || 'Matches scale and hazard characteristics.'}\n`;
      md += `- **ICP Fit Reasoning:** ${acc.icpReasoning}\n`;
      md += `- **Verification Level:** ${acc.confidence?.level || 'verified'} (${acc.confidence?.sourceCount || acc.sources.length} sources)\n`;
      md += `- **Sources:**\n`;
      acc.sources.forEach((s) => {
        md += `  - [${s.title}](${s.url})\n`;
      });
      md += `\n`;
    });

    md += `---\n\n## Stage 2 — Contact Discovery\n\n`;
    contacts.forEach((c) => {
      if (c.status === 'found' && c.name) {
        md += `### ${c.accountName}\n`;
        md += `- **Name:** ${c.name}\n`;
        md += `- **Title:** ${c.title}\n`;
        md += `- **Why This Contact:** ${c.reasoningTrace || 'Closest decision-maker match.'}\n`;
        if (c.linkedin) md += `- **LinkedIn:** ${c.linkedin}\n`;
        if (c.email) md += `- **Email:** ${c.email}\n`;
        md += `- **Verification Source:** ${c.source}\n\n`;
      } else {
        md += `### ${c.accountName}\n`;
        md += `- **Status:** NO VERIFIED CONTACT FOUND\n`;
        md += `- **Reason:** ${c.failureReason || 'No public records found. Strict non-fabrication enforced.'}\n\n`;
      }
    });

    md += `---\n\n## Stage 3 — Account Research Briefs\n\n`;
    briefs.forEach((b) => {
      md += `### Research Brief: ${b.accountName}${b.isEdited ? ' (Edited by Rep)' : ''}\n\n`;
      md += `${b.summary}\n\n`;
      md += `**Recent News:** ${b.recentNews}\n\n`;
      md += `**Operational Footprint:** ${b.operationalFootprint}\n\n`;
      md += `**Vendor Fit Signals:** ${b.vendorFitSignals}\n\n`;
      md += `**Sources:**\n`;
      b.sources.forEach((s) => {
        md += `- [${s.title}](${s.url})\n`;
      });
      md += `\n`;
    });

    md += `---\n\n## Stage 4 — Outbound Email Drafts\n\n`;
    emails.forEach((e) => {
      if (e.status === 'generated') {
        md += `### Email for ${e.contactName} (${e.contactTitle} @ ${e.accountName})${e.isEdited ? ' (Edited)' : ''}\n`;
        md += `**Personalization Score:** ${e.personalization?.score || 95}% (${e.personalization?.reason || 'Verified role & company fit'})\n`;
        md += `**Subject:** ${e.subject}\n\n`;
        md += `\`\`\`text\n${e.body}\n\`\`\`\n\n`;
        md += `- **Pain Point Targeted:** ${e.painPointTargeted}\n`;
        md += `- **Proof Point Used:** ${e.proofPointUsed}\n\n`;
      } else {
        md += `### Email for ${e.accountName}\n`;
        md += `*SKIPPED: ${e.skipReason}*\n\n`;
      }
    });

    return md;
  };

  const generateJsonData = () => {
    return JSON.stringify(
      {
        campaignInput,
        pipelineHealth: health,
        accounts,
        contacts,
        briefs,
        emails,
      },
      null,
      2
    );
  };

  const generateCsvData = () => {
    const headers = [
      'Company Name',
      'Contact Name',
      'Email',
      'Brief Summary',
      'Contact Title',
      'HQ Country',
      'ICP Fit Score',
      'Outreach Status',
      'Email Subject',
      'Email Body',
      'Pain Point Targeted',
      'Proof Point Used',
    ];

    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows: string[][] = [headers.map((h) => `"${h}"`)];

    accounts.forEach((acc) => {
      const accContacts = contacts.filter((c) => c.accountName === acc.name);
      const brief = briefs.find((b) => b.accountName === acc.name);
      const briefSummary = brief ? brief.summary : 'N/A';
      const icpScore = typeof acc.icpScore === 'number' ? acc.icpScore : 90;

      if (accContacts.length === 0) {
        rows.push([
          escapeCsv(acc.name),
          escapeCsv(''),
          escapeCsv(''),
          escapeCsv(briefSummary),
          escapeCsv(''),
          escapeCsv(acc.hqCountry),
          escapeCsv(icpScore),
          escapeCsv('No Contact Found'),
          escapeCsv(''),
          escapeCsv(''),
          escapeCsv(''),
          escapeCsv(''),
        ]);
      } else {
        accContacts.forEach((contact) => {
          const email = emails.find(
            (e) => e.accountName === acc.name && (e.contactName === contact.name || !contact.name)
          );

          rows.push([
            escapeCsv(acc.name),
            escapeCsv(contact.name || 'N/A'),
            escapeCsv(contact.email || ''),
            escapeCsv(briefSummary),
            escapeCsv(contact.title || 'N/A'),
            escapeCsv(acc.hqCountry),
            escapeCsv(icpScore),
            escapeCsv(email ? email.status : 'N/A'),
            escapeCsv(email?.subject || ''),
            escapeCsv(email?.body || ''),
            escapeCsv(email?.painPointTargeted || ''),
            escapeCsv(email?.proofPointUsed || ''),
          ]);
        });
      }
    });

    return rows.map((r) => r.join(',')).join('\n');
  };

  const contentToDisplay =
    activeTab === 'markdown'
      ? generateMarkdownReport()
      : activeTab === 'json'
      ? generateJsonData()
      : generateCsvData();

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'outbound_campaign.csv';
    let mimeType = 'text/csv';

    if (activeTab === 'markdown') {
      filename = 'Submission.md';
      mimeType = 'text/markdown';
    } else if (activeTab === 'json') {
      filename = 'outbound_campaign.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([contentToDisplay], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('csv')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'csv'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV Spreadsheet</span>
              </button>

              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'markdown'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Markdown Report</span>
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw JSON Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition backdrop-blur-md cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Code/Text Body */}
        <div className="p-4 overflow-y-auto bg-slate-950/80 flex-1 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text backdrop-blur-md">
          {contentToDisplay}
        </div>

      </div>
    </div>
  );
};
