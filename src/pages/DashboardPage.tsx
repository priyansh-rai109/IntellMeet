import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import {
  Plus,
  Users,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  ChevronRight,
  Play,
  Bot,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

const statCards = [
  {
    label: 'Total Meetings',
    value: '48',
    change: '↑12% this month',
    positive: true,
    icon: Calendar,
    color: '#7C3AED',
    bg: 'from-purple-50 to-purple-100/50',
  },
  {
    label: 'Tasks Completed',
    value: '124',
    change: '↑8% this month',
    positive: true,
    icon: TrendingUp,
    color: '#06B6D4',
    bg: 'from-cyan-50 to-cyan-100/50',
  },
  {
    label: 'AI Time Saved',
    value: '36 hrs',
    change: '↑23% this month',
    positive: true,
    icon: Zap,
    color: '#10B981',
    bg: 'from-emerald-50 to-emerald-100/50',
  },
  {
    label: 'Team Members',
    value: '12',
    change: 'Active',
    positive: true,
    icon: Users,
    color: '#F59E0B',
    bg: 'from-amber-50 to-amber-100/50',
  },
]

const summaryPoints = [
  'Team agreed to push Q3 launch date to August 15th due to additional feature scope',
  'Mobile app redesign approved with final review scheduled for next Wednesday',
  'Marketing budget increased by 20% to support Q3 campaign launch across all channels',
]

interface Meeting {
  _id: string
  title: string
  scheduledAt: string
  duration?: number
  participants?: string[]
  status?: string
}

function getMeetingStatus(scheduledAt: string, duration = 60) {
  const now = new Date()
  const start = new Date(scheduledAt)
  const end = new Date(start.getTime() + duration * 60 * 1000)

  if (now >= start && now <= end) return 'LIVE'
  if (now < start) return 'UPCOMING'
  return 'PAST'
}

function formatMeetingTime(scheduledAt: string) {
  const date = new Date(scheduledAt)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isToday = date.toDateString() === today.toDateString()
  const isTomorrow = date.toDateString() === tomorrow.toDateString()

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (isToday) return `Today ${timeStr}`
  if (isTomorrow) return `Tomorrow ${timeStr}`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` ${timeStr}`
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    LIVE: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: '● LIVE' },
    UPCOMING: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'UPCOMING' },
    PAST: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', label: 'PAST' },
  }[status] ?? { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: status }

  return (
    <span
      className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide"
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const userName = localStorage.getItem('userName') || 'User'
  const firstName = userName.split(' ')[0]

  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(true)
  const [meetingsError, setMeetingsError] = useState<string | null>(null)

  const fetchMeetings = useCallback(async () => {
    setMeetingsLoading(true)
    setMeetingsError(null)
    try {
      const res = await api.get('/meetings')
      // Support both array response and { meetings: [] }
      const data = Array.isArray(res.data) ? res.data : res.data?.meetings ?? []
      setMeetings(data)
    } catch (err: any) {
      setMeetingsError('Could not load meetings.')
    } finally {
      setMeetingsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div
          className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between border-b border-slate-200/80"
          style={{ background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)' }}
        >
          <div>
            <h1 className="text-xl font-bold text-slate-800">Good Morning, {firstName} 👋</h1>
            <p className="text-sm text-slate-500 mt-0.5">{today}</p>
          </div>
          <button
            id="new-meeting-btn"
            onClick={() => navigate('/schedule-meeting')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
          >
            <Plus size={16} />
            New Meeting
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 page-enter">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map(({ label, value, change, icon: Icon, color, bg }, i) => (
              <div
                key={label}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${bg}`}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ArrowUpRight size={12} />
                    <span>{change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Meetings Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-800 text-base">Upcoming Meetings</h2>
                <div className="flex items-center gap-2">
                  <button
                    id="refresh-meetings-btn"
                    onClick={fetchMeetings}
                    disabled={meetingsLoading}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw size={13} className={meetingsLoading ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={() => navigate('/schedule-meeting')}
                    className="text-xs font-semibold hover:opacity-70 transition-opacity cursor-pointer"
                    style={{ color: '#7C3AED' }}
                  >
                    + Schedule
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {meetingsLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={24} className="animate-spin" style={{ color: '#7C3AED' }} />
                  <p className="text-sm text-slate-400">Loading meetings…</p>
                </div>
              )}

              {/* Error state */}
              {!meetingsLoading && meetingsError && (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
                  <AlertCircle size={22} style={{ color: '#EF4444' }} />
                  <p className="text-sm text-slate-500">{meetingsError}</p>
                  <button
                    onClick={fetchMeetings}
                    className="text-xs font-semibold px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer"
                    style={{ color: '#7C3AED' }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!meetingsLoading && !meetingsError && meetings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
                  <Calendar size={28} className="text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No meetings scheduled</p>
                  <p className="text-xs text-slate-400">Click "Schedule" above to create your first meeting.</p>
                  <button
                    onClick={() => navigate('/schedule-meeting')}
                    className="mt-1 text-xs font-semibold px-4 py-2 rounded-lg text-white shadow cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                  >
                    Schedule a Meeting
                  </button>
                </div>
              )}

              {/* Meeting list */}
              {!meetingsLoading && !meetingsError && meetings.length > 0 && (
                <div className="divide-y divide-slate-50">
                  {meetings.slice(0, 6).map((m, i) => {
                    const status = getMeetingStatus(m.scheduledAt, m.duration)
                    const isPast = status === 'PAST'
                    const timeStr = formatMeetingTime(m.scheduledAt)
                    const participantCount = m.participants?.length ?? 0

                    return (
                      <div
                        key={m._id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold text-sm truncate ${isPast ? 'text-slate-400' : 'text-slate-800'}`}
                          >
                            {m.title}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={11} />
                              {timeStr}
                            </span>
                            {participantCount > 0 && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Users size={11} />
                                {participantCount} participant{participantCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            {m.duration && (
                              <span className="text-xs text-slate-400">
                                {m.duration >= 60 ? `${m.duration / 60}h` : `${m.duration}m`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <StatusBadge status={status} />
                          <button
                            id={`join-meeting-${i}`}
                            onClick={() => !isPast && navigate(`/meeting/${m._id}`)}
                            disabled={isPast}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 ${
                              isPast
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] cursor-pointer'
                            }`}
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                          >
                            <Play size={10} fill="white" />
                            Join
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* AI Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} style={{ color: '#7C3AED' }} />
                  <h2 className="font-bold text-slate-800 text-sm">Recent AI Summary</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  <span className="font-semibold text-slate-700">Q3 Product Roadmap</span>
                  <span>— Yesterday</span>
                </p>

                <ul className="space-y-3 mb-5">
                  {summaryPoints.map((point, i) => (
                    <li key={i} className="flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#7C3AED' }} />
                      <p className="text-xs text-slate-600 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>

                <button
                  id="view-summary-btn"
                  onClick={() => navigate('/post-meeting/1')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'rgba(124,58,237,0.08)',
                    color: '#7C3AED',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}
                >
                  View Full Summary
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'My Tasks', desc: '3 pending action items', color: '#7C3AED', path: '/tasks' },
              { label: 'Past Meetings', desc: '12 recordings available', color: '#06B6D4', path: '/post-meeting/1' },
              { label: 'Team Analytics', desc: 'View productivity insights', color: '#10B981', path: '/analytics' },
            ].map(({ label, desc, color, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="text-left p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">{label}</span>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                    style={{ color }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
