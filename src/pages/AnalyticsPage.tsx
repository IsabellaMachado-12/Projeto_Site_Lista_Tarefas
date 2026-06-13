import React from 'react';
import { useTodos } from '../context/TodoContext';
import { BarChart3, CheckCircle2, AlertCircle, Percent, ShieldAlert, Award, TrendingUp } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { todos, categories } = useTodos();

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Tasl overdue calculation
  const overdue = todos.filter((todo) => {
    if (todo.completed) return false;
    if (!todo.dueDate) return false;
    return new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));
  }).length;

  // Category distribution
  const categoryStats = categories.map((cat) => {
    const totalInCat = todos.filter((t) => t.categoryId === cat.id).length;
    const completedInCat = todos.filter((t) => t.categoryId === cat.id && t.completed).length;
    const rate = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0;
    return {
      category: cat,
      count: totalInCat,
      completed: completedInCat,
      rate,
    };
  });

  // Priority distribution
  const priorities = [
    { id: 'high', label: 'Alta', color: 'bg-rose-500', textColor: 'text-rose-700', bgLight: 'bg-rose-50' },
    { id: 'medium', label: 'Média', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' },
    { id: 'low', label: 'Baixa', color: 'bg-slate-400', textColor: 'text-slate-600', bgLight: 'bg-slate-50' },
  ];

  const priorityStats = priorities.map((p) => {
    const count = todos.filter((t) => t.priority === p.id).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      ...p,
      count,
      pct,
    };
  });

  // Productivity level message
  const getProductivityMessage = () => {
    if (total === 0) return 'Nenhuma tarefa cadastrada. Crie tarefas para gerar estatísticas!';
    if (completionRate === 100) return 'Sensacional! Você concluiu 100% de suas metas!';
    if (completionRate >= 70) return 'Excelente ritmo! Continue assim para atingir o topo.';
    if (completionRate >= 40) return 'Bom progresso. Você está no caminho certo para o sucesso.';
    return 'Começo tranquilo. Dedique um tempo para riscar algumas tarefas hoje!';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Análises de Desempenho <BarChart3 className="h-6 w-6 text-indigo-500" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe métricas detalhadas da sua produtividade diária.
        </p>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total de Tarefas */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{total}</p>
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concluídas</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{completed}</p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{pending}</p>
          </div>
        </div>

        {/* Taxa de Conclusão */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conclusão</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos e Distribuições */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Distribuição por Categoria (Col 7) */}
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Tarefas por Categoria
            </h2>
            <span className="text-xs text-slate-400">Total de tarefas</span>
          </div>

          <div className="space-y-5">
            {total > 0 ? (
              categoryStats.map((stat) => (
                <div key={stat.category.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stat.category.color} border ${stat.category.borderColor}`} />
                      <span className="font-bold text-slate-700">{stat.category.name}</span>
                    </div>
                    <span className="font-bold text-slate-500">
                      {stat.completed} / {stat.count} conclúidas ({stat.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${stat.category.color.replace('bg-', 'bg-indigo-')} transition-all duration-500`}
                      style={{
                        width: `${stat.count > 0 ? (stat.completed / stat.count) * 100 : 0}%`,
                        backgroundColor: stat.count > 0 ? undefined : '#e2e8f0'
                      }}
                    />
                    <div
                      className="bg-slate-200 h-full transition-all duration-500"
                      style={{
                        width: `${stat.count > 0 ? ((stat.count - stat.completed) / stat.count) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Nenhuma informação disponível.
              </div>
            )}
          </div>
        </div>

        {/* Distribuição por Prioridade (Col 5) */}
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              Prioridades das Tarefas
            </h2>
            <span className="text-xs text-slate-400">Volume (%)</span>
          </div>

          <div className="space-y-4">
            {total > 0 ? (
              priorityStats.map((stat) => (
                <div key={stat.id} className="flex items-center gap-4">
                  <div className="w-16 text-xs font-bold text-slate-600">{stat.label}</div>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`${stat.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-extrabold text-slate-700">
                    {stat.count} <span className="text-[10px] text-slate-400 font-semibold">({stat.pct}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Nenhuma informação disponível.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights e Conselho de Produtividade */}
      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm flex-shrink-0">
            <Award className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Seu Diagnóstico de Produtividade</h3>
            <p className="text-xs text-slate-500 mt-0.5">Com base no comportamento das suas tarefas ativas.</p>
            <p className="text-sm font-medium text-slate-600 mt-2 italic">
              "{getProductivityMessage()}"
            </p>
          </div>
        </div>

        {/* Métricas Auxiliares */}
        <div className="flex items-center gap-6 divide-x divide-slate-200 w-full md:w-auto justify-around md:justify-end">
          <div className="text-center pl-0 md:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Atrasadas</span>
            <span className={`text-xl font-extrabold block mt-0.5 ${overdue > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {overdue}
            </span>
          </div>
          <div className="text-center pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Eficiência</span>
            <span className="text-xl font-extrabold text-indigo-600 block mt-0.5">
              {completionRate > 0 ? `${Math.round(completionRate * 0.95)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
