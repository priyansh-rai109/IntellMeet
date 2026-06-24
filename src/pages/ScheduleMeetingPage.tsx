import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import { toast } from 'react-hot-toast'
import {
  Calendar,
  Clock,
  Users,
  FileText,
  AlignLeft,
  X,
  Loader2,
  Timer,
  ChevronRight,
} from 'lucide-react'

const DURATION_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
]

interface FormData {
  title: string
  date: string
  time: string
  duration: number
  participants: string
  description: string
}

interface FormErrors {
  title?: string
  date?: string
  time?: string
  duration?: string
  participants?: string
}

export default function ScheduleMeetingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const todayStr = new Date().toISOString().split('T')[0]
  const nowTime = new Date().toTimeString().slice(0, 5)

  const [form, setForm] = useState<FormData>({
    title: '',
    date: todayStr,
    time: nowTime,
    duration: 60,
    participants: '',
    description: '',
  })

  function validate(): boolean {
    const errs: FormErrors = {}

    if (!form.title.trim()) errs.title = 'Meeting title is required'
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters'

    if (!form.date) errs.date = 'Date is required'

    if (!form.time) errs.time = 'Time is required'
    else {
      const selectedDT = new Date(`${form.date}T${form.time}`)
      if (selectedDT < new Date()) errs.time = 'Meeting time cannot be in the past'
    }

    if (!form.duration) errs.duration = 'Please select a duration'

    if (form.participants.trim()) {
      const emails = form.participants.split(',').map(e => e.trim()).filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalid = emails.filter(e => !emailRegex.test(e))
      if (invalid.length > 0) {
        errs.participants = `Invalid email(s): ${invalid.join(', ')}`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const participants = form.participants
        .split(',')
        .map(e => e.trim())
        .filter(Boolean)

      const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString()

      await api.post('/meetings', {
        title: form.title.trim(),
        scheduledAt,
        duration: form.duration,
        participants,
        description: form.description.trim(),
      })

      toast.success('Meeting scheduled successfully! Redirecting…')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to schedule meeting. Please try again.'
      setErrors({ title: msg })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof FormData, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0f1a' }}>
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen">
        {/* Style block for glow */}
        <style>{`
          .glow-btn-blue {
            transition: all 0.3s ease;
          }
          .glow-btn-blue:hover {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.45);
          }
        `}</style>

        {/* Header Breadcrumbs */}
        <div
          className="sticky top-0 z-30 px-8 py-5 flex items-center justify-between border-b"
          style={{ background: 'rgba(10, 15, 26, 0.85)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-400">Schedule Meeting</span>
          </div>
        </div>

        <div className="px-8 py-8 max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-3 border border-blue-500/30 text-blue-400 bg-blue-500/10"
            >
              <Calendar size={11} />
              New Meeting
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Schedule a Meeting</h1>
            <p className="text-slate-400 text-sm">Set up your next team meeting with all the details below.</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white/5 border border-white/8 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
              {/* Top Accent Line */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2" htmlFor="meeting-title">
                    <span className="flex items-center gap-2">
                      <FileText size={13} className="text-blue-500" />
                      Meeting Title <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <input
                    id="meeting-title"
                    type="text"
                    placeholder="e.g. Q3 Product Roadmap Review"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:ring-2 ${
                      errors.title
                        ? 'border-red-500/50 focus:ring-red-500/20'
                        : 'border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs font-semibold flex items-center gap-1 text-red-400">
                      <X size={11} /> {errors.title}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2" htmlFor="meeting-date">
                      <span className="flex items-center gap-2">
                        <Calendar size={13} className="text-blue-500" />
                        Date <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <input
                      id="meeting-date"
                      type="date"
                      value={form.date}
                      min={todayStr}
                      onChange={e => handleChange('date', e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm text-white outline-none transition-all duration-200 focus:ring-2 ${
                        errors.date
                          ? 'border-red-500/50 focus:ring-red-500/20'
                          : 'border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                      style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    />
                    {errors.date && (
                      <p className="mt-1.5 text-xs font-semibold flex items-center gap-1 text-red-400">
                        <X size={11} /> {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2" htmlFor="meeting-time">
                      <span className="flex items-center gap-2">
                        <Clock size={13} className="text-blue-500" />
                        Time <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <input
                      id="meeting-time"
                      type="time"
                      value={form.time}
                      onChange={e => handleChange('time', e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm text-white outline-none transition-all duration-200 focus:ring-2 ${
                        errors.time
                          ? 'border-red-500/50 focus:ring-red-500/20'
                          : 'border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                      style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    />
                    {errors.time && (
                      <p className="mt-1.5 text-xs font-semibold flex items-center gap-1 text-red-400">
                        <X size={11} /> {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    <span className="flex items-center gap-2">
                      <Timer size={13} className="text-blue-500" />
                      Duration <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {DURATION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        id={`duration-${opt.value}`}
                        onClick={() => handleChange('duration', opt.value)}
                        className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          form.duration === opt.value
                            ? 'text-white border-blue-600 bg-blue-600'
                            : 'text-slate-400 border-white/10 hover:border-slate-500 hover:text-white bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2" htmlFor="meeting-participants">
                    <span className="flex items-center gap-2">
                      <Users size={13} className="text-blue-500" />
                      Participants
                      <span className="text-[10px] font-normal text-slate-500 lowercase">(comma-separated emails)</span>
                    </span>
                  </label>
                  <input
                    id="meeting-participants"
                    type="text"
                    placeholder="alice@example.com, bob@example.com"
                    value={form.participants}
                    onChange={e => handleChange('participants', e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:ring-2 ${
                      errors.participants
                        ? 'border-red-500/50 focus:ring-red-500/20'
                        : 'border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  />
                  {form.participants.trim() && !errors.participants && (
                    <p className="mt-1.5 text-xs text-slate-500 font-medium">
                      {form.participants.split(',').filter(e => e.trim()).length} participant(s)
                    </p>
                  )}
                  {errors.participants && (
                    <p className="mt-1.5 text-xs font-semibold flex items-center gap-1 text-red-400">
                      <X size={11} /> {errors.participants}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2" htmlFor="meeting-description">
                    <span className="flex items-center gap-2">
                      <AlignLeft size={13} className="text-blue-500" />
                      Description
                      <span className="text-[10px] font-normal text-slate-500 lowercase">(optional)</span>
                    </span>
                  </label>
                  <textarea
                    id="meeting-description"
                    rows={3}
                    placeholder="Share the agenda or any relevant context…"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white/5"
                  />
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 border border-white/10 hover:bg-white/5 transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="schedule-meeting-submit"
                  type="submit"
                  disabled={loading}
                  className="glow-btn-blue flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
                  style={{ background: '#3b82f6' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Scheduling…
                    </>
                  ) : (
                    <>
                      <Calendar size={13} />
                      Schedule Meeting
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Info note */}
          <p className="text-center text-xs text-slate-600 mt-5">
            A calendar invite will be sent to all participants automatically.
          </p>
        </div>
      </main>
    </div>
  )
}
