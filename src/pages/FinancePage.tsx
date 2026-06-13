import React, { useState, useMemo } from 'react';
import { useTodos } from '../context/TodoContext';
import { FINANCE_CATEGORIES } from '../types/finance';
import type { TransactionType } from '../types/finance';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  X, 
  SlidersHorizontal,
  Wallet
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useTodos();
  
  // Estados para filtros
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Estado para Modal de Nova Transação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<string>(FINANCE_CATEGORIES[0]);
  
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState('');

  // Anos disponíveis para filtro (5 anos anteriores e 1 futuro)
  const years = useMemo(() => {
    const arr = [];
    for (let i = currentYear - 4; i <= currentYear + 1; i++) {
      arr.push(i);
    }
    return arr.reverse();
  }, [currentYear]);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  // Filtragem das transações para o mês/ano selecionado
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date + 'T00:00:00');
      const matchesMonth = tDate.getMonth() + 1 === selectedMonth;
      const matchesYear = tDate.getFullYear() === selectedYear;
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      
      return matchesMonth && matchesYear && matchesCategory;
    });
  }, [transactions, selectedMonth, selectedYear, selectedCategory]);

  // Cálculos do Dashboard do período selecionado
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  // Saldo Histórico Geral (Balanço)
  const generalBalance = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return income - expense;
  }, [transactions]);

  // Agrupamento de despesas por categoria no período selecionado
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    const totalExpense = stats.expense || 1; // evitar divisão por 0

    return Object.entries(map)
      .map(([name, val]) => ({
        name,
        value: val,
        percentage: Math.round((val / totalExpense) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, stats.expense]);

  // Alturas dinâmicas para o gráfico de barras + curva
  const chartDimensions = useMemo(() => {
    const maxVal = Math.max(stats.income, stats.expense, Math.abs(stats.balance), 100);
    const scale = (val: number) => Math.min(Math.max((val / maxVal) * 70, 10), 80); // escala entre 10 e 80px
    
    const hIncome = scale(stats.income);
    const hExpense = scale(stats.expense);
    const hBalance = scale(Math.max(stats.balance, 0));

    // Posições Y das barras (SVG cresce de cima para baixo)
    const yIncome = 100 - hIncome;
    const yExpense = 100 - hExpense;
    const yBalance = 100 - hBalance;

    return {
      hIncome,
      hExpense,
      hBalance,
      yIncome,
      yExpense,
      yBalance
    };
  }, [stats]);

  const handleOpenModal = () => {
    setDesc('');
    setAmount('');
    setType('expense');
    setCategory(FINANCE_CATEGORIES[0]);
    setDate(getTodayString());
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      setError('A descrição é obrigatória.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('O valor precisa ser maior que zero.');
      return;
    }
    if (!date) {
      setError('A data é obrigatória.');
      return;
    }

    addTransaction(desc.trim(), numAmount, type, category, date);
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDateReadable = (dateString: string) => {
    const dateObj = new Date(dateString + 'T00:00:00');
    return dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Cores de badges para as categorias financeiras
  const categoryColorStyles: Record<string, string> = {
    Alimentação: 'bg-amber-50 text-amber-700 border-amber-100',
    Transporte: 'bg-blue-50 text-blue-700 border-blue-100',
    Moradia: 'bg-purple-50 text-purple-700 border-purple-100',
    Lazer: 'bg-rose-50 text-rose-700 border-rose-100',
    Educação: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Saúde: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Outros: 'bg-slate-50 text-slate-700 border-slate-100',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Header Info */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Cash Flow <Wallet className="h-6 w-6 text-emerald-500 fill-emerald-50" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Controle financeiro simples e integrado.
          </p>
        </div>
        
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-[#7A91C0] hover:bg-[#687FA9] text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-100/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Nova Transação
        </button>
      </div>

      {/* Grid Dashboard & Finance Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Lado Esquerdo: Card de Resumo do Mês (FLOWFY) e Gráfico de Categorias */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CARD DE RESUMO DO MÊS PREMIUM (Baseado na Imagem) */}
          <div className="bg-[#D0E5D0]/75 rounded-[32px] border border-emerald-200/30 overflow-hidden shadow-md shadow-slate-100/50 flex flex-col">
            
            {/* Cabeçalho do Card (Verde-Pastel com Ilustração) */}
            <div className="px-6 py-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Resumo do Mês</h3>
                <p className="text-xs text-slate-600/80 font-semibold mt-0.5">
                  Faturamento e Despesas
                </p>
              </div>
              
              {/* Ilustração Minimalista de Árvore SVG */}
              <svg width="46" height="46" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-800 opacity-60">
                <line x1="25" y1="42" x2="25" y2="14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M25 8C17 18 17 36 25 38C33 36 33 18 25 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="25" y1="20" x2="29" y2="17" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                <line x1="25" y1="26" x2="21" y2="23" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                <line x1="25" y1="32" x2="30" y2="29" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </div>

            {/* Bloco Branco Inferior (Saldo e Gráfico de Barras + Curva) */}
            <div className="bg-white m-2.5 mt-0 p-5 rounded-[24px] shadow-sm space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balanço</p>
                <h3 className={`text-2xl font-black mt-1 tracking-tight ${generalBalance >= 0 ? 'text-slate-850' : 'text-rose-600'}`}>
                  {formatCurrency(generalBalance)}
                </h3>
              </div>

              {/* Gráfico SVG customizado estilo FLOWFY */}
              <div className="w-full bg-slate-50/30 rounded-2xl p-2.5 border border-slate-100/50">
                <svg viewBox="0 0 260 110" className="w-full overflow-visible">
                  {/* Linhas de grade horizontais discretas */}
                  <line x1="0" y1="25" x2="260" y2="25" stroke="#f1f5f9" stroke-width="1" />
                  <line x1="0" y1="60" x2="260" y2="60" stroke="#f1f5f9" stroke-width="1" />
                  <line x1="0" y1="95" x2="260" y2="95" stroke="#e2e8f0" stroke-width="1.2" />

                  {/* Grupo 1: Receitas (Barras Azuis `#C6DAE8`) */}
                  <rect x="35" y={chartDimensions.yIncome} width="12" height={chartDimensions.hIncome} rx="4" fill="#C6DAE8" />
                  <rect x="49" y={Math.max(chartDimensions.yIncome + 5, 20)} width="12" height={Math.max(chartDimensions.hIncome - 10, 10)} rx="4" fill="#C6DAE8" opacity="0.6" />

                  {/* Grupo 2: Despesas (Barras Verdes `#D0E5D0`) */}
                  <rect x="110" y={chartDimensions.yExpense} width="12" height={chartDimensions.hExpense} rx="4" fill="#D0E5D0" />
                  <rect x="124" y={Math.max(chartDimensions.yExpense + 8, 20)} width="12" height={Math.max(chartDimensions.hExpense - 12, 10)} rx="4" fill="#D0E5D0" opacity="0.6" />

                  {/* Grupo 3: Saldo Projetado (Barras Lilases `#DDD0E5`) */}
                  <rect x="185" y={chartDimensions.yBalance} width="12" height={chartDimensions.hBalance} rx="4" fill="#DDD0E5" />
                  <rect x="199" y={Math.max(chartDimensions.yBalance + 4, 20)} width="12" height={Math.max(chartDimensions.hBalance - 8, 10)} rx="4" fill="#DDD0E5" opacity="0.6" />

                  {/* Linha Curva de Bezier sobreposta em azul-indigo */}
                  <path
                    d={`M 25,${chartDimensions.yIncome + 10} 
                        C 85,${chartDimensions.yIncome - 15} 100,${chartDimensions.yExpense + 5} 145,${chartDimensions.yExpense - 10} 
                        C 175,${chartDimensions.yExpense - 25} 195,${chartDimensions.yBalance - 10} 225,${chartDimensions.yBalance}`}
                    fill="none"
                    stroke="#7A91C0"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>

                {/* Sub-Legendas do Gráfico */}
                <div className="grid grid-cols-3 text-[10px] text-slate-400 font-bold text-center mt-2.5 pb-1 uppercase tracking-wide">
                  <span>Receitas</span>
                  <span>Despesas</span>
                  <span>Saldo Proj.</span>
                </div>
              </div>

              {/* Detalhe de Cores Hex */}
              <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-400 font-semibold border-t border-slate-100 pt-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C6DAE8]" />
                  <span>#C6DAE8</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D0E5D0]" />
                  <span>#D0E5D0</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DDD0E5]" />
                  <span>#DDD0E5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Despesas por Categoria */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-[32px] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              Despesas por Categoria
            </h3>
            
            <div className="space-y-3">
              {expensesByCategory.length > 0 ? (
                expensesByCategory.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-650">{cat.name}</span>
                      <div className="space-x-1.5">
                        <span className="text-slate-400">{formatCurrency(cat.value)}</span>
                        <span className="font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md text-[9px]">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/10">
                      <div
                        className="bg-indigo-400/80 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 font-semibold border-2 border-dashed border-slate-150 rounded-2xl">
                  Nenhuma despesa registrada no período.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Lado Direito: Filtros e Lançamentos Recentes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Caixa de Filtros */}
          <div className="bg-white/85 backdrop-blur-sm border border-slate-100 rounded-[32px] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              Filtros de Período & Categoria
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Mês */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Mês</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#7A91C0] text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ano */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Ano</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#7A91C0] text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoria */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Categoria</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#7A91C0] text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {FINANCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Listagem de Lançamentos Recentes (Design da Imagem) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 px-1 pb-1">
              Transações Recentes ({filteredTransactions.length})
            </h3>

            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const isIncome = t.type === 'income';
                  const catStyle = categoryColorStyles[t.category] || categoryColorStyles.Outros;
                  const initial = t.category ? t.category[0] : 'T';
                  
                  return (
                    <div
                      key={t.id}
                      className="group bg-white border border-slate-150/70 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-slate-100/30 hover:border-slate-250 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar circular sutil como na imagem */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          isIncome 
                            ? 'bg-[#C6DAE8]/40 text-slate-700' 
                            : 'bg-slate-200/50 text-slate-500'
                        }`}>
                          {isIncome ? '$' : initial}
                        </div>

                        {/* Informações da Transação */}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate leading-snug">{t.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${catStyle} opacity-80`}>
                              {t.category.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {formatDateReadable(t.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Valor e Botões */}
                      <div className="flex items-center gap-3.5 ml-3 flex-shrink-0">
                        <span className={`text-sm font-extrabold tracking-tight ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isIncome ? '' : '-'} {formatCurrency(t.amount)}
                        </span>
                        
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-650 hover:bg-rose-50/60 rounded-xl transition-all"
                          aria-label="Excluir transação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white/80 backdrop-blur-sm border border-slate-150 rounded-3xl p-10 text-center shadow-sm flex flex-col items-center justify-center min-h-[220px]">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-3">
                    <TrendingUp className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Sem registros para o período</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Você pode alterar os filtros acima ou registrar uma nova receita/despesa para começar.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal para Adicionar Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Card Modal */}
          <div className="relative bg-white border border-slate-150 rounded-[32px] w-full max-w-md shadow-2xl shadow-slate-900/20 transform transition-all duration-300 scale-100 animate-scale-in">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                Nova Transação Financeira
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3.5 py-2 rounded-2xl text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Tipo da Transação */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Tipo de Transação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-3 px-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      type === 'expense'
                        ? 'bg-rose-50 border-rose-300 text-rose-750 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 text-slate-600'
                    }`}
                  >
                    <TrendingDown className="h-4.5 w-4.5" />
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-3 px-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      type === 'income'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-750 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 text-slate-600'
                    }`}
                  >
                    <TrendingUp className="h-4.5 w-4.5" />
                    Receita
                  </button>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label htmlFor="tx-desc" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Descrição
                </label>
                <input
                  id="tx-desc"
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex: Aluguel, Supermercado, Salário..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200"
                  required
                />
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-2 gap-4">
                {/* Valor */}
                <div className="space-y-1.5">
                  <label htmlFor="tx-amount" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Valor (R$)
                  </label>
                  <input
                    id="tx-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 font-bold"
                    required
                  />
                </div>

                {/* Data */}
                <div className="space-y-1.5">
                  <label htmlFor="tx-date" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Data
                  </label>
                  <input
                    id="tx-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-800 transition-all cursor-pointer font-bold"
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label htmlFor="tx-cat" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Categoria
                </label>
                <select
                  id="tx-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-700 font-bold transition-all cursor-pointer"
                >
                  {FINANCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 text-sm font-bold rounded-2xl transition-all duration-200 active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7A91C0] hover:bg-[#687FA9] text-white text-sm font-bold rounded-2xl shadow-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
