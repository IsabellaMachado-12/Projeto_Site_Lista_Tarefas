import React from 'react';
import { useTodos } from '../context/TodoContext';
import { Search, SlidersHorizontal, CheckCircle2, Circle, ListTodo } from 'lucide-react';

export const TaskFilters: React.FC = () => {
  const { filter, setFilter, searchQuery, setSearchQuery, todos } = useTodos();

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filters = [
    { id: 'all' as const, label: 'Todas', icon: ListTodo, count: total },
    { id: 'pending' as const, label: 'Pendentes', icon: Circle, count: pending },
    { id: 'completed' as const, label: 'Concluídas', icon: CheckCircle2, count: completed },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/50 space-y-5">
      {/* Busca */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar tarefas..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200"
        />
      </div>

      {/* Progresso Rápido */}
      {total > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Progresso Diário</span>
            <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {completed} de {total} tarefas concluídas
          </p>
        </div>
      )}

      {/* Botões de Filtro */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider px-1">
          <SlidersHorizontal className="h-3 w-3" /> Filtrar Status
        </span>
        <div className="flex flex-col gap-1.5">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {f.label}
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-indigo-200/40 text-indigo-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
