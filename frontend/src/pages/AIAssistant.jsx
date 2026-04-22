import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { getSuggestions } from '../services/api';
import ChatBubble from '../components/Chat/ChatBubble';
import ChatInput from '../components/Chat/ChatInput';
import SuggestedQuestions from '../components/Chat/SuggestedQuestions';
import { Bot, Trash2, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const { messages, isLoading, send, clearChat } = useChat();
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    getSuggestions().then((d) => setSuggestions(d.suggestions || [])).catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -m-4 lg:-m-8">
      <div ref={scrollRef} className="flex-1 overflow-y-auto" role="log" aria-label="Chat messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center relative">
            {/* Ambient blobs */}
            <div className="blob w-64 h-64 bg-primary-500 top-10 -right-20" />
            <div className="blob w-48 h-48 bg-violet-500 bottom-20 -left-10" style={{ animationDelay: '4s' }} />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-violet-500 flex items-center justify-center mb-5 mx-auto shadow-2xl shadow-primary-600/30">
                <Bot size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[var(--color-text)] mb-2">Election AI Assistant</h2>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-2">
                I can help you understand elections, voting processes, democracy, and civic participation.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-primary-600 dark:text-primary-400 font-medium mb-8">
                <Sparkles size={11} /> Powered by Google Gemini AI
              </div>
              <SuggestedQuestions suggestions={suggestions} onSelect={send} />
            </div>
          </div>
        ) : (
          <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
            {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
            {isLoading && (
              <div className="flex gap-3 items-start animate-fade-up">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-tl-md glass-card">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-[var(--color-border)] flex justify-end">
          <button onClick={clearChat} className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-muted)] hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Clear chat">
            <Trash2 size={11} /> Clear conversation
          </button>
        </div>
      )}

      <ChatInput onSend={send} isLoading={isLoading} />
    </div>
  );
}
