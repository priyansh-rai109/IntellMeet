import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {
  BarChart3,
  Clock,
  Calendar,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Award,
  Users
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

// Mock Data for Charts
const meetingsData = [
  { day: 'Mon', meetings: 6 },
  { day: 'Tue', meetings: 9 },
  { day: 'Wed', meetings: 12 },
  { day: 'Thu', meetings: 8 },
  { day: 'Fri', meetings: 7 },
  { day: 'Sat', meetings: 2 },
  { day: 'Sun', meetings: 4 },
]

const timeSavedData = [
  { week: 'Week 1', saved: 6 },
  { week: 'Week 2', saved: 10 },
  { week: 'Week 3', saved: 8 },
  { week: 'Week 4', saved: 12 },
]

const contributors = [
  { name: 'Arjun Sharma', role: 'Product Manager', initials: 'AS', color: '#7C3AED', meetings: 24, tasks: 18, efficiency: '96%' },
  { name: 'Priya Mehta', role: 'Design Lead', initials: 'PM', color: '#06B6D4', meetings: 22, tasks: 14, efficiency: '92%' },
  { name: 'Rahul Verma', role: 'Lead Engineer', initials: 'RV', color: '#F59E0B', meetings: 20, tasks: 12, efficiency: '88%' },
  { name: 'Sneha Patel', role: 'QA Lead', initials: 'SP', color: '#10B981', meetings: 18, tasks: 10, efficiency: '85%' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('This Month')

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between border-b border-slate-200/80" style={{ background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-600" />
              Team Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Real-time productivity insights and meeting metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {['This Week', 'This Month', 'Q2 Roadmap'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  timeRange === range
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                }`}
                style={timeRange === range ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' } : {}}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 space-y-6 page-enter">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Avg Duration Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100/50">
                  <Clock size={18} className="text-purple-600" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={12} />
                  -2m vs last mo
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">45 mins</div>
              <div className="text-sm text-slate-500">Average Meeting Duration</div>
            </div>

            {/* Total Meetings Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100/50">
                  <Calendar size={18} className="text-cyan-600" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={12} />
                  +12% vs last mo
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">48</div>
              <div className="text-sm text-slate-500">Total Meetings This Month</div>
            </div>

            {/* AI Time Saved Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                  <Zap size={18} className="text-emerald-600" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={12} />
                  +23% vs last mo
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">36 hrs</div>
              <div className="text-sm text-slate-500">AI Time Saved</div>
            </div>

            {/* Collaboration Index */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100/50">
                  <TrendingUp size={18} className="text-amber-600" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">94.8%</div>
              <div className="text-sm text-slate-500">Task Completion Rate</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meetings Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Total Meetings (Mon-Sun)</h2>
                  <p className="text-xs text-slate-400">Total frequency distribution across weekdays</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  <BarChart3 size={12} />
                  Distribution
                </div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={meetingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#C4B5FD" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(124, 58, 237, 0.04)' }}
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1E293B', fontSize: 11 }}
                      itemStyle={{ color: '#7C3AED', fontSize: 11 }}
                    />
                    <Bar dataKey="meetings" name="Meetings" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Time Saved Line Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">AI Time Saved (Week 1-4)</h2>
                  <p className="text-xs text-slate-400">Total estimated hours saved by auto-transcriptions</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Zap size={12} />
                  Efficiency Gain
                </div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSavedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1E293B', fontSize: 11 }}
                      itemStyle={{ color: '#06B6D4', fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="saved" name="Hours Saved" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#areaGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Contributors Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Award size={18} className="text-yellow-500" />
                  Top Team Contributors
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Most active team members based on attendance and task completions</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg">
                <Users size={12} className="text-slate-400" />
                Active contributors
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Meetings Attended</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tasks Completed</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Efficiency Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contributors.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ background: c.color }}
                        >
                          {c.initials}
                        </div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.role}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{c.meetings}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{c.tasks}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>
                          {c.efficiency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
