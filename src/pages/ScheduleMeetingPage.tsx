import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import {
  Calendar,
  Clock,
  Users,
  FileText,
  AlignLeft,
  CheckCircle,
  X,
  Loader2,
  Timer,
  ChevronRight,
} from 'lucide-react'

const DURATION_OPTIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
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

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border border-emerald-200/50 text-white animate-slide-in"
      style={{ background: 'linear-gradient(135deg, #059669, #10B981)', minWidth: '320px' }}
    >
      <CheckCircle size={20} className="flex-shrink-0" />
      <span className="font-semibold text-sm flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
        <X size={16} />
      </button>
    </div>
  )
}

export default function ScheduleMeetingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
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

      setToast('Meeting scheduled successfully! Redirecting…')
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
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div
          className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between border-b border-slate-200/80"
          style={{ background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-semibold">Schedule Meeting</span>
          </div>
        </div>

        <div className="px-8 py-8 max-w-3xl mx-auto page-enter">
          {/* Page Title */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}
            >
              <Calendar size={12} />
              New Meeting
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Schedule a Meeting</h1>
            <p className="text-slate-500 text-sm">Set up your next team meeting with all the details below.</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Top accent */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />

              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="meeting-title">
                    <span className="flex items-center gap-2">
                      <FileText size={14} style={{ color: '#7C3AED' }} />
                      Meeting Title <span style={{ color: '#EF4444' }}>*</span>
                    </span>
                  </label>
                  <input
                    id="meeting-title"
                    type="text"
                    placeholder="e.g. Q3 Product Roadmap Review"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 ${
                      errors.title
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-slate-200 focus:ring-purple-100 focus:border-purple-400'
                    }`}
                    style={{ background: '#FAFAFA' }}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EF4444' }}>
                      <X size={11} /> {errors.title}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="meeting-date">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} style={{ color: '#7C3AED' }} />
                        Date <span style={{ color: '#EF4444' }}>*</span>
                      </span>
                    </label>
                    <input
                      id="meeting-date"
                      type="date"
                      value={form.date}
                      min={todayStr}
                      onChange={e => handleChange('date', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 outline-none transition-all duration-200 focus:ring-2 ${
                        errors.date
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                          : 'border-slate-200 focus:ring-purple-100 focus:border-purple-400'
                      }`}
                      style={{ background: '#FAFAFA' }}
                    />
                    {errors.date && (
                      <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EF4444' }}>
                        <X size={11} /> {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="meeting-time">
                      <span className="flex items-center gap-2">
                        <Clock size={14} style={{ color: '#7C3AED' }} />
                        Time <span style={{ color: '#EF4444' }}>*</span>
                      </span>
                    </label>
                    <input
                      id="meeting-time"
                      type="time"
                      value={form.time}
                      onChange={e => handleChange('time', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 outline-none transition-all duration-200 focus:ring-2 ${
                        errors.time
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                          : 'border-slate-200 focus:ring-purple-100 focus:border-purple-400'
                      }`}
                      style={{ background: '#FAFAFA' }}
                    />
                    {errors.time && (
                      <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EF4444' }}>
                        <X size={11} /> {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Timer size={14} style={{ color: '#7C3AED' }} />
                      Duration <span style={{ color: '#EF4444' }}>*</span>
                    </span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {DURATION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        id={`duration-${opt.value}`}
                        onClick={() => handleChange('duration', opt.value)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          form.duration === opt.value
                            ? 'text-white border-transparent shadow-md'
                            : 'text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600 bg-slate-50'
                        }`}
                        style={
                          form.duration === opt.value
                            ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }
                            : {}
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="meeting-participants">
                    <span className="flex items-center gap-2">
                      <Users size={14} style={{ color: '#7C3AED' }} />
                      Participants
                      <span className="text-xs font-normal text-slate-400">(comma-separated emails)</span>
                    </span>
                  </label>
                  <input
                    id="meeting-participants"
                    type="text"
                    placeholder="alice@example.com, bob@example.com"
                    value={form.participants}
                    onChange={e => handleChange('participants', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 ${
                      errors.participants
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-slate-200 focus:ring-purple-100 focus:border-purple-400'
                    }`}
                    style={{ background: '#FAFAFA' }}
                  />
                  {form.participants.trim() && !errors.participants && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {form.participants.split(',').filter(e => e.trim()).length} participant(s)
                    </p>
                  )}
                  {errors.participants && (
                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EF4444' }}>
                      <X size={11} /> {errors.participants}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="meeting-description">
                    <span className="flex items-center gap-2">
                      <AlignLeft size={14} style={{ color: '#7C3AED' }} />
                      Description
                      <span className="text-xs font-normal text-slate-400">(optional)</span>
                    </span>
                  </label>
                  <textarea
                    id="meeting-description"
                    rows={3}
                    placeholder="Share the agenda or any relevant context…"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 resize-none"
                    style={{ background: '#FAFAFA' }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="schedule-meeting-submit"
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Scheduling…
                    </>
                  ) : (
                    <>
                      <Calendar size={15} />
                      Schedule Meeting
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Info note */}
          <p className="text-center text-xs text-slate-400 mt-5">
            A calendar invite will be sent to all participants automatically.
          </p>
        </div>
      </main>
    </div>
  )
}
