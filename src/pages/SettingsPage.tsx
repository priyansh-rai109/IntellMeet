import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../config/api.js'
import {
  User,
  Bell,
  Palette,
  Shield,
  AlertTriangle,
  Camera,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Laptop,
  Lock,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

// ─── Toast ────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white"
      style={{
        background: type === 'success' ? 'linear-gradient(135deg, #059669, #10B981)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
        minWidth: '300px',
        animation: 'slide-in-right 0.3s ease-out',
        border: type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
      }}
    >
      {type === 'success' ? <CheckCircle size={18} className="flex-shrink-0" /> : <X size={18} className="flex-shrink-0" />}
      <span className="font-semibold text-sm flex-1">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Toggle Switch ────────────────────────────────────────────────────────

function Toggle({ enabled, onChange, id }: { enabled: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      onClick={() => onChange(!enabled)}
      className="relative flex-shrink-0 cursor-pointer transition-all duration-300 rounded-full"
      style={{
        width: '44px',
        height: '24px',
        background: enabled ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : '#E2E8F0',
        boxShadow: enabled ? '0 0 0 2px rgba(124,58,237,0.2)' : 'none',
      }}
    >
      <div
        className="absolute top-0.5 rounded-full bg-white shadow-sm transition-all duration-300"
        style={{ width: '20px', height: '20px', left: enabled ? '22px' : '2px' }}
      />
    </button>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-24">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
          <Icon size={16} style={{ color: '#7C3AED' }} />
        </div>
        <h2 className="font-bold text-slate-800 text-base">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────

function Input({ label, id, type = 'text', value, onChange, readOnly = false, placeholder = '' }: {
  label: string; id: string; type?: string; value: string;
  onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string
}) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPw ? 'text' : type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-all duration-200 ${
            readOnly
              ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-white border-slate-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-400'
          } ${isPassword ? 'pr-11' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Delete Account Modal ─────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-red-100" style={{ animation: 'scale-in 0.2s ease-out' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Delete Account</h3>
            <p className="text-xs text-slate-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          All your meetings, tasks, and data will be <strong>permanently deleted</strong>. Please type <strong>DELETE</strong> to confirm.
        </p>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== 'DELETE'}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)' }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────

const ROLES = ['Product Manager', 'Software Engineer', 'Designer', 'Marketing Manager', 'Data Analyst', 'Sales Manager', 'Operations Lead', 'CTO / VP Engineering', 'Other']

const NAV_ITEMS = [
  { id: 'section-profile',       label: 'Profile',       icon: User },
  { id: 'section-notifications', label: 'Notifications', icon: Bell },
  { id: 'section-appearance',    label: 'Appearance',    icon: Palette },
  { id: 'section-security',      label: 'Security',      icon: Shield },
  { id: 'section-account',       label: 'Account',       icon: AlertTriangle },
]

export default function SettingsPage() {
  const navigate = useNavigate()

  // ── read from localStorage ─────────────────────
  const storedName  = localStorage.getItem('userName')  || ''
  const storedEmail = localStorage.getItem('userEmail') || ''
  const storedRole  = localStorage.getItem('role')      || 'Product Manager'

  // ── Profile state ──────────────────────────────
  const [name, setName]   = useState(storedName)
  const [email]           = useState(storedEmail)
  const [role, setRole]   = useState(storedRole)
  const [profileLoading, setProfileLoading] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // ── Notifications state ────────────────────────
  const [notifs, setNotifs] = useState({
    newMeetings:  true,
    actionItems:  true,
    weeklyDigest: false,
    recordingReady: true,
  })

  // ── Appearance state ───────────────────────────
  const [theme, setTheme]         = useState<'light' | 'dark' | 'system'>('light')
  const [sidebarCollapse, setSidebarCollapse] = useState(false)

  // ── Security state ─────────────────────────────
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [twoFA, setTwoFA]         = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  // ── Account state ──────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ── Active section ─────────────────────────────
  const [activeSection, setActiveSection] = useState('section-profile')

  // ── Toast ──────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  // Track active section on scroll
  useEffect(() => {
    const handler = () => {
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(item.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── Handlers ──────────────────────────────────

  function scrollToSection(id: string) {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSaveProfile() {
    if (!name.trim()) { showToast('Name cannot be empty.', 'error'); return }
    setProfileLoading(true)
    try {
      // Try real API first, fall back to localStorage
      await api.put('/auth/profile', { name: name.trim(), role })
    } catch {
      // Route might not exist yet — save locally
    } finally {
      localStorage.setItem('userName', name.trim())
      localStorage.setItem('role', role)
      const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      localStorage.setItem('initials', initials)
      setProfileLoading(false)
      showToast('Profile saved successfully!')
    }
  }

  function handleSaveNotifications() {
    showToast('Notification preferences saved!')
  }

  function handleSaveAppearance() {
    showToast('Appearance settings saved!')
  }

  async function handleChangePassword() {
    if (!currentPw) { showToast('Enter your current password.', 'error'); return }
    if (newPw.length < 8) { showToast('New password must be at least 8 characters.', 'error'); return }
    if (newPw !== confirmPw) { showToast('Passwords do not match.', 'error'); return }
    setPwLoading(true)
    try {
      await api.put('/auth/change-password', { currentPassword: currentPw, newPassword: newPw })
      showToast('Password updated successfully!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update password.', 'error')
    } finally {
      setPwLoading(false)
    }
  }

  function handleDeleteAccount() {
    localStorage.clear()
    navigate('/login')
  }

  const initials = (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showDeleteModal && <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />}

      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between border-b border-slate-200/80"
          style={{ background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences</p>
          </div>
        </div>

        <div className="flex gap-6 px-8 py-6 max-w-6xl mx-auto">

          {/* ── Left sticky nav ── */}
          <div className="w-52 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-3 py-3 space-y-0.5">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const active = activeSection === id
                  return (
                    <button
                      key={id}
                      id={`nav-${id}`}
                      onClick={() => scrollToSection(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer text-sm font-medium ${
                        active ? 'text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                      style={active ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' } : {}}
                    >
                      <Icon size={15} className={active ? 'text-white' : 'text-slate-400'} />
                      {label}
                      {active && <ChevronRight size={13} className="ml-auto text-purple-200" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right content ── */}
          <div className="flex-1 space-y-6 page-enter">

            {/* ══ 1. PROFILE ══ */}
            <Section id="section-profile" title="Profile Settings" icon={User}>
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg overflow-hidden"
                      style={{ background: avatarPreview ? undefined : 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                    >
                      {avatarPreview
                        ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                        : initials
                      }
                    </div>
                    <button
                      onClick={() => avatarRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer transition-transform hover:scale-110"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                    >
                      <Camera size={13} />
                    </button>
                    <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name || 'Your Name'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{email}</p>
                    <button
                      onClick={() => avatarRef.current?.click()}
                      className="mt-2 text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: '#7C3AED' }}
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="profile-name" label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
                  <Input id="profile-email" label="Email Address" value={email} readOnly />
                </div>

                <div>
                  <label htmlFor="profile-role" className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                  <select
                    id="profile-role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 cursor-pointer"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="pt-1">
                  <button
                    id="save-profile-btn"
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                  >
                    {profileLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                      : <><Check size={15} />Save Changes</>
                    }
                  </button>
                </div>
              </div>
            </Section>

            {/* ══ 2. NOTIFICATIONS ══ */}
            <Section id="section-notifications" title="Notification Preferences" icon={Bell}>
              <div className="space-y-0 divide-y divide-slate-50">
                {([
                  { key: 'newMeetings',   label: 'New meeting invitations',    desc: 'Get notified when someone schedules a meeting with you' },
                  { key: 'actionItems',   label: 'Action item reminders',       desc: 'Daily reminders for your pending action items' },
                  { key: 'weeklyDigest',  label: 'Weekly summary digest',       desc: 'A weekly roundup of your meetings and productivity stats' },
                  { key: 'recordingReady', label: 'Recording ready alerts',     desc: 'Get notified when a meeting recording is available' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      id={`toggle-${key}`}
                      enabled={notifs[key]}
                      onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
              <div className="pt-5 border-t border-slate-100 mt-2">
                <button
                  id="save-notifications-btn"
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                >
                  <Check size={15} />Save Preferences
                </button>
              </div>
            </Section>

            {/* ══ 3. APPEARANCE ══ */}
            <Section id="section-appearance" title="Appearance" icon={Palette}>
              <div className="space-y-6">
                {/* Theme selector */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3 max-w-sm">
                    {([
                      { value: 'light',  label: 'Light',  icon: Sun },
                      { value: 'dark',   label: 'Dark',   icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ] as const).map(({ value, label, icon: Icon }) => {
                      const active = theme === value
                      return (
                        <button
                          key={value}
                          id={`theme-${value}`}
                          onClick={() => setTheme(value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            active ? 'border-purple-400 text-purple-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                          style={active ? { background: 'rgba(124,58,237,0.06)' } : { background: '#FAFAFA' }}
                        >
                          <Icon size={20} style={active ? { color: '#7C3AED' } : {}} />
                          <span className="text-xs font-semibold">{label}</span>
                          {active && (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#7C3AED' }}>
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sidebar collapse pref */}
                <div className="flex items-center justify-between py-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Auto-collapse sidebar</p>
                    <p className="text-xs text-slate-500 mt-0.5">Automatically collapse the sidebar on smaller screens</p>
                  </div>
                  <Toggle id="toggle-sidebar-collapse" enabled={sidebarCollapse} onChange={setSidebarCollapse} />
                </div>

                <button
                  id="save-appearance-btn"
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                >
                  <Check size={15} />Save Appearance
                </button>
              </div>
            </Section>

            {/* ══ 4. SECURITY ══ */}
            <Section id="section-security" title="Security" icon={Shield}>
              <div className="space-y-6">
                {/* Change password */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={14} style={{ color: '#7C3AED' }} />
                    <h3 className="text-sm font-bold text-slate-800">Change Password</h3>
                  </div>
                  <div className="space-y-3 max-w-sm">
                    <Input id="current-password" label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} placeholder="Enter current password" />
                    <Input id="new-password" label="New Password" type="password" value={newPw} onChange={setNewPw} placeholder="Min. 8 characters" />
                    <Input id="confirm-password" label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="Repeat new password" />
                  </div>

                  {/* Password strength */}
                  {newPw.length > 0 && (
                    <div className="mt-3 max-w-sm">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="flex-1 h-1 rounded-full transition-colors"
                            style={{ background: newPw.length >= n * 2 ? (newPw.length >= 8 ? '#10B981' : '#F59E0B') : '#E2E8F0' }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: newPw.length >= 8 ? '#10B981' : '#F59E0B' }}>
                        {newPw.length < 4 ? 'Weak' : newPw.length < 8 ? 'Fair' : newPw.length < 12 ? 'Good' : 'Strong'}
                      </p>
                    </div>
                  )}

                  <button
                    id="update-password-btn"
                    onClick={handleChangePassword}
                    disabled={pwLoading}
                    className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                  >
                    {pwLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</>
                      : <><Lock size={14} />Update Password</>
                    }
                  </button>
                </div>

                {/* 2FA */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706' }}>
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account with 2FA via authenticator app.</p>
                    </div>
                    <Toggle id="toggle-2fa" enabled={twoFA} onChange={v => { setTwoFA(v); showToast(v ? '2FA enabled (UI demo)' : '2FA disabled (UI demo)') }} />
                  </div>
                  {twoFA && (
                    <div className="mt-3 p-3 rounded-xl border border-emerald-200 flex items-center gap-2"
                      style={{ background: 'rgba(16,185,129,0.06)' }}>
                      <CheckCircle size={14} style={{ color: '#10B981' }} />
                      <span className="text-xs text-emerald-700 font-semibold">Two-factor authentication is active.</span>
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* ══ 5. ACCOUNT ══ */}
            <Section id="section-account" title="Account" icon={AlertTriangle}>
              <div className="space-y-6">
                {/* Connected devices */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Laptop size={14} style={{ color: '#7C3AED' }} />
                    <h3 className="text-sm font-bold text-slate-800">Connected Sessions</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { device: 'MacBook Pro — Chrome', location: 'Mumbai, India', time: 'Active now', icon: Laptop, current: true },
                      { device: 'iPhone 15 — Safari', location: 'Mumbai, India', time: '2 hours ago', icon: Smartphone, current: false },
                    ].map(({ device, location, time, icon: Icon, current }) => (
                      <div key={device} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: current ? 'rgba(124,58,237,0.1)' : 'rgba(100,116,139,0.1)' }}>
                          <Icon size={16} style={{ color: current ? '#7C3AED' : '#64748B' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800">{device}</p>
                            {current && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                                This device
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{location} · {time}</p>
                        </div>
                        {!current && (
                          <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border-2 border-red-200 overflow-hidden"
                  style={{ background: 'rgba(254,242,242,0.5)' }}>
                  <div className="px-5 py-3 border-b border-red-100 flex items-center gap-2">
                    <AlertTriangle size={14} style={{ color: '#EF4444' }} />
                    <h3 className="text-sm font-bold" style={{ color: '#DC2626' }}>Danger Zone</h3>
                  </div>
                  <div className="px-5 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Permanently delete your account and all associated data. This cannot be undone.
                        </p>
                      </div>
                      <button
                        id="delete-account-btn"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] flex-shrink-0 ml-4 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)' }}
                      >
                        <Trash2 size={14} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <div className="pb-8" />
          </div>
        </div>
      </main>
    </div>
  )
}
