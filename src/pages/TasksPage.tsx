import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import type { Todo } from '../types/todo';
import { 
  Sparkles, 
  Cloud, 
  Plus, 
  Inbox, 
  Search, 
  ListTodo, 
  Circle, 
  CheckCircle2
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { 
    todos, 
    filter, 
    setFilter, 
    searchQuery, 
    setSearchQuery, 
    loading 
  } = useTodos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

  // Filter tasks based on status and search query
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !todo.completed) ||
      (filter === 'completed' && todo.completed);

    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const lowPriorityTodos = filteredTodos.filter((t) => t.priority === 'low' && !t.completed);
  const mediumPriorityTodos = filteredTodos.filter((t) => t.priority === 'medium' && !t.completed);
  const highPriorityTodos = filteredTodos.filter((t) => t.priority === 'high' && !t.completed);
  const completedTodos = filteredTodos.filter((t) => t.completed);

  const handleEditClick = (todo: Todo) => {
    setTodoToEdit(todo);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setTodoToEdit(null);
    setIsModalOpen(true);
  };

  // Cálculos de progresso diário
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filterButtons = [
    { id: 'all' as const, label: 'Todas', icon: ListTodo, count: totalCount },
    { id: 'pending' as const, label: 'Pendentes', icon: Circle, count: totalCount - completedCount },
    { id: 'completed' as const, label: 'Concluídas', icon: CheckCircle2, count: completedCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Minhas Tarefas <Sparkles className="h-5 w-5 text-indigo-400 fill-indigo-50" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize suas atividades diárias e acompanhe seu rendimento no formato Kanban.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="hidden sm:flex bg-white/60 backdrop-blur-sm px-4 py-2 border border-slate-200/40 rounded-2xl shadow-sm text-xs font-semibold text-slate-500 items-center gap-2">
            <Cloud className="h-3.5 w-3.5 text-emerald-500" />
            Sincronizado
          </div>
          
          <button
            onClick={handleCreateClick}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-[#7A91C0] hover:bg-[#687FA9] text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-100/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Painel de Filtros Horizontal (Estilo Cash Flow) */}
      <div className="bg-white/85 backdrop-blur-sm border border-slate-100 rounded-[32px] p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Campo de Busca (Lado Esquerdo) */}
        <div className="lg:col-span-4 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarefas..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7A91C0]/20 focus:border-[#7A91C0] text-sm text-slate-800 placeholder-slate-400 transition-all duration-200"
          />
        </div>

        {/* Botões de Filtro de Status (Centro) */}
        <div className="lg:col-span-5 flex flex-wrap gap-2">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-150 text-indigo-750 shadow-sm'
                    : 'bg-slate-50/60 border-slate-150 hover:bg-slate-100/50 text-slate-550'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{btn.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                  isActive ? 'bg-indigo-200/40 text-indigo-800' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {btn.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Progresso Rápido (Lado Direito) */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-150 pt-4 lg:pt-0 lg:pl-5 flex flex-col justify-center space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Progresso</span>
            <span className="font-extrabold text-indigo-750 bg-indigo-55/40 px-1.5 py-0.5 rounded-md text-[9px]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/10">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Kanban Layout (Largura Total) */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="bg-white/80 border border-slate-100 rounded-[32px] p-5 space-y-4 min-h-[350px]">
                <div className="h-6 bg-slate-200/60 rounded-xl animate-pulse w-1/2" />
                {[1, 2].map((card) => (
                  <div key={card} className="animate-pulse bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-150 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : filteredTodos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            
            {/* Coluna 🟢 Baixa */}
            <div className="bg-white/85 border border-slate-100 rounded-[32px] p-5 flex flex-col gap-4 min-h-[350px] shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  🟢 Baixa
                </h3>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  {lowPriorityTodos.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {lowPriorityTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={handleEditClick} />
                ))}
                {lowPriorityTodos.length === 0 && (
                  <div className="py-10 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/20">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>

            {/* Coluna 🟡 Média */}
            <div className="bg-white/85 border border-slate-100 rounded-[32px] p-5 flex flex-col gap-4 min-h-[350px] shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  🟡 Média
                </h3>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  {mediumPriorityTodos.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {mediumPriorityTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={handleEditClick} />
                ))}
                {mediumPriorityTodos.length === 0 && (
                  <div className="py-10 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/20">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>

            {/* Coluna 🔴 Alta */}
            <div className="bg-white/85 border border-slate-100 rounded-[32px] p-5 flex flex-col gap-4 min-h-[350px] shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-450 animate-pulse" />
                  🔴 Alta
                </h3>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  {highPriorityTodos.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {highPriorityTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={handleEditClick} />
                ))}
                {highPriorityTodos.length === 0 && (
                  <div className="py-10 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/20">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>

            {/* Coluna ✅ Concluídas */}
            <div className="bg-white/85 border border-slate-100 rounded-[32px] p-5 flex flex-col gap-4 min-h-[350px] shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ✅ Concluídas
                </h3>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  {completedTodos.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {completedTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} onEdit={handleEditClick} />
                ))}
                {completedTodos.length === 0 && (
                  <div className="py-10 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/20">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Estado Vazio Premium */
          <div className="bg-white/85 border border-slate-100 rounded-[32px] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[350px]">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-inner">
              <Inbox className="h-10 w-10 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery
                ? 'Nenhuma tarefa encontrada'
                : filter === 'completed'
                ? 'Nenhuma tarefa concluída ainda'
                : 'Tudo limpo por aqui!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? 'Tente ajustar sua busca ou limpar o campo de digitação.'
                : filter === 'completed'
                ? 'Conclua tarefas no seu painel Kanban para visualizá-las aqui.'
                : 'Organize suas prioridades. Crie uma nova tarefa no botão acima!'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Criação e Edição de Tarefas */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todoToEdit={todoToEdit}
      />
    </div>
  );
};
