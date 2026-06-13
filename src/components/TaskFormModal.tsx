import React, { useState, useEffect } from 'react';
import { useTodos } from '../context/TodoContext';
import type { Todo, Priority } from '../types/todo';
import { X, Calendar, Tag, Clipboard } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  todoToEdit?: Todo | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  todoToEdit,
}) => {
  const { addTodo, updateTodo, categories } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [dueDate, setDueDate] = useState(getTodayString());
  const [error, setError] = useState('');

  // Se houver um todo para editar, preencher os campos do formulário
  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description || '');
      setCategoryId(todoToEdit.categoryId);
      setPriority(todoToEdit.priority);
      setDueDate(todoToEdit.dueDate);
    } else {
      // Caso contrário, resetar para os valores padrão
      setTitle('');
      setDescription('');
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
      setPriority('medium');
      setDueDate(getTodayString());
    }
    setError('');
  }, [todoToEdit, isOpen, categories]);

  // Garantir que a primeira categoria seja selecionada por padrão se vazia
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome da tarefa é obrigatório.');
      return;
    }
    setError('');

    if (todoToEdit) {
      updateTodo(todoToEdit.id, title.trim(), description.trim(), categoryId, priority, dueDate);
    } else {
      addTodo(title.trim(), description.trim(), categoryId, priority, dueDate);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/20 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-indigo-600" />
            {todoToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-2xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Nome da Tarefa */}
          <div className="space-y-1.5">
            <label htmlFor="modal-task-title" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nome da Tarefa *
            </label>
            <input
              id="modal-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o nome da tarefa..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label htmlFor="modal-task-desc" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              id="modal-task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione alguns detalhes sobre esta tarefa..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 resize-none"
            />
          </div>

          {/* Categoria (Seleção Exclusiva - Radio Buttons Estilizados) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Categoria
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <label
                    key={cat.id}
                    className={`flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                      isSelected
                        ? `${cat.color} ${cat.borderColor} border-2 scale-[1.02] shadow-sm`
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modal-category"
                      value={cat.id}
                      checked={isSelected}
                      onChange={() => setCategoryId(cat.id)}
                      className="sr-only"
                    />
                    <Tag className={`h-4 w-4 mb-1.5 ${isSelected ? cat.textColor : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-extrabold ${isSelected ? cat.textColor : 'text-slate-600'}`}>
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Prioridade e Prazo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prioridade */}
            <div className="space-y-1.5">
              <label htmlFor="modal-task-priority" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Prioridade
              </label>
              <select
                id="modal-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-slate-700 transition-all cursor-pointer"
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            {/* Data de Vencimento */}
            <div className="space-y-1.5">
              <label htmlFor="modal-task-due" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Prazo de Conclusão
              </label>
              <div className="relative">
                <input
                  id="modal-task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-slate-700 transition-all cursor-pointer"
                />
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 text-sm font-bold rounded-2xl transition-all duration-200 active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-indigo-100 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98]"
            >
              {todoToEdit ? 'Salvar Alterações' : 'Salvar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
