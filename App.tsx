import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

type Tab = 'Home' | 'Discover' | 'Saved' | 'Profile';
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tag: string;
  logo: string;
  description: string;
  skills: string[];
};

const jobs: Job[] = [
  {
    id: 'qa-1',
    title: 'Junior QA Tester',
    company: 'Brightly Labs',
    location: 'Málaga, Spain · Hybrid',
    type: 'Full-time',
    salary: '€20k–€25k',
    tag: 'Top match',
    logo: 'B',
    description: 'Help test customer-facing web products, write clear bug reports, and work with a small product team.',
    skills: ['Manual testing', 'Bug reporting', 'English']
  },
  {
    id: 'support-1',
    title: 'IT Support Trainee',
    company: 'Orbit Systems',
    location: 'Remote · Spain',
    type: 'Traineeship',
    salary: 'Paid internship',
    tag: 'New today',
    logo: 'O',
    description: 'Support users, diagnose everyday technical issues, and learn modern cloud and help-desk workflows.',
    skills: ['Windows', 'Communication', 'Troubleshooting']
  },
  {
    id: 'data-1',
    title: 'Junior Data Analyst',
    company: 'Northstar',
    location: 'Málaga, Spain · Hybrid',
    type: 'Full-time',
    salary: '€22k–€28k',
    tag: 'Easy apply',
    logo: 'N',
    description: 'Turn business data into useful reports and dashboards with a friendly, international analytics team.',
    skills: ['SQL', 'Excel', 'Data validation']
  },
  {
    id: 'dev-1',
    title: 'Junior Frontend Developer',
    company: 'Mosaic Apps',
    location: 'Remote · Europe',
    type: 'Full-time',
    salary: '€24k–€30k',
    tag: 'Remote',
    logo: 'M',
    description: 'Build polished product interfaces, learn from experienced engineers, and ship features every week.',
    skills: ['JavaScript', 'HTML/CSS', 'Git']
  }
];

const filters = ['All jobs', 'Remote', 'QA', 'Entry level'];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All jobs');
  const [saved, setSaved] = useState<string[]>(['qa-1']);
  const [applied, setApplied] = useState<string[]>(['support-1']);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    const words = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesText = !words || `${job.title} ${job.company} ${job.location} ${job.skills.join(' ')}`.toLowerCase().includes(words);
      const matchesFilter =
        activeFilter === 'All jobs' ||
        (activeFilter === 'Remote' && job.location.includes('Remote')) ||
        (activeFilter === 'QA' && job.title.includes('QA')) ||
        (activeFilter === 'Entry level' && (job.title.includes('Junior') || job.type === 'Traineeship'));
      return matchesText && matchesFilter;
    });
  }, [activeFilter, query]);

  const toggleSaved = (jobId: string) => {
    setSaved((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]);
  };

  const applyForJob = (job: Job) => {
    if (!applied.includes(job.id)) setApplied((current) => [...current, job.id]);
    setSelectedJob(null);
    Alert.alert('Application started', `Your Notby profile is ready to apply for ${job.title} at ${job.company}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>NOTBY</Text>
            <Text style={styles.heading}>{activeTab === 'Home' ? 'Find work that fits you.' : activeTab}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>YA</Text></View>
        </View>

        {activeTab === 'Home' && (
          <Home
            query={query}
            setQuery={setQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filteredJobs={filteredJobs}
            saved={saved}
            applied={applied}
            onSave={toggleSaved}
            onOpen={setSelectedJob}
            onDiscover={() => setActiveTab('Discover')}
          />
        )}
        {activeTab === 'Discover' && (
          <Discover
            query={query}
            setQuery={setQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filteredJobs={filteredJobs}
            saved={saved}
            applied={applied}
            onSave={toggleSaved}
            onOpen={setSelectedJob}
          />
        )}
        {activeTab === 'Saved' && (
          <Saved jobs={jobs.filter((job) => saved.includes(job.id))} onOpen={setSelectedJob} onSave={toggleSaved} />
        )}
        {activeTab === 'Profile' && <Profile appliedCount={applied.length} savedCount={saved.length} />}

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} savedCount={saved.length} />
      </View>

      <JobModal job={selectedJob} saved={saved.includes(selectedJob?.id ?? '')} applied={applied.includes(selectedJob?.id ?? '')} onClose={() => setSelectedJob(null)} onSave={toggleSaved} onApply={applyForJob} />
    </SafeAreaView>
  );
}

function Home({ query, setQuery, activeFilter, setActiveFilter, filteredJobs, saved, applied, onSave, onOpen, onDiscover }: {
  query: string; setQuery: (value: string) => void; activeFilter: string; setActiveFilter: (value: string) => void; filteredJobs: Job[]; saved: string[]; applied: string[]; onSave: (id: string) => void; onOpen: (job: Job) => void; onDiscover: () => void;
}) {
  return <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.welcome}>Good evening, Yumi ✦</Text>
    <Text style={styles.subheading}>Your next opportunity is closer than you think.</Text>
    <Search value={query} onChange={setQuery} />
    <FilterRow active={activeFilter} onSelect={setActiveFilter} />
    <View style={styles.insightCard}>
      <View style={styles.insightIcon}><Text style={styles.insightEmoji}>✦</Text></View>
      <View style={styles.insightText}><Text style={styles.insightTitle}>Your profile is strong</Text><Text style={styles.insightBody}>Your project portfolio is helping you stand out.</Text></View>
      <Text style={styles.arrow}>›</Text>
    </View>
    <SectionTitle title="Recommended for you" action="See all" onPress={onDiscover} />
    {filteredJobs.slice(0, 2).map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} applied={applied.includes(job.id)} onSave={onSave} onOpen={onOpen} />)}
    <SectionTitle title="Your activity" />
    <View style={styles.activityRow}>
      <Stat label="Applied" value={String(applied.length).padStart(2, '0')} color="#E0EEFF" />
      <Stat label="Saved" value={String(saved.length).padStart(2, '0')} color="#EEE8FF" />
      <Stat label="Profile" value="94%" color="#DFF6EC" />
    </View>
  </ScrollView>;
}

function Discover({ query, setQuery, activeFilter, setActiveFilter, filteredJobs, saved, applied, onSave, onOpen }: {
  query: string; setQuery: (value: string) => void; activeFilter: string; setActiveFilter: (value: string) => void; filteredJobs: Job[]; saved: string[]; applied: string[]; onSave: (id: string) => void; onOpen: (job: Job) => void;
}) {
  return <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.subheading}>Search entry-level, remote and local opportunities.</Text>
    <Search value={query} onChange={setQuery} />
    <FilterRow active={activeFilter} onSelect={setActiveFilter} />
    <Text style={styles.resultCount}>{filteredJobs.length} opportunities found</Text>
    {filteredJobs.map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} applied={applied.includes(job.id)} onSave={onSave} onOpen={onOpen} />)}
  </ScrollView>;
}

function Saved({ jobs, onOpen, onSave }: { jobs: Job[]; onOpen: (job: Job) => void; onSave: (id: string) => void }) {
  return <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.subheading}>Keep roles here while you decide where to apply.</Text>
    {jobs.length ? jobs.map((job) => <JobCard key={job.id} job={job} saved onSave={onSave} onOpen={onOpen} />) : <EmptyState />}
  </ScrollView>;
}

function Profile({ appliedCount, savedCount }: { appliedCount: number; savedCount: number }) {
  return <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.profileHero}><View style={styles.largeAvatar}><Text style={styles.largeAvatarText}>YA</Text></View><Text style={styles.profileName}>Yumyugyul Adem</Text><Text style={styles.profileRole}>Junior QA Tester · Málaga, Spain</Text><View style={styles.openToWork}><Text style={styles.openToWorkDot}>●</Text><Text style={styles.openToWorkText}>Open to work</Text></View><Pressable style={styles.outlineButton}><Text style={styles.outlineButtonText}>Edit profile</Text></Pressable></View>
    <Text style={styles.profilePercent}>94%</Text><Text style={styles.profileHint}>Profile strength</Text>
    <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
    <View style={styles.profileStats}><ProfileStat value={String(appliedCount)} label="Applications" /><ProfileStat value={String(savedCount)} label="Saved roles" /><ProfileStat value="6" label="Core skills" /></View>
    <Text style={styles.sectionTitle}>About</Text>
    <Text style={styles.aboutText}>Software Engineering student focused on functional testing, clear defect reporting, and reliable user journeys. Looking for junior QA, IT support, and entry-level technical roles.</Text>
    <Text style={styles.sectionTitle}>Target roles</Text>
    <View style={styles.profilePills}><Text style={styles.profilePill}>Junior QA Tester</Text><Text style={styles.profilePill}>IT Support</Text><Text style={styles.profilePill}>Junior Data Analyst</Text></View>
    <Text style={styles.sectionTitle}>Skills</Text>
    <View style={styles.profilePills}><Text style={styles.profilePill}>Playwright</Text><Text style={styles.profilePill}>Manual testing</Text><Text style={styles.profilePill}>Bug reporting</Text><Text style={styles.profilePill}>SQL</Text><Text style={styles.profilePill}>TypeScript</Text><Text style={styles.profilePill}>GitHub</Text></View>
    <View style={styles.projectCard}><View style={styles.projectIcon}><Text style={styles.projectIconText}>⌘</Text></View><View style={styles.projectInfo}><Text style={styles.projectTitle}>SauceDemo QA Automation</Text><Text style={styles.projectBody}>Playwright · TypeScript · 4 tests passing</Text></View><Text style={styles.projectArrow}>›</Text></View>
    <Text style={styles.languageLine}>Turkish & Bulgarian native · English B2 · Spanish beginner</Text>
    <Text style={styles.sectionTitle}>Profile checklist</Text>
    <CheckRow complete label="Basic details added" />
    <CheckRow complete label="Skills and interests added" />
    <CheckRow complete label="Project link added" />
  </ScrollView>;
}

function Search({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput style={styles.searchInput} value={value} onChangeText={onChange} placeholder="Job title, skill or company" placeholderTextColor="#8A94A6" returnKeyType="search" /></View>;
}

function FilterRow({ active, onSelect }: { active: string; onSelect: (value: string) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{filters.map((filter) => <Pressable key={filter} onPress={() => onSelect(filter)} style={[styles.filter, active === filter && styles.filterActive]}><Text style={[styles.filterText, active === filter && styles.filterTextActive]}>{filter}</Text></Pressable>)}</ScrollView>;
}

function JobCard({ job, saved, applied, onSave, onOpen }: { job: Job; saved: boolean; applied?: boolean; onSave: (id: string) => void; onOpen: (job: Job) => void }) {
  return <Pressable style={styles.jobCard} onPress={() => onOpen(job)}>
    <View style={[styles.companyLogo, { backgroundColor: logoColor(job.logo) }]}><Text style={styles.companyLogoText}>{job.logo}</Text></View>
    <View style={styles.jobInfo}><View style={styles.jobTitleRow}><Text style={styles.jobTitle}>{job.title}</Text><Pressable hitSlop={8} onPress={() => onSave(job.id)}><Text style={styles.bookmark}>{saved ? '★' : '☆'}</Text></Pressable></View><Text style={styles.company}>{job.company}</Text><Text style={styles.jobMeta}>{job.location}</Text><View style={styles.badgeRow}><Text style={styles.tag}>{job.tag}</Text>{applied ? <Text style={styles.appliedTag}>Applied</Text> : null}</View></View>
  </Pressable>;
}

function JobModal({ job, saved, applied, onClose, onSave, onApply }: { job: Job | null; saved: boolean; applied: boolean; onClose: () => void; onSave: (id: string) => void; onApply: (job: Job) => void }) {
  if (!job) return null;
  return <Modal visible transparent animationType="slide" onRequestClose={onClose}><Pressable style={styles.modalBackdrop} onPress={onClose}><Pressable style={styles.modal} onPress={() => undefined}><View style={styles.modalHandle} /><View style={styles.modalHeader}><View style={[styles.companyLogo, { backgroundColor: logoColor(job.logo) }]}><Text style={styles.companyLogoText}>{job.logo}</Text></View><Pressable onPress={onClose} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable></View><Text style={styles.modalTitle}>{job.title}</Text><Text style={styles.modalCompany}>{job.company}</Text><Text style={styles.modalMeta}>{job.location} · {job.type}</Text><View style={styles.modalSalary}><Text style={styles.modalSalaryText}>{job.salary}</Text></View><Text style={styles.modalHeading}>About this role</Text><Text style={styles.modalBody}>{job.description}</Text><Text style={styles.modalHeading}>Skills you can use</Text><View style={styles.skillRow}>{job.skills.map((skill) => <Text key={skill} style={styles.skill}>{skill}</Text>)}</View><View style={styles.modalActions}><Pressable style={styles.saveButton} onPress={() => onSave(job.id)}><Text style={styles.saveButtonText}>{saved ? '★ Saved' : '☆ Save'}</Text></Pressable><Pressable style={[styles.applyButton, applied && styles.applyButtonDone]} onPress={() => onApply(job)}><Text style={styles.applyButtonText}>{applied ? 'Applied' : 'Quick apply'}</Text></Pressable></View></Pressable></Pressable></Modal>;
}

function Navigation({ activeTab, setActiveTab, savedCount }: { activeTab: Tab; setActiveTab: (tab: Tab) => void; savedCount: number }) {
  const items: { label: Tab; icon: string }[] = [{ label: 'Home', icon: '⌂' }, { label: 'Discover', icon: '⌕' }, { label: 'Saved', icon: '☆' }, { label: 'Profile', icon: '◉' }];
  return <View style={styles.nav}>{items.map((item) => <Pressable key={item.label} style={styles.navItem} onPress={() => setActiveTab(item.label)}><View>{item.label === 'Saved' && savedCount ? <View style={styles.countBubble}><Text style={styles.countText}>{savedCount}</Text></View> : null}<Text style={[styles.navIcon, activeTab === item.label && styles.navActive]}>{item.icon}</Text></View><Text style={[styles.navLabel, activeTab === item.label && styles.navLabelActive]}>{item.label}</Text></Pressable>)}</View>;
}

function SectionTitle({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) { return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>; }
function Stat({ label, value, color }: { label: string; value: string; color: string }) { return <View style={[styles.stat, { backgroundColor: color }]}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function ProfileStat({ value, label }: { value: string; label: string }) { return <View style={styles.profileStat}><Text style={styles.profileStatValue}>{value}</Text><Text style={styles.profileStatLabel}>{label}</Text></View>; }
function CheckRow({ label, complete = false }: { label: string; complete?: boolean }) { return <View style={styles.checkRow}><Text style={[styles.check, complete && styles.checkDone]}>{complete ? '✓' : '○'}</Text><Text style={styles.checkLabel}>{label}</Text></View>; }
function EmptyState() { return <View style={styles.empty}><Text style={styles.emptyIcon}>☆</Text><Text style={styles.emptyTitle}>Nothing saved yet</Text><Text style={styles.emptyBody}>Save a role and return to it when you are ready.</Text></View>; }
function logoColor(logo: string) { return ({ B: '#E2EAFE', O: '#FCE7D3', N: '#DDF4E8', M: '#EEE4FF' } as Record<string, string>)[logo] ?? '#E2EAFE'; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' }, app: { flex: 1, backgroundColor: '#F8FAFC' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 16, paddingBottom: 12 }, eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2, color: '#4F46E5' }, heading: { marginTop: 3, fontSize: 27, fontWeight: '800', letterSpacing: -0.8, color: '#101828' }, avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' }, avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 }, content: { paddingHorizontal: 22, paddingBottom: 108 }, welcome: { marginTop: 7, color: '#344054', fontSize: 16, fontWeight: '700' }, subheading: { marginTop: 5, color: '#667085', fontSize: 14, lineHeight: 20 }, search: { flexDirection: 'row', alignItems: 'center', marginTop: 20, height: 52, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7EC' }, searchIcon: { fontSize: 28, lineHeight: 28, marginRight: 9, color: '#667085' }, searchInput: { flex: 1, fontSize: 15, color: '#101828' }, filterRow: { paddingVertical: 15, gap: 8 }, filter: { borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7EC' }, filterActive: { backgroundColor: '#111827', borderColor: '#111827' }, filterText: { color: '#475467', fontWeight: '700', fontSize: 13 }, filterTextActive: { color: '#FFFFFF' }, insightCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: '#EDEBFE', marginBottom: 25 }, insightIcon: { height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#DCD7FF', marginRight: 10 }, insightEmoji: { color: '#4F46E5', fontSize: 18 }, insightText: { flex: 1 }, insightTitle: { color: '#3730A3', fontWeight: '800', fontSize: 13 }, insightBody: { color: '#5B5BA5', fontSize: 12, marginTop: 2 }, arrow: { color: '#4F46E5', fontSize: 28 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, sectionTitle: { color: '#101828', fontWeight: '800', fontSize: 18, letterSpacing: -0.25, marginTop: 22 }, sectionAction: { color: '#4F46E5', fontWeight: '800', fontSize: 13 }, jobCard: { flexDirection: 'row', padding: 15, borderRadius: 18, backgroundColor: '#FFFFFF', marginBottom: 11, borderWidth: 1, borderColor: '#EAECF0', shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.035, shadowRadius: 5, elevation: 1 }, companyLogo: { height: 42, width: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 12 }, companyLogoText: { fontSize: 17, fontWeight: '900', color: '#1D2939' }, jobInfo: { flex: 1 }, jobTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }, jobTitle: { flex: 1, fontWeight: '800', color: '#101828', fontSize: 15, lineHeight: 20 }, bookmark: { color: '#4F46E5', fontSize: 22, lineHeight: 22 }, company: { marginTop: 2, fontSize: 13, fontWeight: '700', color: '#475467' }, jobMeta: { marginTop: 3, fontSize: 12, color: '#667085' }, badgeRow: { flexDirection: 'row', gap: 6, marginTop: 10 }, tag: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, fontSize: 11, fontWeight: '800', color: '#3C36B0', backgroundColor: '#EEEDFF' }, appliedTag: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, fontSize: 11, fontWeight: '800', color: '#067647', backgroundColor: '#ECFDF3' }, activityRow: { flexDirection: 'row', gap: 9, marginTop: 2 }, stat: { flex: 1, padding: 13, borderRadius: 15 }, statValue: { fontSize: 21, fontWeight: '900', color: '#101828' }, statLabel: { marginTop: 3, fontSize: 11, fontWeight: '700', color: '#475467' }, resultCount: { marginBottom: 12, color: '#667085', fontSize: 13, fontWeight: '700' }, nav: { height: 76, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EAECF0', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }, navItem: { width: 68, alignItems: 'center', gap: 3 }, navIcon: { color: '#98A2B3', fontSize: 23, lineHeight: 24 }, navActive: { color: '#4F46E5' }, navLabel: { fontSize: 10, color: '#98A2B3', fontWeight: '700' }, navLabelActive: { color: '#4F46E5' }, countBubble: { position: 'absolute', right: -8, top: -6, backgroundColor: '#4F46E5', minWidth: 15, height: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center', zIndex: 1 }, countText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' }, profileHero: { alignItems: 'center', paddingTop: 8, paddingBottom: 23 }, largeAvatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' }, largeAvatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' }, profileName: { marginTop: 12, color: '#101828', fontSize: 20, fontWeight: '800' }, profileRole: { marginTop: 4, color: '#667085', fontSize: 13 }, openToWork: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#ECFDF3', borderRadius: 10 }, openToWorkDot: { color: '#12B76A', fontSize: 11 }, openToWorkText: { color: '#067647', fontSize: 11, fontWeight: '800' }, outlineButton: { marginTop: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D0D5DD', paddingVertical: 9, paddingHorizontal: 16 }, outlineButtonText: { color: '#344054', fontSize: 13, fontWeight: '800' }, profilePercent: { marginTop: 4, fontSize: 32, fontWeight: '900', color: '#101828', textAlign: 'center' }, profileHint: { color: '#667085', fontSize: 13, textAlign: 'center', marginTop: 2 }, progressTrack: { height: 9, marginTop: 13, borderRadius: 9, backgroundColor: '#EAECF0', overflow: 'hidden' }, progressFill: { width: '94%', height: '100%', backgroundColor: '#4F46E5', borderRadius: 9 }, profileStats: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 25, marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAECF0' }, profileStat: { alignItems: 'center', flex: 1 }, profileStatValue: { color: '#101828', fontSize: 20, fontWeight: '900' }, profileStatLabel: { marginTop: 3, color: '#667085', fontWeight: '600', fontSize: 11 }, aboutText: { marginTop: 8, color: '#475467', fontSize: 13, lineHeight: 20 }, profilePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, profilePill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: '#EEF2FF', color: '#4338CA', fontSize: 12, fontWeight: '700' }, projectCard: { flexDirection: 'row', alignItems: 'center', marginTop: 22, padding: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7EC', borderRadius: 15 }, projectIcon: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#111827', marginRight: 10 }, projectIconText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' }, projectInfo: { flex: 1 }, projectTitle: { color: '#101828', fontSize: 13, fontWeight: '800' }, projectBody: { marginTop: 3, color: '#667085', fontSize: 11 }, projectArrow: { color: '#667085', fontSize: 25 }, languageLine: { marginTop: 12, color: '#667085', fontSize: 11, textAlign: 'center' }, checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }, check: { marginRight: 10, fontSize: 18, color: '#98A2B3' }, checkDone: { color: '#12B76A' }, checkLabel: { color: '#344054', fontWeight: '600', fontSize: 14 }, empty: { marginTop: 70, alignItems: 'center', paddingHorizontal: 35 }, emptyIcon: { color: '#4F46E5', fontSize: 38 }, emptyTitle: { marginTop: 12, fontSize: 17, color: '#101828', fontWeight: '800' }, emptyBody: { marginTop: 6, fontSize: 13, lineHeight: 19, color: '#667085', textAlign: 'center' }, modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(16,24,40,0.38)' }, modal: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 32, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#FFFFFF' }, modalHandle: { height: 4, width: 38, alignSelf: 'center', borderRadius: 5, backgroundColor: '#D0D5DD', marginBottom: 20 }, modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, closeButton: { height: 34, width: 34, borderRadius: 17, backgroundColor: '#F2F4F7', justifyContent: 'center', alignItems: 'center' }, closeText: { fontSize: 24, lineHeight: 26, color: '#475467' }, modalTitle: { marginTop: 17, color: '#101828', fontSize: 23, fontWeight: '900', letterSpacing: -0.6 }, modalCompany: { marginTop: 3, color: '#475467', fontSize: 15, fontWeight: '700' }, modalMeta: { marginTop: 7, color: '#667085', fontSize: 13 }, modalSalary: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: '#ECFDF3' }, modalSalaryText: { color: '#067647', fontSize: 12, fontWeight: '800' }, modalHeading: { marginTop: 20, marginBottom: 6, fontSize: 15, color: '#101828', fontWeight: '800' }, modalBody: { fontSize: 13, lineHeight: 19, color: '#475467' }, skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, skill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: '#F2F4F7', color: '#475467', fontSize: 12, fontWeight: '700' }, modalActions: { flexDirection: 'row', gap: 10, marginTop: 25 }, saveButton: { width: 106, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#D0D5DD' }, saveButtonText: { color: '#344054', fontWeight: '800', fontSize: 13 }, applyButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, backgroundColor: '#4F46E5' }, applyButtonDone: { backgroundColor: '#12B76A' }, applyButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 }
});
