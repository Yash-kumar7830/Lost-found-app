import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Package,
  HelpCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  Building,
  Compass
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ItemCard from '../components/items/ItemCard';
import ClaimModal from '../components/claims/ClaimModal';
import { useData } from '../context/DataContext';

export default function LandingPage() {
  const { items } = useData();
  const navigate = useNavigate();
  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // Take first 3 found items for the featured recently found items section
  const featuredFoundItems = items.filter((item) => item.type === 'found').slice(0, 3);

  const stats = [
    { label: 'Campus Items Reported', value: '1,420+', change: '+12% this month' },
    { label: 'Reunited with Owners', value: '89.4%', change: 'Campus record' },
    { label: 'Verified Students', value: '18,500+', change: 'All departments' },
    { label: 'Average Recovery Time', value: '< 24 hrs', change: 'With smart match' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Scan Student ID',
      desc: 'Quickly scan your physical campus smart ID card using your phone camera to extract your student credential.',
      icon: QrCode,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      step: '02',
      title: 'Verify OTP',
      desc: 'Receive a secure one-time passcode to your registered college email or mobile to confirm real student identity.',
      icon: ShieldCheck,
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      step: '03',
      title: 'Report an Item',
      desc: 'Submit photos, campus location, timestamps, and define private verification questions for found items.',
      icon: Package,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      step: '04',
      title: 'Reunite & Handover',
      desc: 'Our smart matching engine pairs reports automatically. Collect verified belongings at the campus security desk.',
      icon: CheckCircle2,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  const benefits = [
    {
      title: 'Verified Student Network',
      desc: 'Only authenticated students and faculty can browse detailed listings, eliminating scam claims and public exposure.',
      icon: ShieldCheck,
    },
    {
      title: 'Confidential Verification',
      desc: 'Finders specify secret security questions (like lockscreen photos or serial marks). Answers are never exposed publicly.',
      icon: Lock,
    },
    {
      title: 'Algorithmic Smart Matching',
      desc: 'Real-time text & attribute similarity algorithms connect lost notices with found reports in seconds.',
      icon: Sparkles,
    },
    {
      title: 'Security Desk Locker Handovers',
      desc: 'Physical custody is maintained at campus security desks with RFID verification and audit tracking.',
      icon: Building,
    },
  ];

  const testimonials = [
    {
      quote: "Left my MacBook Air in the 2nd-floor library right before midterms. Within 40 minutes, FindIt notified me it was handed over to security desk 2. Reunited the same afternoon!",
      name: "Sneha Raman",
      role: "3rd Year, Computer Science",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote: "I found someone's car keys and wallet outside the sports complex. The private question system allowed me to confirm the owner without sharing my personal phone number.",
      name: "Kabir Malhotra",
      role: "4th Year, Mechanical Eng.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote: "Before FindIt, campus lost items were scattered across random WhatsApp groups. Having a single verified portal with smart matching has drastically reduced lost property cases.",
      name: "Prof. Arvind Joshi",
      role: "Dean of Student Affairs",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const faqs = [
    {
      q: 'How does FindIt prevent fake claims?',
      a: 'When an item is found, the finder sets 2-3 secret verification questions (e.g. "What sticker is on the back?", "What is the lock screen wallpaper?"). Claimants must answer these, and campus security verifies the answers against the item before releasing it.',
    },
    {
      q: 'Is my student ID and phone number exposed to others?',
      a: 'Never. Public listings only display privacy-preserving identifiers like "Verified Student • CS Dept". Phone numbers, student ID numbers, and sensitive details are masked and only accessible to authorized campus security administrators.',
    },
    {
      q: 'Where do I physically pick up or drop off items?',
      a: 'Items can be turned in and picked up at the Central Campus Security Desk in the Admin Tower (Ground Floor) or designated satellite desks at the Library and Sports Complex.',
    },
    {
      q: 'What happens if no owner is found?',
      a: 'Unclaimed items are safely preserved in campus lockers for 60 academic days. After this period, items are processed in accordance with the college student welfare trust protocol.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 overflow-hidden pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Official Campus Lost & Found Network</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Lost Something on Campus?{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Let's Find It.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The secure, student-verified item management and recovery platform. Connect lost belongings with found reports through algorithmic smart matching and confidential claim verification.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/report/lost')}
              icon={HelpCircle}
              className="w-full sm:w-auto shadow-indigo-600/30"
            >
              Report Lost Item
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/items')}
              icon={Compass}
              className="w-full sm:w-auto"
            >
              Explore Found Items
            </Button>
          </div>
        </div>

        {/* 2. Visual Illustration / Mockup Composite */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative">
          <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            {/* Top Bar Decoration */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-semibold text-slate-400">
                  findit.campus.edu/live-recovery-radar
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Campus Network</span>
              </div>
            </div>

            {/* Composite Content: 2 Cards + Match Notification Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lost Item Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <Badge type="lost" label="LOST REPORT" size="sm" />
                  <span className="text-[11px] text-slate-400">Yesterday, 3:45 PM</span>
                </div>
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
                    alt="Laptop"
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Space Gray MacBook Air 13" (M2)
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      Left in Library 2nd Floor quiet reading zone. Has GitHub sticker on lid.
                    </p>
                  </div>
                </div>
              </div>

              {/* Found Item Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <Badge type="found" label="FOUND REPORT" size="sm" />
                  <span className="text-[11px] text-slate-400">Yesterday, 4:30 PM</span>
                </div>
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80"
                    alt="Laptop Found"
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      MacBook Air Turn-in at Security Desk
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      Turned in at Desk #2. Clear protective shell with developer stickers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Match Floating Pill */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span>Smart Match Radar Detected: 96% Match Probability</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      DEMO ALGORITHM
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Matches model, location proximity, and GitHub sticker description tags.
                  </p>
                </div>
              </div>
              <Link
                to="/matches"
                className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-slate-100 transition-colors shrink-0"
              >
                Inspect Match →
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Demo Statistics Banner */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              * Campus Operational Metrics (Sample Demo Data)
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {s.value}
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {s.label}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {s.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works (Four Steps) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Seamless Four-Step Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How FindIt Reunites Campus Belongings
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Designed to guarantee student identity without compromising privacy or introducing security loopholes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                  {st.step}
                </span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${st.color}`}>
                  <st.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Recently Found Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Live Campus Directory
            </h2>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Recently Turned-In Found Items
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              All items verified and cataloged in central campus security lockers.
            </p>
          </div>
          <Link to="/items">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All {items.length} Items
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFoundItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              viewMode="grid"
              onClaim={(selected) => setClaimTargetItem(selected)}
            />
          ))}
        </div>
      </section>

      {/* 6. Campus Benefits */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Engineered for Security
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why Campus Administrators and Students Trust FindIt
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Unlike public social networks or unverified message boards, FindIt embeds strict ownership checks directly into every workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <b.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Student Testimonials (Sample Content Clearly Labeled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            * Sample Demo Student Stories
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
            Reunited on Campus
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Read how verified workflows helped students recover vital items in record time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about campus ownership verification and security protocols.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-extrabold">
              Lost Something Today? Don't Wait.
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Every hour counts. Register your lost item notice or browse today's catalog to reunite with your essentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/report/lost')}
              className="bg-white text-indigo-700 hover:bg-slate-100 shadow-lg w-full sm:w-auto"
            >
              Report an Item Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto"
            >
              Scan Student Card
            </Button>
          </div>
        </div>
      </section>

      {/* Claim Modal instance if triggered from featured cards */}
      {claimTargetItem && (
        <ClaimModal
          isOpen={!!claimTargetItem}
          onClose={() => setClaimTargetItem(null)}
          item={claimTargetItem}
        />
      )}
    </div>
  );
}
