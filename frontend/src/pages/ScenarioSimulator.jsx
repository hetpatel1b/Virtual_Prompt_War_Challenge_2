import { useState, useEffect } from 'react';
import { simulateScenario, getSuggestions } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Zap, Send, Sparkles, BookOpen, Scale, ChevronRight } from 'lucide-react';

const SCENARIO_ICONS = { government_formation: Scale, election_process: BookOpen, polling: Zap, vote_counting: Sparkles, election_integrity: Scale };

export default function ScenarioSimulator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    getSuggestions().then((d) => setScenarios(d.scenarios || [])).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await simulateScenario(input.trim());
      setResult(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <div className="blob w-72 h-72 bg-cyan-500 -top-20 -right-40" />

      {/* Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
          <Zap size={12} /> AI Simulation
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-[var(--color-text)]">Scenario Lab</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed max-w-lg">
          Explore "What if?" election scenarios. Describe a situation and our AI simulates the constitutional outcome step-by-step.
        </p>
      </div>

      {/* Scenario decision cards */}
      {scenarios.length > 0 && !result && (
        <div className="relative z-10 grid sm:grid-cols-2 gap-3">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setInput(s.prompt)}
              className="animate-fade-up group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Card hoverable variant="glass" className="text-left !p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/15 group-hover:scale-110 transition-transform">
                    <Zap size={15} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-[13px] text-[var(--color-text)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">{s.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">{s.description}</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-muted)] group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 space-y-3">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            placeholder="Describe an election scenario… e.g., 'What happens if no party gets a majority in the Lok Sabha?'"
            rows={4}
            className="relative w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-transparent resize-none"
            aria-label="Describe an election scenario"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums font-medium">{input.length}/1000</span>
          <Button onClick={handleSubmit} loading={loading} disabled={!input.trim()} icon={Send} variant="glow">Simulate Scenario</Button>
        </div>
      </div>

      {error && <p className="relative z-10 text-sm text-red-500 text-center">{error}</p>}
      {loading && <div className="relative z-10"><LoadingSpinner text="AI is analyzing the scenario…" /></div>}

      {/* Results */}
      {result && !loading && (
        <div className="relative z-10 space-y-4">
          {result.scenario && (
            <Card variant="outline" className="animate-fade-up" style={{ animationDelay: '0ms' }}>
              <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-1.5"><BookOpen size={11} /> Scenario</p>
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{result.scenario}</p>
            </Card>
          )}

          {result.analysis && (
            <Card variant="glass" className="animate-fade-up" style={{ animationDelay: '80ms' }}>
              <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5"><Sparkles size={11} /> Analysis</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{result.analysis}</p>
            </Card>
          )}

          {result.steps?.length > 0 && (
            <div className="space-y-2.5">
              <p className="font-heading font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                <Zap size={14} className="text-cyan-500" /> Step-by-Step Resolution
              </p>
              {result.steps.map((s, i) => (
                <Card key={i} variant="glass" className="!p-4 animate-fade-up" style={{ animationDelay: `${(i + 2) * 80}ms` }}>
                  <div className="flex gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-primary-600/20">
                      {s.step || i + 1}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-[var(--color-text)]">{s.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {result.outcome && (
            <Card className="border-l-4 border-l-emerald-500 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-2">✅ Most Likely Outcome</p>
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{result.outcome}</p>
            </Card>
          )}

          {result.constitutionalBasis && (
            <Card variant="outline" className="animate-fade-up" style={{ animationDelay: '480ms' }}>
              <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5"><Scale size={11} /> Constitutional Basis</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{result.constitutionalBasis}</p>
            </Card>
          )}

          <div className="text-center pt-2">
            <Button variant="secondary" onClick={() => { setResult(null); setInput(''); }}>Try Another Scenario</Button>
          </div>
        </div>
      )}
    </div>
  );
}
