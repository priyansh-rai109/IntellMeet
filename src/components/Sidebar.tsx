import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Video,
  CheckSquare,
  BarChart3,
  Settings,
  Bot,
  LogOut,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Video, label: 'Meetings', path: '/meeting/1' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/dashboard' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const userName = localStorage.getItem('userName') || 'Arjun Sharma'
  const role = localStorage.getItem('role') || 'Product Manager'
  const initials = localStorage.getItem('initials') || userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || 'AS'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40" style={{ background: '#1E1B4B' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg leading-none">IntellMeet</span>
          <div className="text-xs mt-0.5" style={{ color: '#A78BFA' }}>AI-Powered</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || (label === 'Dashboard' && location.pathname === '/dashboard')
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-purple-200/70 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' } : {}}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-purple-300/60 group-hover:text-purple-300 transition-colors'} />
              <span className="text-sm">{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-300" />}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer group"
          title="Click to Log Out"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate group-hover:text-red-300 transition-colors">{userName}</div>
            <div className="text-xs text-purple-300/60 truncate group-hover:text-red-400/60 transition-colors">{role}</div>
          </div>
          <LogOut size={14} className="text-purple-300/40 group-hover:text-red-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
