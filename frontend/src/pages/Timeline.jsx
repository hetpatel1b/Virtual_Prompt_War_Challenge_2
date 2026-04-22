import { useState } from 'react';
import TimelineNode from '../components/Timeline/TimelineNode';
import { Clock, Sparkles } from 'lucide-react';

const TIMELINE_STEPS = [
  { title: 'Voter Registration Period', period: 'Ongoing / Before elections', description: 'Citizens who have turned 18 can register as voters through the NVSP portal or at their local Electoral Registration Office. The BLO verifies each registration.', activities: ['Fill Form 6 online or offline', 'BLO verification visit', 'EPIC card issuance'], funFact: 'India has over 950 million registered voters — the largest electorate in the world!' },
  { title: 'Candidate Nomination', period: 'Weeks before election', description: 'Candidates file their nomination papers with the Returning Officer. Papers are scrutinized and invalid nominations are rejected. Candidates can also withdraw.', activities: ['Filing of nomination papers', 'Scrutiny of nominations', 'Withdrawal of candidature', 'Final list of candidates published'], funFact: 'A candidate needs at least 10 proposers from the constituency to file a nomination for Lok Sabha.' },
  { title: 'Campaign Period', period: '2-3 weeks before polling', description: 'Political parties and candidates campaign through rallies, media, and door-to-door canvassing. The Model Code of Conduct governs fair behavior.', activities: ['Political rallies and speeches', 'Media advertisements', 'Door-to-door canvassing', 'Campaign expenditure monitoring'], funFact: 'Campaigning must stop 48 hours before polling — this is called the "silence period."' },
  { title: 'Voting Day', period: 'Designated polling date', description: 'Registered voters visit their assigned polling stations, verify their identity, and cast their vote using EVMs. VVPAT provides a paper verification trail.', activities: ['Voter identity verification', 'Indelible ink application on finger', 'Vote cast on EVM', 'VVPAT slip verification'], funFact: 'Voters get indelible ink on their finger that lasts about 4 weeks — to prevent double voting!' },
  { title: 'Vote Counting', period: '3-4 days after last polling phase', description: 'On counting day, EVMs are brought from secure strong rooms. Postal ballots are counted first, then EVM results are tallied round by round.', activities: ['Strong room unsealing', 'Postal ballot counting', 'Round-by-round EVM counting', 'VVPAT verification of 5 random booths'], funFact: 'Counting typically starts at 8 AM and most results are declared by the same evening.' },
  { title: 'Results Declaration', period: 'Counting day', description: 'The Returning Officer declares the winning candidate in each constituency. Results are communicated to the Election Commission and displayed on the ECI website in real-time.', activities: ['Winner declaration by Returning Officer', 'Results communicated to ECI', 'Gazette notification', 'Government formation process begins'], funFact: 'The ECI results website receives millions of hits on counting day, with results updated every few minutes.' },
];

export default function Timeline() {
  const [active, setActive] = useState(0);
  const toggle = (i) => setActive(i === active ? -1 : i);

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Blob */}
      <div className="blob w-72 h-72 bg-primary-500 -top-20 -right-40" />

      <div className="relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
            <Clock size={12} /> Interactive Timeline
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-[var(--color-text)]">Election Lifecycle</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed">Explore each phase of the journey from voter registration to election results.</p>
        </div>

        <div className="relative">
          {TIMELINE_STEPS.map((step, i) => (
            <TimelineNode key={i} step={step} index={i} isActive={active === i} onToggle={toggle} />
          ))}
        </div>
      </div>
    </div>
  );
}
