import { useState } from 'react';
import { ALGO_SNIPPETS, type SupportedLanguage } from '../../data/codeSnippets';

interface CodeEditorPanelProps {
  algoId: string;
  defaultPseudocode: string[];
  activeLine: number;
  accentColor?: string;
}

export default function CodeEditorPanel({
  algoId,
  defaultPseudocode,
  activeLine,
  accentColor = '#4fd1a5',
}: CodeEditorPanelProps) {
  const [lang, setLang] = useState<SupportedLanguage>('pseudocode');
  const [copied, setCopied] = useState(false);

  const snippetMap = ALGO_SNIPPETS[algoId];
  
  const currentCodeLines = lang === 'pseudocode' 
    ? defaultPseudocode 
    : (snippetMap?.[lang] || defaultPseudocode);

  const handleCopy = () => {
    const textToCopy = currentCodeLines.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'pseudocode', label: 'Pseudocode' },
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'javascript', label: 'JS' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        minWidth: 0,
      }}
    >
      {/* Editor Header Bar */}
      <div
        style={{
          padding: '0.5rem 0.75rem',
          background: '#0f111a',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Language Tabs (Swipeable touch scroll) */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            flex: 1,
            minWidth: 0,
            paddingBottom: 2,
          }}
        >
          {languages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLang(item.id)}
              style={{
                background: lang === item.id ? `${accentColor}25` : 'transparent',
                border: `1px solid ${lang === item.id ? accentColor : 'transparent'}`,
                borderRadius: '0.4rem',
                color: lang === item.id ? '#fff' : '#64748b',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          title="Copy Code to Clipboard"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.4rem',
            color: copied ? '#4fd1a5' : '#94a3b8',
            padding: '0.25rem 0.55rem',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>

      {/* Code Area */}
      <div
        style={{
          padding: '0.75rem 0',
          background: '#13151f',
          maxHeight: '480px',
          overflowY: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.65,
        }}
      >
        {currentCodeLines.map((line, i) => {
          const isHighlighted = lang === 'pseudocode' && i === activeLine;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '0 0.75rem',
                background: isHighlighted ? `linear-gradient(90deg, ${accentColor}26, transparent)` : 'transparent',
                borderLeft: `3px solid ${isHighlighted ? accentColor : 'transparent'}`,
                color: isHighlighted ? '#fff' : '#94a3b8',
                transition: 'all 0.2s',
                minWidth: 'max-content',
              }}
            >
              <div
                style={{
                  width: '1.75rem',
                  textAlign: 'right',
                  marginRight: '1rem',
                  color: isHighlighted ? accentColor : '#475569',
                  userSelect: 'none',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                }}
              >
                {i + 1}
              </div>
              <div style={{ whiteSpace: 'pre', textShadow: isHighlighted ? `0 0 10px ${accentColor}66` : 'none' }}>
                {line || ' '}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
