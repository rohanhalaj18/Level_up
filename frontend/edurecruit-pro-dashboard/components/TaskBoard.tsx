
import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, MoreVertical, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review candidates from Stanford', completed: true, priority: 'High' },
    { id: '2', title: 'Schedule Technical interview for Alex', completed: false, priority: 'High' },
    { id: '3', title: 'Follow up with MIT Placement Cell', completed: false, priority: 'Medium' },
    { id: '4', title: 'Draft offer letter for Sarah', completed: false, priority: 'Low' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'Medium'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Recruiter Task Bar</h3>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} Pending
        </span>
      </div>

      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
        />
        <button 
          onClick={addTask}
          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
              task.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTask(task.id)}
                className="transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <Circle size={20} className="text-slate-300 hover:text-emerald-500" />
                )}
              </button>
              <span className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {task.priority}
              </span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
