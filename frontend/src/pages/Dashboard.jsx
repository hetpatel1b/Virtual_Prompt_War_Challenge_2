import { Link } from 'react-router-dom';
import { ROUTES, ELECTION_FACTS } from '../utils/constants';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { MessageSquare, Clock, BookOpen, Lightbulb, Trophy, Zap, ArrowRight, Sparkles, TrendingUp, Users, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

const FEATURES = [
  { path: ROUTES.ASSISTANT, icon: MessageSquare, title: 'AI Assistant', desc: 'Ask any election question and get instant, structured answers.', gradient: 'from-violet-500 to-indigo-500', bg: 'bg-violet-500/10', badge: 'New' },
  { path: ROUTES.TIMELINE, icon: Clock, title: 'Election Timeline', desc: 'Walk through every phase of the election lifecycle.', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', badge: null },
  { path: ROUTES.GUIDE, icon: BookOpen, title: 'Voting Guide', desc: 'Step-by-step guide from registration to casting your vote.', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', badge: null },
  { path: ROUTES.KNOWLEDGE, icon: Lightbulb, title: 'Knowledge Base', desc: 'Deep-dive into democracy, elections, and civic rights.', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', badge: null },
  { path: ROUTES.QUIZ, icon: Trophy, title: 'Quiz Challenge', desc: 'Test your knowledge with 20+ interactive questions.', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', badge: 'Popular' },
  { path: ROUTES.SIMULATOR, icon: Zap, title: 'Scenario Lab', desc: 'Explore "What if?" election scenarios with AI simulation.', gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10', badge: 'AI' },
];

const STATS = [
  { icon: BookOpen, value: '7', label: 'Learning Modules', color: 'text-violet-500' },
  { icon: Brain, value: '20+', label: 'Quiz Questions', color: 'text-emerald-500' },
  { icon: Users, value: '6', label: 'Knowledge Topics', color: 'text-amber-500' },
  { icon: TrendingUp, value: 'AI', label: 'Powered by Gemini', color: 'text-cyan-500' },
];

export default function Dashboard() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFactIndex((i) => (i + 1) % ELECTION_FACTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative hero-gradient rounded-3xl p-8 md:p-12 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-violet-300/10 rounded-full blur-xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-5">
            <Sparkles size={13} className="text-amber-300" />
            <span className="text-xs font-semibold text-white/90">AI-Powered Election Education</span>
          </div>

          <h2 className="text-3xl md:text-[2.5rem] font-heading font-extrabold leading-[1.15] mb-4 tracking-tight">
            Your Interactive Guide to<br />Understanding Elections
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
            Learn how democracy works through interactive lessons, quizzes, and an AI assistant that answers everything about elections.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.ASSISTANT} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98]">
              Start with AI Assistant <ArrowRight size={16} />
            </Link>
            <Link to={ROUTES.QUIZ} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              Take the Quiz <Trophy size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <Card key={stat.label} variant="glass" className="text-center py-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2 opacity-70`} />
            <p className="text-2xl font-heading font-bold text-[var(--color-text)]">{stat.value}</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 font-medium">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Features Grid ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-heading font-bold text-[var(--color-text)]">Explore Modules</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Choose a module to start learning</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Link key={f.path} to={f.path} className="group animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Card hoverable className="h-full relative overflow-hidden">
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <f.icon size={20} className={`bg-gradient-to-br ${f.gradient} bg-clip-text`} style={{ color: f.gradient.includes('violet') ? '#8b5cf6' : f.gradient.includes('blue') ? '#3b82f6' : f.gradient.includes('emerald') ? '#10b981' : f.gradient.includes('amber') ? '#f59e0b' : f.gradient.includes('rose') ? '#f43f5e' : '#06b6d4' }} />
                  </div>
                  {f.badge && (
                    <Badge color={f.badge === 'New' ? 'primary' : f.badge === 'Popular' ? 'error' : 'info'} size="sm">{f.badge}</Badge>
                  )}
                </div>

                <h3 className="font-heading font-bold text-[var(--color-text)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition text-[15px]">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed">{f.desc}</p>

                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight size={12} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Did You Know ──────────────────────────────── */}
      <Card variant="glass" className="flex items-start gap-4 overflow-hidden relative">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-amber-500" />
        </div>
        <div>
          <p className="font-heading font-bold text-sm text-[var(--color-text)] mb-1">Did You Know?</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed transition-all duration-500" key={factIndex}>{ELECTION_FACTS[factIndex]}</p>
        </div>
      </Card>
    </div>
  );
}
