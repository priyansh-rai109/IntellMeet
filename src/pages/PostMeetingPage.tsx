import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import {
  Bot,
  Download,
  Share2,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  Square,
  ChevronLeft,
  Quote,
  AlertCircle,
  Sparkles,
  Loader2,
  X,
  ClipboardList,
  User,
  CalendarDays,
  Flag,
} from 'lucide-react'

interface ActionItem {
  task: string
  assignee: string
  initials: string
  color: string
  due: string
  priority: string
  done: boolean
}

// AI response action item shape
interface AIActionItem {
  task: string
  assignee: string
  deadline: string
  priority: string // "high" | "medium" | "low"
}

interface Highlight {
  quote: string
  speaker: string
  time: string
}

interface MeetingData {
  title: string
  date: string
  duration: string
  participantsText: string
  summary: string[]
  actionItems: ActionItem[]
  highlights: Highlight[]
}

const meetingsData: Record<string, MeetingData> = {
  '1': {
    title: 'Q3 Product Roadmap',
    date: 'June 11, 2026',
    duration: '1h 24m',
    participantsText: '8 Participants',
    summary: [
      'Team agreed to push Q3 launch date to August 15th due to additional feature scope and testing requirements.',
      'Mobile app redesign approved pending final review from design lead scheduled for June 18th.',
      'Marketing budget increased by 20% for Q3 campaign — Finance team to process by end of week.',
      'Weekly syncs moved from Thursdays to Tuesdays at 3 PM starting next week.',
    ],
    actionItems: [
      { task: 'Send updated design mockups', assignee: 'Rahul Verma', initials: 'RV', color: '#F59E0B', due: 'Jun 13', priority: 'HIGH', done: false },
      { task: 'Prepare Q3 budget breakdown', assignee: 'Sneha Patel', initials: 'SP', color: '#10B981', due: 'Jun 14', priority: 'MEDIUM', done: false },
      { task: 'Schedule client demo', assignee: 'Priya Mehta', initials: 'PM', color: '#06B6D4', due: 'Jun 15', priority: 'HIGH', done: false },
      { task: 'Update project timeline doc', assignee: 'Arjun Sharma', initials: 'AS', color: '#7C3AED', due: 'Jun 16', priority: 'LOW', done: true },
    ],
    highlights: [
      { quote: 'We need to finalize the API documentation before the client demo next week.', speaker: 'Arjun Sharma', time: '00:12:34' },
      { quote: 'The budget approval has been confirmed by the finance team.', speaker: 'Sneha Patel', time: '00:38:21' },
      { quote: "Let's move forward with the new design system across all platforms.", speaker: 'Rahul Verma', time: '01:02:15' },
    ]
  },
  '2': {
    title: 'Client Onboarding - TechCorp',
    date: 'June 12, 2026',
    duration: '45m',
    participantsText: '5 Participants',
    summary: [
      'Reviewed TechCorp onboarding checklist and successfully configured their initial sandbox environment.',
      'Identified custom SSO configuration requirements for their enterprise domain integration.',
      'Set up training sessions for the TechCorp administrator team next Tuesday.',
      'Assigned dedicated account manager to handle their migration phase.',
    ],
    actionItems: [
      { task: 'Provide custom SSO configuration guide', assignee: 'Rahul Verma', initials: 'RV', color: '#F59E0B', due: 'Jun 15', priority: 'HIGH', done: false },
      { task: 'Follow up on signed SLA agreement', assignee: 'Sarah Jenkins', initials: 'SJ', color: '#7C3AED', due: 'Jun 16', priority: 'MEDIUM', done: false },
      { task: 'Schedule training session for admins', assignee: 'David Miller', initials: 'DM', color: '#06B6D4', due: 'Jun 14', priority: 'HIGH', done: true },
      { task: 'Create TechCorp support Slack channel', assignee: 'Arjun Sharma', initials: 'AS', color: '#10B981', due: 'Jun 13', priority: 'LOW', done: true },
    ],
    highlights: [
      { quote: 'We want to ensure our login flows are completely secured with SAML SSO.', speaker: 'Sarah Jenkins', time: '00:08:15' },
      { quote: 'Our migration needs to be completed before the end of the month.', speaker: 'David Miller', time: '00:22:40' },
    ]
  },
  '3': {
    title: 'Sprint Planning Week 12',
    date: 'June 13, 2026',
    duration: '1h 05m',
    participantsText: '12 Participants',
    summary: [
      'Reviewed sprint velocity and finalized commitment for Sprint 12 target scope.',
      'Identified backend API blocking issues for the task board and resolved assignees.',
      'Committed to resolving 5 high-priority bugs in the authentication middleware.',
      'Scheduled mid-sprint review for Friday morning.',
    ],
    actionItems: [
      { task: 'Fix authentication middleware validation', assignee: 'Sneha Patel', initials: 'SP', color: '#10B981', due: 'Jun 18', priority: 'HIGH', done: false },
      { task: 'Implement drag-and-drop on task board', assignee: 'Priya Mehta', initials: 'PM', color: '#06B6D4', due: 'Jun 19', priority: 'HIGH', done: false },
      { task: 'Update staging environment configurations', assignee: 'Vikram Nair', initials: 'VN', color: '#EF4444', due: 'Jun 15', priority: 'MEDIUM', done: true },
      { task: 'Write unit tests for task API endpoint', assignee: 'Amit Kumar', initials: 'AK', color: '#7C3AED', due: 'Jun 16', priority: 'LOW', done: true },
    ],
    highlights: [
      { quote: 'We must focus on stabilization this sprint to resolve the memory leak issues.', speaker: 'Sneha Patel', time: '00:05:10' },
      { quote: 'The drag-and-drop feature needs to feel extremely smooth and premium.', speaker: 'Priya Mehta', time: '00:18:45' },
    ]
  }
}

const priorityConfig: Record<string, { color: string; bg: string; label: string; dot: string }> = {
  HIGH:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'HIGH',   dot: '#EF4444' },
  high:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'HIGH',   dot: '#EF4444' },
  MEDIUM: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'MEDIUM', dot: '#F59E0B' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'MEDIUM', dot: '#F59E0B' },
  LOW:    { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'LOW',    dot: '#10B981' },
  low:    { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'LOW',    dot: '#10B981' },
}

// ─── AI Analysis Panel ──────────────────────────────────────────────────────

interface AIResult {
  summary: string
  actionItems: AIActionItem[]
}

function AIAnalysisPanel() {
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!transcript.trim() || transcript.trim().length < 10) {
      setError('Please paste a transcript with at least 10 characters.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await api.post('/ai/analyze', { transcript })
      setResult(res.data)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        'Failed to connect to AI service. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setTranscript('')
    setResult(null)
    setError(null)
  }

  const summaryLines = result?.summary
    ? result.summary.split('\n').filter(l => l.trim())
    : []

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(#F8FAFC, #F8FAFC), linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">AI Meeting Analysis</h2>
            <p className="text-purple-200 text-xs">Powered by GPT-3.5 Turbo</p>
          </div>
        </div>
        {result && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="p-6 space-y-4 bg-white">
        {/* Transcript input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="ai-transcript">
            Meeting Transcript
          </label>
          <textarea
            id="ai-transcript"
            rows={6}
            value={transcript}
            onChange={e => { setTranscript(e.target.value); setError(null) }}
            placeholder="Paste your meeting transcript here...&#10;&#10;Example:&#10;Alice: Let's discuss the Q3 roadmap. Bob needs to send the design files by Friday.&#10;Bob: Sure, I'll also prepare the budget breakdown, it's high priority.&#10;Alice: Great. Mark will follow up with the client by next Monday."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 resize-none font-mono leading-relaxed"
            style={{ background: '#FAFAFA' }}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-slate-400">
              {transcript.trim().length > 0 ? `${transcript.trim().length} characters` : 'Min. 10 characters required'}
            </span>
            {transcript.length > 0 && (
              <button
                onClick={() => setTranscript('')}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Clear text
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</p>
          </div>
        )}

        {/* Analyze button */}
        <button
          id="ai-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || transcript.trim().length < 10}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              AI is analyzing…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze with AI
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-5 pt-2">
            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Results</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Summary */}
            <div className="rounded-xl overflow-hidden border border-slate-100">
              <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100" style={{ background: 'rgba(124,58,237,0.04)' }}>
                <Bot size={15} style={{ color: '#7C3AED' }} />
                <h3 className="font-bold text-slate-800 text-sm">AI Summary</h3>
              </div>
              <div className="p-4 space-y-2.5">
                {summaryLines.length > 0 ? (
                  summaryLines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontSize: '10px' }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {line.replace(/^[•\-*]\s*/, '')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
                )}
              </div>
            </div>

            {/* Action Items */}
            {result.actionItems && result.actionItems.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100" style={{ background: 'rgba(124,58,237,0.04)' }}>
                  <div className="flex items-center gap-2">
                    <ClipboardList size={15} style={{ color: '#7C3AED' }} />
                    <h3 className="font-bold text-slate-800 text-sm">Extracted Action Items</h3>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}
                  >
                    {result.actionItems.length} item{result.actionItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {result.actionItems.map((item, i) => {
                    const pc = priorityConfig[item.priority] || priorityConfig['MEDIUM']
                    return (
                      <div key={i} className="px-4 py-3.5 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-sm text-slate-800 leading-snug flex-1">{item.task}</p>
                          <span
                            className="px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0"
                            style={{ color: pc.color, background: pc.bg }}
                          >
                            {pc.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <User size={11} />
                            {item.assignee}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarDays size={11} />
                            {item.deadline}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: pc.color }}>
                            <Flag size={11} />
                            {pc.label} priority
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function PostMeetingPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const currentId = id || '1'
  const meetingData = meetingsData[currentId] || meetingsData['1']

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    meetingData.actionItems.reduce((acc, item, i) => ({ ...acc, [i]: item.done }), {})
  )

  const toggleItem = (i: number) => {
    setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 border-b border-slate-200/80 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-xs text-slate-500 font-medium">Meeting Complete</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="export-pdf-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-85 border cursor-pointer"
              style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
            >
              <Download size={14} />
              Export PDF
            </button>
            <button
              id="share-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-4xl mx-auto space-y-6 page-enter">
          {/* Meeting Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{meetingData.title} — Meeting Summary</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {meetingData.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Duration: {meetingData.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {meetingData.participantsText}
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #7C3AED, #06B6D4)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">🤖 AI Generated Summary</h2>
                  <p className="text-xs text-slate-500">Powered by IntellMeet AI</p>
                </div>
              </div>
              <ul className="space-y-3">
                {meetingData.summary.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontSize: '10px' }}>
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} style={{ color: '#7C3AED' }} />
                <h2 className="font-bold text-slate-800">Action Items</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                {Object.values(checkedItems).filter(Boolean).length}/{meetingData.actionItems.length} Complete
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {meetingData.actionItems.map((item, i) => {
                const pc = priorityConfig[item.priority] || priorityConfig['MEDIUM']
                return (
                  <div key={i} className={`px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors ${checkedItems[i] ? 'opacity-60' : ''}`}>
                    <button
                      id={`action-item-${i}`}
                      onClick={() => toggleItem(i)}
                      className="flex-shrink-0 transition-transform hover:scale-110 cursor-pointer"
                    >
                      {checkedItems[i]
                        ? <CheckSquare size={20} style={{ color: '#7C3AED' }} />
                        : <Square size={20} className="text-slate-300" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${checkedItems[i] ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {item.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: item.color }}>
                            {item.initials.charAt(0)}
                          </div>
                          <span className="text-xs text-slate-500">{item.assignee}</span>
                        </div>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">Due: {item.due}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0" style={{ color: pc.color, background: pc.bg }}>
                      {pc.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ─── AI Analysis Panel ─── */}
          <AIAnalysisPanel />

          {/* Transcript Highlights */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Quote size={18} style={{ color: '#7C3AED' }} />
              <h2 className="font-bold text-slate-800">Transcript Highlights</h2>
            </div>
            <div className="p-6 space-y-4">
              {meetingData.highlights.map((h, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors" style={{ borderLeft: '3px solid #7C3AED' }}>
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#A78BFA' }} />
                  <div>
                    <p className="text-sm text-slate-700 leading-relaxed italic mb-2">"{h.quote}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600">— {h.speaker}</span>
                      <span className="text-xs text-slate-400 font-mono">{h.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
