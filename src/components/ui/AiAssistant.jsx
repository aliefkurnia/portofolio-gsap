import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PixelIcon from './PixelIcon';
import './AiAssistant.css';

// Turn a reply into typed tokens so the dock renders the bits of Markdown the
// model tends to emit — [label](url) links, **bold**, and `code` — instead of
// showing the raw asterisks and brackets.
const TOKEN_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
const parseContent = (text) => {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN_RE)) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ type: 'link', label: m[1], href: m[2] });
    else if (m[3] !== undefined) out.push({ type: 'bold', value: m[3] });
    else if (m[4] !== undefined) out.push({ type: 'code', value: m[4] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
};
const isInternal = (href) =>
  href.startsWith('?') || (href.startsWith('/') && !href.startsWith('//'));

/**
 * Floating AI assistant — a launcher pinned bottom-right that opens a chat
 * dock. The browser never holds an API key: it only calls the `chat` Edge
 * Function, which grounds a Groq model on the live portfolio data. If the
 * function is offline, the dock degrades to a clear message instead of
 * breaking.
 */

const GREETING =
  "Hi! I'm Alief's portfolio assistant. Ask me about his experience, stack, or projects.";

// A varied pool; a fresh few are shown after each turn (skipping ones already
// asked) so there's always something to click and it keeps changing.
const SUGGESTION_POOL = [
  'What is Alief good at?',
  'Tell me about the Realta project',
  'Does he know Kubernetes?',
  'Is he open to remote work?',
  'What .NET experience does he have?',
  'How does he handle testing?',
  'What databases has he worked with?',
  'Tell me about his cloud & DevOps skills',
  'Can I download his CV?',
  'How does he use AI in his workflow?',
  'Where has he worked before?',
  'How can I get in touch with him?',
];
const SHOW_N = 3;

const pickSuggestions = (asked = []) => {
  const fresh = SUGGESTION_POOL.filter((q) => !asked.includes(q));
  const src = fresh.length >= SHOW_N ? fresh : SUGGESTION_POOL;
  return [...src].sort(() => Math.random() - 0.5).slice(0, SHOW_N);
};

const AiAssistant = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [suggestions, setSuggestions] = useState(() => pickSuggestions());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    // Rotate the chips to a fresh set, skipping everything asked so far.
    setSuggestions(
      pickSuggestions(next.filter((m) => m.role === 'user').map((m) => m.content))
    );

    try {
      const payload = next.filter((m, i) => !(i === 0 && m.content === GREETING));
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: payload },
      });
      if (error || !data?.reply) throw new Error(data?.error || 'offline');
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "I'm offline right now. You can still reach Alief on the Contact stage or at aliefkw26@gmail.com.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  // Internal links move inside the SPA (a `?stage=` link keeps the shell and
  // just swaps the stage under the open dock); external links open the PDF /
  // page in a new tab.
  const go = (href) => navigate(href.startsWith('?') ? `/${href}` : href);

  const renderBubble = (content) =>
    parseContent(content).map((part, j) => {
      if (part.type === 'link') {
        return isInternal(part.href) ? (
          <button
            key={j}
            type="button"
            className="aifab__link"
            onClick={() => go(part.href)}
          >
            {part.label}
          </button>
        ) : (
          <a
            key={j}
            className="aifab__link"
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part.label}
          </a>
        );
      }
      if (part.type === 'bold') return <strong key={j}>{part.value}</strong>;
      if (part.type === 'code') return <code key={j} className="aifab__code">{part.value}</code>;
      return <span key={j}>{part.value}</span>;
    });

  return (
    <div className="aifab">
      {!open && (
        <button
          type="button"
          className="aifab__launch"
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
        >
          <span className="aifab__launch-icon" aria-hidden="true">
            <PixelIcon name="sparkle" size={18} />
          </span>
          Ask AI
        </button>
      )}

      {open && (
        <div className="aifab__dock px-panel" role="dialog" aria-label="AI assistant">
          <div className="aifab__head">
            <span className="aifab__title">
              <span className="aifab__title-icon" aria-hidden="true">
                <PixelIcon name="sparkle" size={14} />
              </span>
              Ask AI
            </span>
            <button
              type="button"
              className="aifab__close"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div className="aifab__log" ref={logRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`aifab__msg aifab__msg--${m.role}${m.error ? ' is-error' : ''}`}
              >
                {m.role === 'assistant' && (
                  <span className="aifab__avatar" aria-hidden="true">
                    <PixelIcon name="sparkle" size={13} />
                  </span>
                )}
                <p className="aifab__bubble">{renderBubble(m.content)}</p>
              </div>
            ))}

            {loading && (
              <div className="aifab__msg aifab__msg--assistant">
                <span className="aifab__avatar" aria-hidden="true">
                  <PixelIcon name="sparkle" size={13} />
                </span>
                <p className="aifab__bubble aifab__typing">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
          </div>

          <div className="aifab__suggestions">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                className="aifab__chip"
                onClick={() => send(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          <form className="aifab__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              className="aifab__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Alief…"
              maxLength={400}
              aria-label="Ask the assistant"
            />
            <button
              type="submit"
              className="aifab__send px-btn"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <PixelIcon name="arrowRight" size={16} />
            </button>
          </form>

          <p className="aifab__note">Powered by Groq · grounded on Alief's portfolio.</p>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
