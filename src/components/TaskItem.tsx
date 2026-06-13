import React from 'react';
import type { Todo } from '../types/todo';
import { useTodos } from '../context/TodoContext';
import { Trash2, Calendar, Check, AlertTriangle } from 'lucide-react';

interface TaskItemProps {
  todo: Todo;
}

export const TaskItem: React.FC<TaskItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, categories } = useTodos();

  const category = categories.find((c) => c.id === todo.categoryId) || {
    name: 'Sem Categoria',
    color: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  };

  const priorityStyles = {
    high: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      label: 'Alta',
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      label: 'Média',
    },
    low: {
      bg: 'bg-slate-50',
      text: 'text-slate-500',
      border: 'border-slate-150',
      label: 'Baixa',
    },
  };

  const priority = priorityStyles[todo.priority];

  // Format date readable (ex: 11 de Jun, 2026)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      className={`group flex items-start justify-between p-4 bg-white border rounded-2xl transition-all duration-300 ${
        todo.completed
          ? 'opacity-55 border-slate-100 shadow-none'
          : 'border-slate-100/80 shadow-sm shadow-slate-100/30 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/50'
      }`}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Checkbox Customizado */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/20'
          }`}
        >
          {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        {/* Informações da Tarefa */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-bold text-slate-800 break-words leading-snug transition-all ${
              todo.completed ? 'line-through text-slate-400 font-medium' : ''
            }`}
          >
            {todo.title}
          </h4>

          {/* Tags e Meta-dados */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Tag Categoria */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${category.color} ${category.textColor} ${category.borderColor}`}
            >
              {category.name.toUpperCase()}
            </span>

            {/* Tag Prioridade */}
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${priority.bg} ${priority.text} ${priority.border}`}
            >
              {todo.priority === 'high' && <AlertTriangle className="h-2.5 w-2.5" />}
              {priority.label.toUpperCase()}
            </span>

            {/* Data de Vencimento */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
              }`}
            >
              <Calendar className="h-3 w-3 flex-shrink-0" />
              {formatDate(todo.dueDate)}
              {isOverdue && <span className="text-[9px] uppercase tracking-wider bg-rose-50 px-1 py-0.5 rounded font-extrabold border border-rose-100">Atrasado</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Ações da Tarefa */}
      <div className="flex items-center gap-1 ml-3 flex-shrink-0">
        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};
