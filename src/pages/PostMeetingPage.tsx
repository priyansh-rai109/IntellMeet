import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import { toast } from 'react-hot-toast'
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

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH:   { label: 'HIGH',   className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  high:   { label: 'HIGH',   className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  MEDIUM: { label: 'MEDIUM', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  medium: { label: 'MEDIUM', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  LOW:    { label: 'LOW',    className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  low:    { label: 'LOW',    className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
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
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/8 bg-white/[0.04] backdrop-blur-md">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">AI Meeting Analysis</h2>
            <p className="text-blue-200 text-xs">Powered by GPT-3.5 Turbo</p>
          </div>
        </div>
        {result && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Transcript input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="ai-transcript">
            Meeting Transcript
          </label>
          <textarea
            id="ai-transcript"
            rows={6}
            value={transcript}
            onChange={e => { setTranscript(e.target.value); setError(null) }}
            placeholder="Paste your meeting transcript here...&#10;&#10;Example:&#10;Alice: Let's discuss the Q3 roadmap. Bob needs to send the design files by Friday.&#10;Bob: Sure, I'll also prepare the budget breakdown, it's high priority.&#10;Alice: Great. Mark will follow up with the client by next Monday."
            className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm text-gray-300 placeholder-gray-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-mono leading-relaxed bg-white/5"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-500">
              {transcript.trim().length > 0 ? `${transcript.trim().length} characters` : 'Min. 10 characters required'}
            </span>
            {transcript.length > 0 && (
              <button
                type="button"
                onClick={() => setTranscript('')}
                className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                Clear text
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        {/* Analyze button */}
        <button
          id="ai-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || transcript.trim().length < 10}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
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
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Results</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Summary */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5 bg-blue-600/10">
                <Bot size={15} className="text-blue-400" />
                <h3 className="font-bold text-white text-sm">AI Summary</h3>
              </div>
              <div className="p-4 space-y-2.5">
                {summaryLines.length > 0 ? (
                  summaryLines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold bg-blue-600"
                        style={{ fontSize: '10px' }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {line.replace(/^[•\-*]\s*/, '')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
                )}
              </div>
            </div>

            {/* Action Items */}
            {result.actionItems && result.actionItems.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-blue-600/10">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={15} className="text-blue-400" />
                    <h3 className="font-bold text-white text-sm">Extracted Action Items</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400">
                    {result.actionItems.length} item{result.actionItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {result.actionItems.map((item, i) => {
                    const pc = priorityConfig[item.priority] || priorityConfig['MEDIUM']
                    return (
                      <div key={i} className="px-4 py-3.5 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-sm text-white leading-snug flex-1">{item.task}</p>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${pc.className}`}>
                            {pc.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <User size={11} className="text-gray-500" />
                            {item.assignee}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <CalendarDays size={11} className="text-gray-500" />
                            {item.deadline}
                          </span>
                          <span className={`flex items-center gap-1.5 text-xs font-medium`}>
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

  const handleExportPDF = () => {
    window.print()
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/meeting/${currentId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IntellMeet Meeting Summary',
          text: 'Check out this meeting summary',
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0f1a' }}>
      <div className="no-print">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 min-h-screen">
        {/* Style block for glow and print */}
        <style>{`
          .glow-btn-blue {
            transition: all 0.3s ease;
          }
          .glow-btn-blue:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.45);
          }
          @media print {
            .no-print {
              display: none !important;
            }
            main {
              margin-left: 0 !important;
              padding: 0 !important;
            }
          }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 border-b border-white/5 flex items-center justify-between" style={{ background: 'rgba(10, 15, 26, 0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>Meeting Complete</span>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button
              id="export-pdf-btn"
              onClick={handleExportPDF}
              className="no-print flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Download size={14} />
              Export PDF
            </button>
            <button
              id="share-btn"
              onClick={handleShare}
              className="no-print glow-btn-blue flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer bg-blue-600 hover:bg-blue-500"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-4xl mx-auto space-y-6">
          {/* Meeting Header */}
          <div className="border-b border-white/5 pb-4 mb-2">
            <h1 className="text-3xl font-bold text-white mb-2">{meetingData.title} — Meeting Summary</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-500" />
                {meetingData.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-500" />
                Duration: {meetingData.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-500" />
                {meetingData.participantsText}
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-[rgba(59,130,246,0.05)] border border-blue-500/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">🤖 AI Generated Summary</h2>
                <p className="text-xs text-blue-400 mt-0.5">Powered by IntellMeet AI</p>
              </div>
            </div>
            <ul className="space-y-3">
              {meetingData.summary.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white bg-blue-600">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-white/[0.04] border border-white/8 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-blue-400" />
                <h2 className="font-bold text-white text-base">Action Items</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {Object.values(checkedItems).filter(Boolean).length}/{meetingData.actionItems.length} Complete
              </span>
            </div>
            <div className="space-y-1">
              {meetingData.actionItems.map((item, i) => {
                const pc = priorityConfig[item.priority] || priorityConfig['MEDIUM']
                return (
                  <div key={i} className={`p-3 flex items-center gap-4 hover:bg-white/5 rounded-xl transition-all duration-200 ${checkedItems[i] ? 'opacity-60' : ''}`}>
                    <button
                      id={`action-item-${i}`}
                      type="button"
                      onClick={() => toggleItem(i)}
                      className="flex-shrink-0 transition-transform hover:scale-110 cursor-pointer"
                    >
                      {checkedItems[i]
                        ? <CheckSquare size={20} className="text-blue-500" />
                        : <Square size={20} className="text-gray-500 hover:text-white transition-colors" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${checkedItems[i] ? 'line-through text-gray-500' : 'text-white'}`}>
                        {item.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: item.color }}>
                            {item.initials.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-400">{item.assignee}</span>
                        </div>
                        <span className="text-gray-600">·</span>
                        <span className="text-xs text-gray-500">Due: {item.due}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${pc.className}`}>
                      {pc.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <AIAnalysisPanel />

          {/* Transcript Highlights */}
          <div className="bg-white/[0.04] border border-white/8 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <Quote size={18} className="text-blue-400" />
              <h2 className="font-bold text-white text-base">Transcript Highlights</h2>
            </div>
            <div className="space-y-4">
              {meetingData.highlights.map((h, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border-l-3 border-blue-500">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed italic mb-2">"{h.quote}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">— {h.speaker}</span>
                      <span className="text-xs text-slate-500 font-mono">{h.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pb-6 no-print">
            <button
              onClick={() => navigate('/dashboard')}
              className="glow-btn-blue flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all cursor-pointer bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
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
