import React from 'react';
import type { Todo } from '../types/todo';
import { useTodos } from '../context/TodoContext';
import { Calendar, Trash2, Edit3, Check } from 'lucide-react';

interface TaskCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ todo, onEdit }) => {
  const { toggleTodo, deleteTodo, categories } = useTodos();

  const category = categories.find((c) => c.id === todo.categoryId) || {
    name: 'Sem Categoria',
    color: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  };

  const priorityColors = {
    high: 'border-l-rose-400 bg-rose-50/10',
    medium: 'border-l-amber-400 bg-amber-50/10',
    low: 'border-l-slate-300 bg-slate-50/10',
  };

  const isOverdue = !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-4 bg-white/70 backdrop-blur-sm border-l-4 border-y border-r border-slate-100 rounded-3xl transition-all duration-300 ${
        todo.completed
          ? 'opacity-60 border-slate-100 shadow-none'
          : `border-slate-150/70 shadow-sm shadow-slate-100/30 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/60 ${
              isOverdue ? 'border-r-rose-100 border-y-rose-50 bg-rose-50/5' : ''
            }`
      } ${priorityColors[todo.priority]}`}
    >
      <div className="space-y-3">
        {/* Top Header: Badge Categoria e Checkbox Circular */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold border transition-all ${category.color} ${category.textColor} ${category.borderColor} opacity-80`}
          >
            {category.name.toUpperCase()}
          </span>

          <button
            onClick={() => toggleTodo(todo.id)}
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              todo.completed
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-50'
                : 'border-slate-300 hover:border-indigo-400 bg-white'
            }`}
            aria-label={todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
          </button>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h4
            className={`text-sm font-bold text-slate-800 break-words leading-snug transition-all ${
              todo.completed ? 'line-through text-slate-450 font-medium' : ''
            }`}
          >
            {todo.title}
          </h4>
          {todo.description && (
            <p className={`text-xs text-slate-500 line-clamp-2 leading-relaxed ${todo.completed ? 'text-slate-450' : ''}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between pt-3 mt-2.5 border-t border-slate-100/50">
        {/* Date and Overdue status */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
              isOverdue ? 'text-rose-500 font-extrabold' : 'text-slate-400'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            {formatDate(todo.dueDate)}
          </span>
          {isOverdue && (
            <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase bg-rose-50 border border-rose-100 text-rose-600 px-1 py-0.5 rounded shadow-sm">
              Atrasado
            </span>
          )}
        </div>

        {/* Actions buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50/60 rounded-xl transition-all"
            aria-label="Editar tarefa"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-all"
            aria-label="Excluir tarefa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
