import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
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
} from 'lucide-react'

const actionItems = [
  {
    task: 'Send updated design mockups',
    assignee: 'Rahul Verma',
    initials: 'RV',
    color: '#F59E0B',
    due: 'Jun 13',
    priority: 'HIGH',
    done: false,
  },
  {
    task: 'Prepare Q3 budget breakdown',
    assignee: 'Sneha Patel',
    initials: 'SP',
    color: '#10B981',
    due: 'Jun 14',
    priority: 'MEDIUM',
    done: false,
  },
  {
    task: 'Schedule client demo',
    assignee: 'Priya Mehta',
    initials: 'PM',
    color: '#06B6D4',
    due: 'Jun 15',
    priority: 'HIGH',
    done: false,
  },
  {
    task: 'Update project timeline doc',
    assignee: 'Arjun Sharma',
    initials: 'AS',
    color: '#7C3AED',
    due: 'Jun 16',
    priority: 'LOW',
    done: true,
  },
]

const highlights = [
  { quote: 'We need to finalize the API documentation before the client demo next week.', speaker: 'Arjun Sharma', time: '00:12:34' },
  { quote: 'The budget approval has been confirmed by the finance team.', speaker: 'Sneha Patel', time: '00:38:21' },
  { quote: "Let's move forward with the new design system across all platforms.", speaker: 'Rahul Verma', time: '01:02:15' },
]

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  HIGH: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'HIGH' },
  MEDIUM: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'MEDIUM' },
  LOW: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'LOW' },
}

export default function PostMeetingPage() {
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    actionItems.reduce((acc, item, i) => ({ ...acc, [i]: item.done }), {})
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
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 border"
              style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
            >
              <Download size={14} />
              Export PDF
            </button>
            <button
              id="share-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
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
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Q3 Product Roadmap — Meeting Summary</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                June 11, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Duration: 1h 24m
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                8 Participants
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
                {[
                  'Team agreed to push Q3 launch date to August 15th due to additional feature scope and testing requirements.',
                  'Mobile app redesign approved pending final review from design lead scheduled for June 18th.',
                  'Marketing budget increased by 20% for Q3 campaign — Finance team to process by end of week.',
                  'Weekly syncs moved from Thursdays to Tuesdays at 3 PM starting next week.',
                ].map((point, i) => (
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
                {Object.values(checkedItems).filter(Boolean).length}/{actionItems.length} Complete
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {actionItems.map((item, i) => {
                const pc = priorityConfig[item.priority]
                return (
                  <div key={i} className={`px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors ${checkedItems[i] ? 'opacity-60' : ''}`}>
                    <button
                      id={`action-item-${i}`}
                      onClick={() => toggleItem(i)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
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

          {/* Transcript Highlights */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Quote size={18} style={{ color: '#7C3AED' }} />
              <h2 className="font-bold text-slate-800">Transcript Highlights</h2>
            </div>
            <div className="p-6 space-y-4">
              {highlights.map((h, i) => (
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
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
