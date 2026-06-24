import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Plus, Tag, CheckCircle2 } from 'lucide-react'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'todo' | 'inprogress' | 'done'

interface Task {
  id: number
  title: string
  assignee: string
  initials: string
  color: string
  priority: Priority
  source: string
  done?: boolean
}

const priorityConfig: Record<Priority, { color: string; bg: string; border: string }> = {
  HIGH: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.3)' },
  MEDIUM: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.3)' },
  LOW: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)' },
}

const initialTasks: Record<Status, Task[]> = {
  todo: [
    { id: 1, title: 'Finalize API documentation', assignee: 'Arjun Sharma', initials: 'AS', color: '#3b82f6', priority: 'HIGH', source: 'Q3 Roadmap' },
    { id: 2, title: 'Update onboarding flow', assignee: 'Priya Mehta', initials: 'PM', color: '#14b8a6', priority: 'MEDIUM', source: 'Client Onboarding' },
  ],
  inprogress: [
    { id: 3, title: 'Send design mockups', assignee: 'Rahul Verma', initials: 'RV', color: '#f59e0b', priority: 'HIGH', source: 'Q3 Roadmap' },
    { id: 4, title: 'Prepare demo environment', assignee: 'Sneha Patel', initials: 'SP', color: '#10b981', priority: 'MEDIUM', source: 'Sprint Planning' },
  ],
  done: [
    { id: 5, title: 'Setup CI/CD pipeline', assignee: 'Arjun Sharma', initials: 'AS', color: '#3b82f6', priority: 'HIGH', source: 'Q3 Roadmap', done: true },
    { id: 6, title: 'User research report', assignee: 'Priya Mehta', initials: 'PM', color: '#14b8a6', priority: 'LOW', source: 'Design Review', done: true },
  ],
}

const columnConfig = {
  todo: {
    label: 'TO DO',
    dotColor: '#94a3b8',
    headerBg: 'rgba(255,255,255,0.03)',
    badgeBg: 'bg-white/10 text-slate-300',
  },
  inprogress: {
    label: 'IN PROGRESS',
    dotColor: '#3b82f6',
    headerBg: 'rgba(59, 130, 246, 0.08)',
    badgeBg: 'bg-blue-500/20 text-blue-400',
  },
  done: {
    label: 'DONE',
    dotColor: '#10b981',
    headerBg: 'rgba(16, 185, 129, 0.08)',
    badgeBg: 'bg-green-500/20 text-green-400',
  },
}

function TaskCard({ task, isDone }: { task: Task; isDone: boolean }) {
  const pc = priorityConfig[task.priority]
  return (
    <div className={`bg-white/5 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-slate-500' : 'text-white'} group-hover:text-blue-400 transition-colors`}>
          {task.title}
        </p>
        {isDone && <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: task.color }}
          >
            {task.initials.charAt(0)}
          </div>
          <span className="text-xs text-slate-400 truncate max-w-24">{task.assignee.split(' ')[0]}</span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
          style={{ color: pc.color, background: pc.bg, borderColor: pc.border }}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-white/5 pt-2">
        <Tag size={10} className="text-slate-500" />
        <span className="text-[10px] text-slate-500 font-medium">{task.source}</span>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [addingTo, setAddingTo] = useState<Status | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = (col: Status) => {
    if (!newTaskTitle.trim()) {
      setAddingTo(null)
      return
    }
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      assignee: 'Arjun Sharma',
      initials: 'AS',
      color: '#3b82f6',
      priority: 'MEDIUM',
      source: 'Manual',
    }
    setTasks(prev => ({ ...prev, [col]: [...prev[col], newTask] }))
    setNewTaskTitle('')
    setAddingTo(null)
  }

  const totalTasks = Object.values(tasks).flat().length
  const doneTasks = tasks.done.length
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

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
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-5 border-b flex items-center justify-between" style={{ background: 'rgba(10, 15, 26, 0.85)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <div>
            <h1 className="text-xl font-bold text-white">Task Board</h1>
            <p className="text-sm text-slate-400 mt-0.5">{doneTasks}/{totalTasks} tasks completed across all meetings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200">
              <div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />
              <span className="text-xs font-semibold">Arjun Sharma</span>
            </div>
            <button
              onClick={() => setAddingTo('todo')}
              className="glow-btn-blue flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:scale-[1.02] shadow-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
            >
              <Plus size={14} />
              New Task
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Progress bar container */}
          <div className="bg-white/5 rounded-2xl border border-white/8 backdrop-blur-md p-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-semibold text-slate-300">Overall Progress</span>
              <span className="text-sm font-bold text-blue-400">{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-750"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                }}
              />
            </div>
            <div className="flex items-center gap-5 mt-4">
              {(Object.entries(tasks) as [Status, Task[]][]).map(([col, colTasks]) => {
                const cfg = columnConfig[col]
                return (
                  <div key={col} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.dotColor }} />
                    <span className="text-xs text-slate-400">{cfg.label}: <strong className="text-slate-200">{colTasks.length}</strong></span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Kanban Board columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(tasks) as [Status, Task[]][]).map(([col, colTasks]) => {
              const cfg = columnConfig[col]
              return (
                <div key={col} className="flex flex-col bg-white/[0.02] border border-white/5 p-4.5 rounded-2xl min-h-[450px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-4" style={{ background: cfg.headerBg }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: cfg.dotColor }} />
                      <span className="text-xs font-bold tracking-wider text-slate-300">
                        {cfg.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cfg.badgeBg}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards Stack */}
                  <div className="flex flex-col gap-3 flex-1 min-h-0">
                    {colTasks.map(task => (
                      <TaskCard key={task.id} task={task} isDone={col === 'done'} />
                    ))}

                    {/* Empty list drop indicator */}
                    {colTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-xl min-h-[120px]">
                        <span className="text-xs text-slate-600">Drop tasks here</span>
                      </div>
                    )}

                    {/* Add task block */}
                    {addingTo === col ? (
                      <div className="bg-[#0d1420] rounded-xl border border-white/10 p-3.5">
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddTask(col)
                            if (e.key === 'Escape') setAddingTo(null)
                          }}
                          placeholder="Task title..."
                          className="w-full text-sm text-slate-200 placeholder-slate-600 bg-transparent outline-none border-b border-slate-800 pb-1.5 mb-2.5 focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTask(col)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer"
                            style={{ background: '#3b82f6' }}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setAddingTo(null)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        id={`add-task-${col}`}
                        onClick={() => setAddingTo(col)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-400 hover:bg-white/5 hover:border-white/10 border border-dashed border-white/5 transition-all duration-200 cursor-pointer"
                      >
                        <Plus size={13} />
                        Add Task
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
