import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import type { Priority } from '../types/todo';
import { Plus, Calendar, Tag, AlertTriangle } from 'lucide-react';

export const TaskForm: React.FC = () => {
  const { addTodo, categories } = useTodos();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  
  // Define default due date as today
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [dueDate, setDueDate] = useState(getTodayString());
  const [error, setError] = useState('');

  // Set initial category to the first one available
  React.useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }
    setError('');
    addTodo(title.trim(), '', categoryId, priority, dueDate);
    setTitle('');
    // Reset date to today and priority to medium
    setDueDate(getTodayString());
    setPriority('medium');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/50 space-y-4"
    >
      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
        <Plus className="h-5 w-5 text-indigo-600" />
        Nova Tarefa
      </h3>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3.5 py-2 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Título */}
        <div>
          <label htmlFor="task-title" className="sr-only">
            Título da Tarefa
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200"
          />
        </div>

        {/* Linha com Categoria, Prioridade e Data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider px-1">
              <Tag className="h-3 w-3" /> Categoria
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridade */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider px-1">
              <AlertTriangle className="h-3 w-3" /> Prioridade
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Data de Vencimento */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider px-1">
              <Calendar className="h-3 w-3" /> Conclusão
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          Adicionar Tarefa
        </button>
      </div>
    </form>
  );
};
