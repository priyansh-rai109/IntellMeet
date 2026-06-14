import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Video,
  Bot,
  FileText,
  CheckSquare,
  BarChart3,
  Shield,
  Play,
  ChevronRight,
  ArrowRight,
  Zap,
  Star,
  Menu,
  X,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Globe,
} from 'lucide-react'

// ─── Intersection Observer hook for scroll reveal ─────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ─── Data ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Video,
    title: 'Real-Time Video Meetings',
    desc: 'Crystal-clear HD video with screen sharing, virtual backgrounds, and breakout rooms.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.15)',
  },
  {
    icon: Bot,
    title: 'AI Transcription',
    desc: 'Automatic real-time transcription with speaker detection and searchable archives.',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.15)',
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    desc: 'GPT-powered meeting summaries delivered instantly after every call — no manual notes.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.15)',
  },
  {
    icon: CheckSquare,
    title: 'Action Item Extraction',
    desc: 'AI automatically detects tasks, assignees and deadlines so nothing falls through the cracks.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track meeting frequency, engagement, task completion rates and team productivity trends.',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.15)',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'JWT authentication, end-to-end encryption, SSO support and SOC 2 compliance.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.15)',
  },
]

const stats = [
  { value: '500+', label: 'Enterprise Teams', icon: Globe },
  { value: '40-60%', label: 'Less Follow-up Time', icon: TrendingUp },
  { value: '99.95%', label: 'Uptime SLA', icon: Zap },
  { value: '10k+', label: 'Meetings Hosted', icon: Users },
]

const steps = [
  {
    step: '01',
    title: 'Start a Meeting',
    desc: 'Create or join a meeting instantly with a single click. Invite team members by email or share a link.',
    icon: Video,
    color: '#7C3AED',
  },
  {
    step: '02',
    title: 'AI Listens & Learns',
    desc: 'Our AI transcribes every word in real-time, identifies speakers, and captures every key decision.',
    icon: Bot,
    color: '#06B6D4',
  },
  {
    step: '03',
    title: 'Get Actionable Insights',
    desc: 'Receive your AI summary, action items, and analytics immediately after the meeting ends.',
    icon: Sparkles,
    color: '#10B981',
  },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO, TechVenture', text: 'IntellMeet cut our follow-up time in half. The AI summaries are incredibly accurate.', rating: 5 },
  { name: 'Marcus Rivera', role: 'VP Operations, ScaleUp Inc', text: 'Finally a meeting tool that actually helps. Action items are auto-detected every time.', rating: 5 },
  { name: 'Priya Nair', role: 'Product Lead, InnovateCo', text: 'The AI transcription is a game-changer. We never miss a detail from any meeting now.', rating: 5 },
]

// ─── Dashboard Mockup ─────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div
      className="relative w-full max-w-lg mx-auto"
      style={{ animation: 'float 6s ease-in-out infinite' }}
    >
      {/* Glow blobs */}
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />

      {/* Main card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'linear-gradient(135deg, rgba(30,27,75,0.95), rgba(15,10,40,0.98))', backdropFilter: 'blur(20px)' }}>

        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
          <div className="flex-1 mx-3 h-5 rounded-full border border-white/10 flex items-center px-3">
            <span className="text-xs text-white/30 font-mono">app.intellmeet.ai/dashboard</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Good Morning, Arjun 👋</div>
              <div className="text-white/40 text-xs mt-0.5">Saturday, June 14, 2026</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              + New Meeting
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Meetings', value: '48', color: '#7C3AED', icon: '📅' },
              { label: 'Tasks Done', value: '124', color: '#06B6D4', icon: '✅' },
              { label: 'AI Time Saved', value: '36h', color: '#10B981', icon: '⚡' },
              { label: 'Team Size', value: '12', color: '#F59E0B', icon: '👥' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 border border-white/5"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="text-xs text-white/40 mb-1">{s.icon} {s.label}</div>
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: s.color }}>↑ this month</div>
              </div>
            ))}
          </div>

          {/* Meeting list preview */}
          <div className="rounded-xl border border-white/5 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="px-3 py-2 border-b border-white/5">
              <span className="text-white/60 text-xs font-semibold">Upcoming Meetings</span>
            </div>
            {[
              { title: 'Q3 Product Roadmap', time: 'Today 2:00 PM', badge: '● LIVE', badgeColor: '#EF4444' },
              { title: 'Sprint Planning', time: 'Tomorrow 10:00 AM', badge: 'SOON', badgeColor: '#F59E0B' },
            ].map((m, i) => (
              <div key={i} className="px-3 py-2.5 flex items-center justify-between border-b border-white/5 last:border-0">
                <div>
                  <div className="text-white text-xs font-semibold">{m.title}</div>
                  <div className="text-white/30 text-xs mt-0.5">{m.time}</div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{ color: m.badgeColor, background: `${m.badgeColor}18` }}>
                  {m.badge}
                </span>
              </div>
            ))}
          </div>

          {/* AI summary preview */}
          <div className="rounded-xl p-3 border border-purple-500/20"
            style={{ background: 'rgba(124,58,237,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs">🤖</span>
              <span className="text-xs font-bold text-purple-300">AI Summary Ready</span>
              <span className="ml-auto text-xs text-purple-400/60">just now</span>
            </div>
            <div className="space-y-1">
              {['Team approved Q3 roadmap with Aug 15 deadline', 'Budget increased 20% for campaign'].map((t, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#A78BFA' }} />
                  <span className="text-xs text-white/50 leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2"
        style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
          <CheckSquare size={12} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">3 tasks extracted</div>
          <div className="text-xs text-slate-400">by AI</div>
        </div>
      </div>

      {/* Floating badge 2 */}
      <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2"
        style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          <Zap size={12} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">36 hrs saved</div>
          <div className="text-xs text-slate-400">this month</div>
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────

function Navbar({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,7,28,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            <Bot size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">IntellMeet</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it Works', id: 'how-it-works' },
            { label: 'Pricing', id: 'cta' },
          ].map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="navbar-signin"
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button
            id="navbar-get-started"
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.03] shadow-lg cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
          >
            <span className="relative z-10">Get Started</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 cursor-pointer"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 space-y-2 border-t border-white/10"
          style={{ background: 'rgba(10,7,28,0.97)', backdropFilter: 'blur(16px)' }}>
          {['features', 'how-it-works', 'cta'].map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer">
              {['Features', 'How it Works', 'Pricing'][i]}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/login')}
              className="flex-1 py-2.5 text-sm font-semibold text-white border border-white/20 rounded-xl cursor-pointer">
              Sign In
            </button>
            <button onClick={() => navigate('/login')}
              className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard', { replace: true })
  }, [navigate])

  const featuresReveal = useScrollReveal()
  const statsReveal = useScrollReveal(0.1)
  const stepsReveal = useScrollReveal()
  const testimonialsReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#060412', color: 'white', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar navigate={navigate} />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #5B21B6, transparent)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div style={{ animation: 'fade-in-up-lg 0.8s ease-out forwards' }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6"
              style={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#A78BFA' }}>
              <Sparkles size={12} />
              AI-Powered Meeting Intelligence
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{ letterSpacing: '-0.03em' }}>
              Meetings That{' '}
              <span style={{
                background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Actually Get
              </span>
              {' '}Things Done
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
              AI-powered video meetings with automatic transcription, smart summaries,
              and action item tracking — so your team can focus on what matters.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                id="hero-start-trial"
                onClick={() => navigate('/register')}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl shadow-purple-900/40 shadow-lg cursor-pointer relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }} />
                <span className="relative">Start Free Trial</span>
                <ArrowRight size={18} className="relative group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="hero-watch-demo"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base border transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
              >
                <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
                  <Play size={12} fill="white" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {['#7C3AED', '#06B6D4', '#10B981', '#F59E0B'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c }}>
                    {['A', 'S', 'M', 'P'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                </div>
                <span className="text-xs text-white/50">Loved by <span className="text-white/80 font-semibold">500+</span> enterprise teams</span>
              </div>
            </div>
          </div>

          {/* Right mockup */}
          <div style={{ animation: 'fade-in-up-lg 0.8s ease-out 0.2s both' }}>
            <DashboardMockup />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, #060412)' }} />
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section ref={statsReveal.ref} className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/8">
              {stats.map(({ value, label, icon: Icon }, i) => (
                <div
                  key={label}
                  className="px-8 py-8 text-center"
                  style={{
                    animation: statsReveal.visible ? `count-up 0.6s ease-out ${i * 0.1}s both` : 'none',
                    opacity: statsReveal.visible ? undefined : 0,
                  }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(124,58,237,0.15)' }}>
                      <Icon size={18} style={{ color: '#A78BFA' }} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    {value}
                  </div>
                  <div className="text-sm text-white/50 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={featuresReveal.ref}
            style={{ animation: featuresReveal.visible ? 'fade-in-up 0.6s ease-out' : 'none', opacity: featuresReveal.visible ? 1 : 0 }}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4"
                style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', color: '#A78BFA' }}>
                <Zap size={11} /> Everything You Need
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
                Built for Modern{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Teams</span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Every feature you need to run efficient, productive meetings — powered by AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
                <div
                  key={title}
                  className="group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    animation: featuresReveal.visible ? `fade-in-up 0.5s ease-out ${i * 0.07}s both` : 'none',
                  }}
                >
                  <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: bg, border: `1px solid ${border}` }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color }}>
                    Learn more <ChevronRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        {/* BG accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-8"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div ref={stepsReveal.ref}>
            <div className="text-center mb-16"
              style={{ animation: stepsReveal.visible ? 'fade-in-up 0.6s ease-out' : 'none', opacity: stepsReveal.visible ? 1 : 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4"
                style={{ borderColor: 'rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.08)', color: '#67E8F9' }}>
                <Clock size={11} /> Simple 3-Step Process
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
                How{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>IntellMeet</span>{' '}Works
              </h2>
              <p className="text-white/50 text-lg max-w-lg mx-auto">
                From start to summary in three effortless steps.
              </p>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.4), transparent)' }} />

              {steps.map(({ step, title, desc, icon: Icon, color }, i) => (
                <div key={step}
                  className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/6 hover:-translate-y-1 transition-all duration-300 group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    animation: stepsReveal.visible ? `fade-in-up 0.55s ease-out ${i * 0.12}s both` : 'none',
                  }}
                >
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-2.5 py-1 rounded-full border"
                    style={{ background: '#060412', borderColor: color, color }}>
                    {step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}>
                    <Icon size={28} style={{ color }} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={testimonialsReveal.ref}>
            <div className="text-center mb-14"
              style={{ animation: testimonialsReveal.visible ? 'fade-in-up 0.6s ease-out' : 'none', opacity: testimonialsReveal.visible ? 1 : 0 }}>
              <h2 className="text-4xl font-black mb-3" style={{ letterSpacing: '-0.02em' }}>
                Loved by{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Teams Everywhere</span>
              </h2>
              <p className="text-white/50">Don't take our word for it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map(({ name, role, text, rating }, i) => (
                <div key={name}
                  className="p-6 rounded-2xl border border-white/6 hover:-translate-y-1 transition-all duration-300 group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    animation: testimonialsReveal.visible ? `fade-in-up 0.5s ease-out ${i * 0.1}s both` : 'none',
                  }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(rating)].map((_, j) => <Star key={j} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{name}</div>
                      <div className="text-xs text-white/40">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────── */}
      <section id="cta" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div ref={ctaReveal.ref}
            style={{ animation: ctaReveal.visible ? 'scale-in 0.6s ease-out' : 'none', opacity: ctaReveal.visible ? 1 : 0 }}
          >
            <div className="relative text-center rounded-3xl overflow-hidden p-16 border border-white/10"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
              {/* BG orbs */}
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />

              {/* Shimmer bar */}
              <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <div className="h-full w-1/3"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    animation: 'shimmer 2.5s ease-in-out infinite',
                  }} />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6"
                  style={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.15)', color: '#A78BFA' }}>
                  <Sparkles size={11} /> Start for Free Today
                </div>
                <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
                  Ready to transform{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>your meetings?</span>
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
                  Join 500+ enterprise teams running smarter meetings with IntellMeet AI.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    id="cta-get-started"
                    onClick={() => navigate('/register')}
                    className="group flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] shadow-2xl cursor-pointer relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-base border border-white/20 text-white/80 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  >
                    Sign In Instead
                  </button>
                </div>

                <p className="mt-5 text-sm text-white/35 flex items-center justify-center gap-1.5">
                  <Shield size={13} />
                  No credit card required · Free forever plan · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold">IntellMeet</div>
                <div className="text-xs text-white/30">AI-Powered Meeting Intelligence</div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {['About', 'Features', 'Privacy', 'Terms', 'Contact'].map(link => (
                <a key={link} href="#"
                  className="text-sm text-white/40 hover:text-white/80 transition-colors">
                  {link}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-xs text-white/25 text-center md:text-right">
              © 2026 IntellMeet.<br />
              <span className="text-white/20">Built for Zidio Development.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
