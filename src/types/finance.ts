export type TransactionType = 'income' | 'expense';

export interface FinanceTransaction {
  id: string;
  userEmail: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // Formato YYYY-MM-DD
  createdAt: string;
}

export const FINANCE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Educação',
  'Saúde',
  'Outros'
] as const;

export type FinanceCategory = typeof FINANCE_CATEGORIES[number];
