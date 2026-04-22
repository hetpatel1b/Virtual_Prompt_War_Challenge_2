import { useState, useMemo } from 'react';
import KnowledgeCard from '../components/Knowledge/KnowledgeCard';
import Card from '../components/common/Card';
import { Search, Lightbulb, Sparkles } from 'lucide-react';

const CARDS = [
  { id: 'democracy', category: 'Fundamentals', difficulty: 'easy', title: 'What is Democracy?', summary: 'Democracy is a system of government where power is vested in the people, exercised through elected representatives.', content: 'Democracy comes from the Greek words "demos" (people) and "kratos" (rule). India adopted democratic governance on January 26, 1950, making it the world\'s largest democracy. Key pillars include universal adult suffrage, fundamental rights, an independent judiciary, and a free press. India follows a parliamentary form where the executive is responsible to the legislature.', keyTakeaways: ['Government of the people, by the people, for the people', 'India is the world\'s largest democracy', 'Key features: universal suffrage, fundamental rights, Rule of Law', 'Parliamentary system with executive accountability'] },
  { id: 'election', category: 'Fundamentals', difficulty: 'easy', title: 'What is an Election?', summary: 'An election is a formal process where citizens vote to choose their representatives for government positions.', content: 'Elections are the mechanism through which citizens participate in choosing their government. In India, elections are conducted by the Election Commission under Article 324 of the Constitution. The process involves voter registration, candidate nomination, campaigning, polling, counting, and result declaration. India uses Electronic Voting Machines (EVMs) with VVPAT for transparent vote recording.', keyTakeaways: ['Elections are the cornerstone of democracy', 'Governed by Article 324 of the Indian Constitution', 'Election Commission ensures free and fair elections', 'EVMs with VVPAT ensure transparency'] },
  { id: 'voting', category: 'Participation', difficulty: 'easy', title: 'Why Voting Matters', summary: 'Every vote counts — voting is your power to choose who makes decisions that affect your life and community.', content: 'Voting is a fundamental right under Article 326 of the Indian Constitution. It gives every adult citizen an equal say in governance, regardless of caste, religion, gender, or economic status. Higher voter turnout strengthens democratic legitimacy. Many elections have been decided by razor-thin margins, proving every vote matters. NOTA option allows voters to express dissatisfaction with all candidates.', keyTakeaways: ['Voting is a fundamental right, not just a privilege', 'Elections have been won by margins of 1-2 votes', 'NOTA was introduced in 2013 for voter expression', 'Higher turnout = stronger democratic mandate'] },
  { id: 'types', category: 'Knowledge', difficulty: 'medium', title: 'Types of Elections', summary: 'India conducts multiple types of elections — from local Panchayat elections to national Lok Sabha elections.', content: 'India has a multi-tiered electoral system. Lok Sabha elections choose members of the lower house of Parliament (545 seats, every 5 years). Rajya Sabha members are indirectly elected by state legislators. State Assembly (Vidhan Sabha) elections determine state governments. Local body elections (Panchayat, Municipality, Corporation) govern at the grassroots level. By-elections fill mid-term vacancies. Presidential and Vice-Presidential elections use an electoral college system.', keyTakeaways: ['Lok Sabha — National parliament (direct election)', 'Rajya Sabha — Upper house (indirect election)', 'Vidhan Sabha — State legislatures', 'Panchayat/Municipal — Local governance', 'By-elections — Fill mid-term vacancies'] },
  { id: 'fair_elections', category: 'Knowledge', difficulty: 'medium', title: 'Importance of Fair Elections', summary: 'Free and fair elections are essential for democratic legitimacy.', content: 'The Election Commission deploys observers, expenditure monitors, and security forces to ensure fair elections. The Model Code of Conduct restricts government announcements during elections. EVMs with VVPAT provide tamper-proof voting. The C-VIGIL app allows citizens to report violations in real-time. Courts can order re-elections if malpractice is proven. Campaign spending limits ensure a level playing field.', keyTakeaways: ['Model Code of Conduct ensures fair play', 'VVPAT provides paper trail for verification', 'C-VIGIL app empowers citizen reporting', 'Expenditure monitoring prevents unfair advantage', 'Judiciary can order re-elections'] },
  { id: 'election_commission', category: 'Institutions', difficulty: 'medium', title: 'Election Commission of India', summary: 'An autonomous constitutional body established in 1950 to conduct free and fair elections.', content: 'The ECI is established under Article 324 of the Constitution. It consists of the Chief Election Commissioner and two Election Commissioners, appointed by the President. The CEC enjoys security of tenure and can only be removed through impeachment. The ECI prepares electoral rolls, schedules elections, enforces the Model Code of Conduct, and grants recognition to political parties. January 25 is celebrated as National Voters\' Day.', keyTakeaways: ['Constitutional body under Article 324', 'CEC protected by impeachment-level removal process', 'Manages world\'s largest democratic elections', 'January 25 = National Voters\' Day', 'Allots election symbols to parties'] },
];

const CATEGORIES = ['All', ...new Set(CARDS.map((c) => c.category))];

export default function KnowledgeCards() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return CARDS.filter((c) => {
      const matchCat = category === 'All' || c.category === category;
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.summary.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-6 relative">
      <div className="blob w-64 h-64 bg-amber-500 -top-20 -right-40" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          <Lightbulb size={12} /> Deep Dives
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-[var(--color-text)]">Knowledge Base</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1.5">Deep-dive into election concepts, democracy, and civic rights.</p>
      </div>

      {/* Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-primary-500 transition" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition"
            aria-label="Search knowledge cards"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                ${category === cat
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-600/20'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid sm:grid-cols-2 gap-4">
        {filtered.map((card, i) => (
          <div key={card.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <KnowledgeCard card={card} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <Search size={32} className="mx-auto text-[var(--color-text-muted)] opacity-40 mb-3" />
            <p className="text-[var(--color-text-muted)] font-medium">No cards match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
