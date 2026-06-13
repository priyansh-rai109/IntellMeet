import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  Circle,
  PhoneOff,
  Bot,
  Send,
  Users,
  Wifi,
  MoreVertical,
} from 'lucide-react'

interface Participant {
  name: string
  initials: string
  color: string
  status: string | null
}

const meetingsData: Record<string, { title: string; participants: Participant[] }> = {
  '1': {
    title: 'Q3 Product Roadmap',
    participants: [
      { name: 'Priya Mehta', initials: 'PM', color: '#06B6D4', status: null },
      { name: 'Rahul Verma', initials: 'RV', color: '#F59E0B', status: 'MUTED' },
      { name: 'Sneha Patel', initials: 'SP', color: '#10B981', status: null },
      { name: 'Vikram Nair', initials: 'VN', color: '#EF4444', status: 'VIDEO OFF' },
    ]
  },
  '2': {
    title: 'Client Onboarding - TechCorp',
    participants: [
      { name: 'Sarah Jenkins', initials: 'SJ', color: '#7C3AED', status: null },
      { name: 'David Miller', initials: 'DM', color: '#F59E0B', status: 'MUTED' },
      { name: 'Rahul Verma', initials: 'RV', color: '#06B6D4', status: null },
      { name: 'Arjun Sharma', initials: 'AS', color: '#10B981', status: 'VIDEO OFF' },
    ]
  },
  '3': {
    title: 'Sprint Planning Week 12',
    participants: [
      { name: 'Sneha Patel', initials: 'SP', color: '#10B981', status: null },
      { name: 'Priya Mehta', initials: 'PM', color: '#06B6D4', status: 'MUTED' },
      { name: 'Vikram Nair', initials: 'VN', color: '#EF4444', status: null },
      { name: 'Amit Kumar', initials: 'AK', color: '#7C3AED', status: 'VIDEO OFF' },
      { name: 'Rohan Gupta', initials: 'RG', color: '#F59E0B', status: null },
    ]
  }
}

const initialMessages = [
  { id: 1, sender: 'Priya Mehta', initials: 'PM', color: '#06B6D4', text: 'Can we move the deadline to Friday?', isAI: false, time: '2:38 PM' },
  { id: 2, sender: 'Rahul Verma', initials: 'RV', color: '#F59E0B', text: "I'll send the updated designs by EOD", isAI: false, time: '2:39 PM' },
  { id: 3, sender: 'AI Assistant', initials: '🤖', color: '#7C3AED', text: '⚡ Action Item detected: Rahul to send updated designs by EOD', isAI: true, time: '2:39 PM' },
  { id: 4, sender: 'Sneha Patel', initials: 'SP', color: '#10B981', text: 'Sounds good to me! 👍', isAI: false, time: '2:40 PM' },
]

function useTimer(initial = 2537) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function MeetingPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const currentId = id || '1'
  const meetingInfo = meetingsData[currentId] || meetingsData['1']
  const meetingTitle = meetingInfo.title
  const participants = meetingInfo.participants

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [recording, setRecording] = useState(true)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const timer = useTimer()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const newMsg = {
      id: messages.length + 1,
      sender: 'Arjun Sharma',
      initials: 'AS',
      color: '#7C3AED',
      text: input.trim(),
      isAI: false,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D1117' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate('/dashboard')} style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              <Bot size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm cursor-pointer hover:opacity-85" onClick={() => navigate('/dashboard')}>IntellMeet</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-white font-semibold text-sm truncate max-w-48">{meetingTitle}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-mono text-sm font-semibold animate-timer">{timer}</span>
          </div>

          {/* REC badge */}
          {recording && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red" />
              <span className="text-red-400 text-xs font-bold">REC</span>
            </div>
          )}

          {/* AI transcribing badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg animate-pulse-purple" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)' }}>
            <Bot size={12} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-semibold" style={{ color: '#A78BFA' }}>AI is transcribing...</span>
          </div>

          {/* Participant count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Users size={12} className="text-slate-400" />
            <span className="text-white text-xs font-semibold">{participants.length + 1}</span>
          </div>

          <div className="flex items-center gap-1 ml-1">
            <Wifi size={14} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          {/* Main tile */}
          <div className="flex-1 rounded-2xl video-tile flex items-center justify-center relative min-h-0" style={{ border: '2px solid rgba(124,58,237,0.4)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                AS
              </div>
              <div className="text-white font-semibold text-lg">Arjun Sharma</div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)' }}>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Speaking...</span>
              </div>
            </div>

            {/* Corner badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <Mic size={12} className="text-emerald-400" />
              <span className="text-white text-xs">You</span>
            </div>

            <button className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <MoreVertical size={16} className="text-white/50" />
            </button>
          </div>

          {/* Participant tiles */}
          <div className="grid grid-cols-4 gap-3 h-32">
            {participants.map(p => (
              <div key={p.name} className="rounded-xl video-tile flex flex-col items-center justify-center gap-1 relative" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: p.status === 'VIDEO OFF' ? '#374151' : `linear-gradient(135deg, ${p.color}, ${p.color}aa)` }}
                >
                  {p.initials}
                </div>
                <span className="text-white/70 text-xs font-medium truncate px-1 w-full text-center">{p.name.split(' ')[0]}</span>
                {p.status && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{
                    background: p.status === 'MUTED' ? 'rgba(239,68,68,0.2)' : 'rgba(100,116,139,0.3)',
                    color: p.status === 'MUTED' ? '#FCA5A5' : '#94A3B8',
                    fontSize: '9px',
                    fontWeight: 700,
                  }}>
                    {p.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 flex flex-col border-l" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
          {/* Panel Header */}
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Bot size={14} style={{ color: '#A78BFA' }} />
            <span className="text-white text-sm font-semibold">Live Chat & AI Assist</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="animate-slide-in-right">
                {msg.isAI ? (
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm">🤖</span>
                      <span className="text-xs font-bold" style={{ color: '#A78BFA' }}>AI Assistant</span>
                      <span className="text-xs text-slate-600 ml-auto">{msg.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#C4B5FD' }}>{msg.text}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: msg.color }}>
                        {msg.initials.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-white/70">{msg.sender}</span>
                      <span className="text-xs text-slate-600 ml-auto">{msg.time}</span>
                    </div>
                    <div className="ml-7 px-3 py-2 rounded-xl text-xs text-white/80 leading-relaxed" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                id="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl text-xs text-white placeholder-white/25 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button
                type="submit"
                className="p-2 rounded-xl transition-all hover:opacity-80 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
              >
                <Send size={14} className="text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-3 px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
        {[
          {
            id: 'btn-mic', icon: micOn ? Mic : MicOff, label: micOn ? 'Mute' : 'Unmute',
            active: micOn, onClick: () => setMicOn(v => !v),
            activeColor: 'rgba(255,255,255,0.1)', inactiveColor: 'rgba(239,68,68,0.2)',
            activeIcon: micOn ? 'text-white' : 'text-red-400',
          },
          {
            id: 'btn-cam', icon: camOn ? Video : VideoOff, label: camOn ? 'Stop Video' : 'Start Video',
            active: camOn, onClick: () => setCamOn(v => !v),
            activeColor: 'rgba(255,255,255,0.1)', inactiveColor: 'rgba(239,68,68,0.2)',
            activeIcon: camOn ? 'text-white' : 'text-red-400',
          },
          {
            id: 'btn-share', icon: Monitor, label: sharing ? 'Stop Share' : 'Share Screen',
            active: sharing, onClick: () => setSharing(v => !v),
            activeColor: 'rgba(6,182,212,0.2)', inactiveColor: 'rgba(255,255,255,0.1)',
            activeIcon: sharing ? 'text-cyan-400' : 'text-white',
          },
          {
            id: 'btn-hand', icon: Hand, label: handRaised ? 'Lower Hand' : 'Raise Hand',
            active: handRaised, onClick: () => setHandRaised(v => !v),
            activeColor: 'rgba(245,158,11,0.2)', inactiveColor: 'rgba(255,255,255,0.1)',
            activeIcon: handRaised ? 'text-amber-400' : 'text-white',
          },
          {
            id: 'btn-rec', icon: Circle, label: recording ? 'Stop REC' : 'Record',
            active: recording, onClick: () => setRecording(v => !v),
            activeColor: 'rgba(239,68,68,0.2)', inactiveColor: 'rgba(255,255,255,0.1)',
            activeIcon: recording ? 'text-red-400' : 'text-white',
          },
        ].map(({ id, icon: Icon, label, active, onClick, activeColor, inactiveColor, activeIcon }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 min-w-16 cursor-pointer"
            style={{ background: active ? activeColor : inactiveColor }}
          >
            <Icon size={20} className={activeIcon} />
            <span className={`text-xs font-medium ${activeIcon}`}>{label}</span>
          </button>
        ))}

        <div className="w-px h-10 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Leave */}
        <button
          id="btn-leave"
          onClick={() => navigate('/post-meeting/' + currentId)}
          className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <PhoneOff size={20} className="text-red-400" />
          <span className="text-xs font-medium text-red-400">Leave</span>
        </button>
      </div>
    </div>
  )
}
