import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Mail, Lock, ArrowRight, Sparkles, Shield, Zap, User as UserIcon } from 'lucide-react'
import api from '../config/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!name.trim()) {
        setError('Name is required.')
        setLoading(false)
        return
      }

      await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password
      })

      setSuccess('Account created!')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #1a1a3e 40%, #0a2440 100%)' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-25 blur-3xl" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Feature badges */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 flex-wrap justify-center px-4">
        {[
          { icon: Zap, text: 'Real-time Transcription' },
          { icon: Shield, text: 'Enterprise Secure' },
          { icon: Sparkles, text: 'AI Summaries' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 border border-white/10 backdrop-blur-sm">
            <Icon size={12} className="text-purple-400" />
            {text}
          </div>
        ))}
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
        <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {/* Card header gradient */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                <Bot size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">IntellMeet</h1>
              <p className="text-sm font-medium" style={{ color: '#A78BFA' }}>Create Your Account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="•••••••• (Min 6 chars)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              {success && (
                <div className="text-emerald-400 text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {success}
                </div>
              )}

              <button
                id="register-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-lg mt-2 cursor-pointer"
                style={{ background: loading ? '#5B21B6' : 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-purple-300 hover:text-white transition-colors underline cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
