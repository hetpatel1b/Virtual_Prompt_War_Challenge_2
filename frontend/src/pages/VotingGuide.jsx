import { useState } from 'react';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { CheckCircle, ChevronDown, BookOpen, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 'step_1', title: 'Check Voter Eligibility', desc: 'You must be an Indian citizen aged 18 or above on the qualifying date (January 1 of the revision year). No educational or property qualifications are required.', tips: ['Check if you turned 18 before January 1', 'NRIs can also register under Section 20A', 'Persons of unsound mind are disqualified'], dos: ['Verify your age with official documents', 'Check eligibility early'], donts: ['Don\'t assume you\'re registered — always verify', 'Don\'t ignore the qualifying date'] },
  { id: 'step_2', title: 'Register as a Voter', desc: 'Fill Form 6 online at the NVSP portal (voters.eci.gov.in) or at your local Electoral Registration Officer. Attach age proof, address proof, and a passport photo.', tips: ['Use the Voter Helpline App for easy mobile registration', 'Registration is free of charge', 'BLO will visit for address verification'], dos: ['Keep Aadhaar and address proof ready', 'Double-check all details in the form'], donts: ['Don\'t submit blurry photos', 'Don\'t register in multiple constituencies'] },
  { id: 'step_3', title: 'Verify Voter ID', desc: 'After registration, check your name in the electoral roll online. Your EPIC (Voter ID Card) will be dispatched to your address. You can also download the e-EPIC.', tips: ['Check roll status at electoralsearch.eci.gov.in', 'SMS: EPIC <VoterID> to 1950', 'e-EPIC is accepted at polling stations'], dos: ['Download e-EPIC as backup', 'Report errors using Form 8'], donts: ['Don\'t assume your old address is still correct', 'Don\'t wait until election day to verify'] },
  { id: 'step_4', title: 'Find Your Polling Station', desc: 'Your polling station is determined by your registered address. Find it on the NVSP portal or the Voter Helpline App. Make note of the booth number and timing.', tips: ['Polling stations usually operate 7 AM to 6 PM', 'You must vote at your assigned station only', 'Carry your EPIC or other accepted photo ID'], dos: ['Check location a day before', 'Plan your travel and timing'], donts: ['Don\'t go to the wrong booth', 'Don\'t forget your photo ID'] },
  { id: 'step_5', title: 'Cast Your Vote', desc: 'At the polling station, your identity is verified. Indelible ink is applied to your finger. You enter the voting booth and press the button next to your chosen candidate on the EVM. The VVPAT displays a slip for 7 seconds as confirmation.', tips: ['The process takes just a few minutes', 'VVPAT slip confirms your vote was recorded correctly', 'Your vote is completely secret'], dos: ['Press the button firmly', 'Verify the VVPAT slip', 'Wait for the beep confirmation'], donts: ['Don\'t carry your phone inside the booth', 'Don\'t tell anyone who you voted for', 'Don\'t try to photograph the EVM'] },
  { id: 'step_6', title: 'Vote Counting Process', desc: 'After all phases of polling are complete, votes are counted on the designated counting day. Postal ballots are counted first. EVM results are tallied round by round. VVPAT slips from 5 random booths per assembly segment are verified.', tips: ['Results are available in real-time on the ECI website', 'Agents from each candidate oversee counting', 'Recounting can be requested under specific rules'], dos: ['Follow results on results.eci.gov.in', 'Trust the process — multiple layers of verification exist'], donts: ['Don\'t spread unverified result claims', 'Don\'t rely on exit polls for accuracy'] },
];

export default function VotingGuide() {
  const [completed, setCompleted] = useState(new Set());
  const [expanded, setExpanded] = useState(0);

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <div className="blob w-64 h-64 bg-emerald-500 -top-20 -right-40" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <BookOpen size={12} /> Step-by-Step Guide
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-[var(--color-text)]">Voting Guide</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1.5">Your complete journey from eligibility to casting your vote.</p>
      </div>

      <div className="relative z-10 flex items-center gap-4 p-4 rounded-2xl glass-card">
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-1.5">Progress</p>
          <ProgressBar value={completed.size} max={STEPS.length} showLabel={false} colorScheme="success" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-bold text-[var(--color-text)] tabular-nums">{completed.size}/{STEPS.length}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">steps completed</p>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {STEPS.map((step, i) => {
          const done = completed.has(step.id);
          const open = expanded === i;

          return (
            <div key={step.id} className={`rounded-2xl border overflow-hidden transition-all duration-300 animate-fade-up
              ${open
                ? 'border-primary-300/50 dark:border-primary-700/30 shadow-lg shadow-primary-600/5 bg-[var(--color-surface)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800'}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button onClick={() => setExpanded(open ? -1 : i)} className="w-full flex items-center gap-3.5 p-4 text-left" aria-expanded={open}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${done
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-[var(--color-surface-alt)] border border-[var(--color-border)] hover:border-primary-400'}`}
                  aria-label={done ? `Mark step ${i + 1} as unread` : `Mark step ${i + 1} as read`}
                >
                  {done ? <CheckCircle size={16} /> : <span className="text-xs font-bold text-[var(--color-text-muted)]">{i + 1}</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-heading font-bold text-[14px] transition ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text)]'}`}>
                    Step {i + 1} — {step.title}
                  </h3>
                </div>
                <ChevronDown size={15} className={`text-[var(--color-text-muted)] transition-transform duration-300 ${open ? 'rotate-180 text-primary-500' : ''}`} />
              </button>

              {open && (
                <div className="px-4 pb-5 ml-[3.25rem] space-y-3 animate-fade-up" style={{ animationDuration: '0.3s' }}>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">{step.desc}</p>

                  {step.tips?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/15 border border-amber-200/30 dark:border-amber-700/20">
                      <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5"><Sparkles size={10} /> Tips</p>
                      <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                        {step.tips.map((t, j) => <li key={j} className="flex gap-2 items-start"><span className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0" />{t}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {step.dos?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/15 dark:to-teal-900/15 border border-emerald-200/30 dark:border-emerald-700/20">
                        <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-2">✅ Do</p>
                        <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-200">
                          {step.dos.map((d, j) => <li key={j} className="flex gap-1.5 items-start"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{d}</li>)}
                        </ul>
                      </div>
                    )}
                    {step.donts?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/15 dark:to-rose-900/15 border border-red-200/30 dark:border-red-700/20">
                        <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-red-600 dark:text-red-400 mb-2">❌ Don't</p>
                        <ul className="space-y-1 text-xs text-red-800 dark:text-red-200">
                          {step.donts.map((d, j) => <li key={j} className="flex gap-1.5 items-start"><span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />{d}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
