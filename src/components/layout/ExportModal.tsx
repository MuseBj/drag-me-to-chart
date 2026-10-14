import { useState } from 'react';
import type { ColorTheme, DashboardLayout } from '../../types/dashboard';
import {
  generateLlmPrompt,
  generateReactCodeScaffold,
} from '../../utils/llmPromptGenerator';
import {
  copyDashboardImageToClipboard,
  downloadDashboardImage,
  downloadJsonFile,
  copyTextToClipboard,
} from '../../utils/exportHelpers';
import {
  X,
  Camera,
  Download,
  Copy,
  Check,
  Code2,
  FileJson,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ExportModalProps {
  layout: DashboardLayout;
  theme: ColorTheme;
  isOpen: boolean;
  onClose: () => void;
  canvasElementId: string;
}

export const ExportModal = ({
  layout,
  theme,
  isOpen,
  onClose,
  canvasElementId,
}: ExportModalProps) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'json' | 'react'>('prompt');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  if (!isOpen) return null;

  const promptText = generateLlmPrompt(layout, theme);
  const jsonText = JSON.stringify(
    {
      layout,
      theme: {
        name: theme.name,
        category: theme.category,
        colors: theme.colors,
        canvasBg: theme.canvasBg,
        cardBg: theme.cardBg,
      },
    },
    null,
    2
  );
  const reactCode = generateReactCodeScaffold(layout, theme);

  const showToast = (msg: string) => {
    setCopiedStatus(msg);
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleCopyImage = async () => {
    setIsCapturing(true);
    const result = await copyDashboardImageToClipboard(canvasElementId);
    setIsCapturing(false);
    showToast(result.message);
  };

  const handleDownloadImage = async () => {
    setIsCapturing(true);
    const success = await downloadDashboardImage(
      canvasElementId,
      `${layout.title.toLowerCase().replace(/\s+/g, '-')}-layout.png`
    );
    setIsCapturing(false);
    if (success) {
      showToast('Dashboard PNG screenshot downloaded!');
    } else {
      showToast('Failed to download image.');
    }
  };

  const handleCopyCurrentText = async () => {
    let text = promptText;
    if (activeTab === 'json') text = jsonText;
    if (activeTab === 'react') text = reactCode;

    const success = await copyTextToClipboard(text);
    if (success) {
      showToast(
        activeTab === 'prompt'
          ? 'LLM Prompt copied to clipboard!'
          : activeTab === 'json'
          ? 'JSON layout schema copied!'
          : 'React starter code copied!'
      );
    }
  };

  const handleDownloadFile = () => {
    if (activeTab === 'json') {
      downloadJsonFile(
        { layout, theme },
        `${layout.title.toLowerCase().replace(/\s+/g, '-')}.json`
      );
      showToast('JSON spec downloaded!');
    } else if (activeTab === 'prompt') {
      const blob = new Blob([promptText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${layout.title.toLowerCase().replace(/\s+/g, '-')}-prompt.md`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('LLM Prompt markdown downloaded!');
    } else {
      const blob = new Blob([reactCode], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${layout.title.toLowerCase().replace(/\s+/g, '-')}.tsx`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('React component code downloaded!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                Export Dashboard & LLM Blueprint
              </h2>
              <p className="text-xs opacity-75" style={{ color: theme.textSecondary }}>
                Copy image snapshots, prompt your coding LLMs, or download code scaffolds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Snapshot Action Bar */}
        <div
          className="p-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: `${theme.accent}0a`,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ color: theme.textPrimary }}>
              Visual Snapshot:
            </span>
            <span className="opacity-75" style={{ color: theme.textSecondary }}>
              Generate pixel-perfect image of your current layout
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyImage}
              disabled={isCapturing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
              style={{
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            >
              <Camera size={14} style={{ color: theme.accent }} />
              <span>{isCapturing ? 'Capturing...' : 'Copy Image to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isCapturing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
              style={{
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            >
              <Download size={14} />
              <span>Download PNG</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center border-b px-6 pt-3 gap-3 select-none text-xs"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'prompt' ? '' : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeTab === 'prompt' ? theme.accent : 'transparent',
              color: activeTab === 'prompt' ? theme.accent : theme.textSecondary,
            }}
          >
            <Sparkles size={14} />
            <span>Coding LLM Prompt (Markdown)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'json' ? '' : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeTab === 'json' ? theme.accent : 'transparent',
              color: activeTab === 'json' ? theme.accent : theme.textSecondary,
            }}
          >
            <FileJson size={14} />
            <span>JSON Layout Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('react')}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'react' ? '' : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={{
              borderColor: activeTab === 'react' ? theme.accent : 'transparent',
              color: activeTab === 'react' ? theme.accent : theme.textSecondary,
            }}
          >
            <Code2 size={14} />
            <span>React + ECharts Scaffold</span>
          </button>
        </div>

        {/* Toast feedback */}
        {copiedStatus && (
          <div
            className="mx-6 mt-3 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fadeIn"
            style={{
              backgroundColor: `${theme.accent}20`,
              color: theme.accent,
              borderColor: `${theme.accent}40`,
              borderWidth: 1,
            }}
          >
            <Check size={14} />
            <span>{copiedStatus}</span>
          </div>
        )}

        {/* Content Preview Body */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div
            className="flex-1 rounded-xl p-4 overflow-auto border font-mono text-[11px] leading-relaxed relative"
            style={{
              backgroundColor: theme.canvasBg,
              borderColor: theme.cardBorder,
              color: theme.textPrimary,
            }}
          >
            <pre className="whitespace-pre-wrap font-mono">
              {activeTab === 'prompt'
                ? promptText
                : activeTab === 'json'
                ? jsonText
                : reactCode}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between text-xs"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-2 opacity-75" style={{ color: theme.textSecondary }}>
            <FileText size={14} />
            <span>
              {activeTab === 'prompt'
                ? 'Ready to paste into Claude, ChatGPT, or Gemini'
                : activeTab === 'json'
                ? 'Full coordinate & component data schema'
                : 'Scaffolded starter React component'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium hover:bg-white/10 transition-colors"
              style={{
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            >
              <Download size={14} />
              <span>Download File</span>
            </button>

            <button
              onClick={handleCopyCurrentText}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
              style={{
                backgroundColor: theme.accent,
                color: '#ffffff',
              }}
            >
              <Copy size={14} />
              <span>Copy to Clipboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
