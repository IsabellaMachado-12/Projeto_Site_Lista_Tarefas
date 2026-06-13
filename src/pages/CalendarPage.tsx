import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { todos, categories, toggleTodo } = useTodos();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Get first day of the month and total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Get days from the previous month to fill the grid
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from(
    { length: firstDayIndex },
    (_, i) => prevMonthTotalDays - firstDayIndex + i + 1
  );

  // Get current month days
  const currentMonthDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Total grid slots (usually 35 or 42)
  const remainingSlots = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: remainingSlots }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find todos for a specific day
  const getTodosForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return todos.filter((todo) => todo.dueDate === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Calendário de Tarefas <Calendar className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visualize e organize seus prazos de entrega mensalmente.
          </p>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all active:scale-95"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-700 min-w-[120px] text-center uppercase tracking-wider">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all active:scale-95"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid Calendário */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm shadow-slate-100/50">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 grid-rows-6 auto-rows-[120px] divide-x divide-y divide-slate-100">
          {/* Mês anterior */}
          {prevMonthDays.map((day, idx) => (
            <div key={`prev-${idx}`} className="p-2 bg-slate-50/35 text-slate-300 select-none text-xs font-semibold">
              {day}
            </div>
          ))}

          {/* Mês atual */}
          {currentMonthDays.map((day) => {
            const dayTodos = getTodosForDate(day, true);
            const today = isToday(day);

            return (
              <div
                key={`curr-${day}`}
                className={`p-2 flex flex-col gap-1 overflow-hidden transition-all ${
                  today ? 'bg-indigo-50/20' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold flex items-center justify-center h-6 w-6 rounded-lg ${
                      today
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dayTodos.length > 0 && (
                    <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                      {dayTodos.length} {dayTodos.length === 1 ? 'tarefa' : 'tarefas'}
                    </span>
                  )}
                </div>

                {/* Lista de tarefas do dia */}
                <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5 scrollbar-thin">
                  {dayTodos.map((todo) => {
                    const category = categories.find((c) => c.id === todo.categoryId);
                    return (
                      <button
                        key={todo.id}
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-full text-left p-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                          todo.completed
                            ? 'bg-slate-50 border-slate-100 text-slate-400 line-through opacity-70'
                            : `${category?.color || 'bg-slate-50'} ${
                                category?.borderColor || 'border-slate-100'
                              } ${category?.textColor || 'text-slate-700'} border`
                        }`}
                        title={`${todo.title} - Prioridade: ${todo.priority}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            todo.completed
                              ? 'bg-slate-300'
                              : todo.priority === 'high'
                              ? 'bg-rose-500 animate-pulse'
                              : todo.priority === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-indigo-400'
                          }`}
                        />
                        <span className="truncate">{todo.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Mês seguinte */}
          {nextMonthDays.map((day, idx) => (
            <div key={`next-${idx}`} className="p-2 bg-slate-50/35 text-slate-300 select-none text-xs font-semibold">
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
