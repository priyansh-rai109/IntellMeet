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

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  HIGH: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  MEDIUM: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  LOW: { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
}

const initialTasks: Record<Status, Task[]> = {
  todo: [
    { id: 1, title: 'Finalize API documentation', assignee: 'Arjun Sharma', initials: 'AS', color: '#7C3AED', priority: 'HIGH', source: 'Q3 Roadmap' },
    { id: 2, title: 'Update onboarding flow', assignee: 'Priya Mehta', initials: 'PM', color: '#06B6D4', priority: 'MEDIUM', source: 'Client Onboarding' },
  ],
  inprogress: [
    { id: 3, title: 'Send design mockups', assignee: 'Rahul Verma', initials: 'RV', color: '#F59E0B', priority: 'HIGH', source: 'Q3 Roadmap' },
    { id: 4, title: 'Prepare demo environment', assignee: 'Sneha Patel', initials: 'SP', color: '#10B981', priority: 'MEDIUM', source: 'Sprint Planning' },
  ],
  done: [
    { id: 5, title: 'Setup CI/CD pipeline', assignee: 'Arjun Sharma', initials: 'AS', color: '#7C3AED', priority: 'HIGH', source: 'Q3 Roadmap', done: true },
    { id: 6, title: 'User research report', assignee: 'Priya Mehta', initials: 'PM', color: '#06B6D4', priority: 'LOW', source: 'Design Review', done: true },
  ],
}

const columnConfig = {
  todo: {
    label: 'TO DO',
    headerColor: '#64748B',
    headerBg: 'rgba(100,116,139,0.1)',
    accentColor: '#64748B',
    dotColor: '#94A3B8',
  },
  inprogress: {
    label: 'IN PROGRESS',
    headerColor: '#3B82F6',
    headerBg: 'rgba(59,130,246,0.1)',
    accentColor: '#3B82F6',
    dotColor: '#60A5FA',
  },
  done: {
    label: 'DONE',
    headerColor: '#10B981',
    headerBg: 'rgba(16,185,129,0.1)',
    accentColor: '#10B981',
    dotColor: '#34D399',
  },
}

function TaskCard({ task, isDone }: { task: Task; isDone: boolean }) {
  const pc = priorityConfig[task.priority]
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group ${isDone ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'} group-hover:text-purple-700 transition-colors`}>
          {task.title}
        </p>
        {isDone && <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: task.color }}
          >
            {task.initials.charAt(0)}
          </div>
          <span className="text-xs text-slate-500 truncate max-w-24">{task.assignee.split(' ')[0]}</span>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-lg"
          style={{ color: pc.color, background: pc.bg }}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Tag size={10} className="text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">{task.source}</span>
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
      color: '#7C3AED',
      priority: 'MEDIUM',
      source: 'Manual',
    }
    setTasks(prev => ({ ...prev, [col]: [...prev[col], newTask] }))
    setNewTaskTitle('')
    setAddingTo(null)
  }

  const totalTasks = Object.values(tasks).flat().length
  const doneTasks = tasks.done.length

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 border-b border-slate-200/80 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Task Board</h1>
            <p className="text-sm text-slate-500 mt-0.5">{doneTasks}/{totalTasks} tasks completed across all meetings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
              <div className="w-2 h-2 rounded-full" style={{ background: '#7C3AED' }} />
              <span className="text-xs font-medium text-slate-600">Arjun Sharma</span>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
            >
              <Plus size={14} />
              New Task
            </button>
          </div>
        </div>

        <div className="px-8 py-6 page-enter">
          {/* Progress bar */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
              <span className="text-sm font-bold" style={{ color: '#7C3AED' }}>{Math.round((doneTasks / totalTasks) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(doneTasks / totalTasks) * 100}%`,
                  background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-3">
              {(Object.entries(tasks) as [Status, Task[]][]).map(([col, colTasks]) => {
                const cfg = columnConfig[col]
                return (
                  <div key={col} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.dotColor }} />
                    <span className="text-xs text-slate-500">{cfg.label}: <strong className="text-slate-700">{colTasks.length}</strong></span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(tasks) as [Status, Task[]][]).map(([col, colTasks]) => {
              const cfg = columnConfig[col]
              return (
                <div key={col} className="flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3" style={{ background: cfg.headerBg }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.dotColor }} />
                      <span className="text-xs font-bold tracking-wider" style={{ color: cfg.headerColor }}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: cfg.accentColor }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards */}
                  <div className="flex flex-col gap-3 flex-1">
                    {colTasks.map(task => (
                      <TaskCard key={task.id} task={task} isDone={col === 'done'} />
                    ))}

                    {/* Add task input */}
                    {addingTo === col ? (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddTask(col)
                            if (e.key === 'Escape') setAddingTo(null)
                          }}
                          placeholder="Task title..."
                          className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAddTask(col)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                            style={{ background: '#7C3AED' }}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setAddingTo(null)}
                            className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        id={`add-task-${col}`}
                        onClick={() => setAddingTo(col)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm border border-dashed border-slate-200 hover:border-slate-300 transition-all duration-200 group"
                      >
                        <Plus size={14} className="group-hover:text-purple-500 transition-colors" />
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
