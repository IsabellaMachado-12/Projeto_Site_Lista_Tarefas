import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Todo, Category, Priority, ActiveTab } from '../types/todo';
import type { FinanceTransaction } from '../types/finance';
import { supabase } from '../lib/supabase';

interface TodoContextType {
  todos: Todo[];
  categories: Category[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTodo: (title: string, description: string, categoryId: string, priority: Priority, dueDate: string) => void;
  updateTodo: (id: string, title: string, description: string, categoryId: string, priority: Priority, dueDate: string) => Promise<void>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addCategory: (name: string, color: string, textColor: string, borderColor: string) => void;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
  transactions: FinanceTransaction[];
  addTransaction: (description: string, amount: number, type: 'income' | 'expense', category: string, date: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  // Monitor supabase auth state
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
        setTodos([]);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch categories from Supabase
  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar categorias:', error.message);
      return;
    }

    if (data) {
      const mapped: Category[] = data.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        textColor: c.text_color,
        borderColor: c.border_color,
      }));
      setCategories(mapped);
    }
  }, []);

  // Fetch todos from Supabase (filtered by user email)
  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tarefas:', error.message);
      setLoading(false);
      return;
    }

    if (data) {
      const mapped: Todo[] = data.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        completed: t.completed,
        dueDate: t.due_date,
        priority: t.priority as Priority,
        categoryId: t.category_id,
        createdAt: t.created_at,
      }));
      setTodos(mapped);
    }
    setLoading(false);
  }, [user]);

  // Fetch transactions from Supabase
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .eq('user_email', user.email)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error.message);
      return;
    }

    if (data) {
      const mapped: FinanceTransaction[] = data.map((t) => ({
        id: t.id,
        userEmail: t.user_email,
        description: t.description,
        amount: Number(t.amount),
        type: t.type as 'income' | 'expense',
        category: t.category,
        date: t.date,
        createdAt: t.created_at,
      }));
      setTransactions(mapped);
    }
  }, [user]);

  // Load data on mount and when user changes
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTodos();
    fetchTransactions();
  }, [fetchTodos, fetchTransactions]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const loginWithGoogle = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTab('tasks');
    setTodos([]);
    setTransactions([]);
  };

  const addTodo = async (title: string, description: string, categoryId: string, priority: Priority, dueDate: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        title,
        description,
        completed: false,
        due_date: dueDate,
        priority,
        category_id: categoryId,
        user_email: user.email,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error.message);
      return;
    }

    if (data) {
      const newTodo: Todo = {
        id: data.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.due_date,
        priority: data.priority as Priority,
        categoryId: data.category_id,
        createdAt: data.created_at,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }
  };

  const updateTodo = async (
    id: string,
    title: string,
    description: string,
    categoryId: string,
    priority: Priority,
    dueDate: string
  ) => {
    if (!user) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title,
              description,
              categoryId,
              priority,
              dueDate,
            }
          : t
      )
    );

    const { error } = await supabase
      .from('todos')
      .update({
        title,
        description,
        category_id: categoryId,
        priority,
        due_date: dueDate,
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error.message);
      fetchTodos();
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.completed;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    const { error } = await supabase
      .from('todos')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error.message);
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t))
      );
    }
  };

  const deleteTodo = async (id: string) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa:', error.message);
      // Revert on error
      setTodos(previousTodos);
    }
  };

  const addCategory = async (name: string, color: string, textColor: string, borderColor: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        color,
        text_color: textColor,
        border_color: borderColor,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar categoria:', error.message);
      return;
    }

    if (data) {
      const newCategory: Category = {
        id: data.id,
        name: data.name,
        color: data.color,
        textColor: data.text_color,
        borderColor: data.border_color,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const addTransaction = async (
    description: string,
    amount: number,
    type: 'income' | 'expense',
    category: string,
    date: string
  ) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('finance_transactions')
      .insert({
        user_email: user.email,
        description,
        amount,
        type,
        category,
        date,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar transação:', error.message);
      return;
    }

    if (data) {
      const newTransaction: FinanceTransaction = {
        id: data.id,
        userEmail: data.user_email,
        description: data.description,
        amount: Number(data.amount),
        type: data.type as 'income' | 'expense',
        category: data.category,
        date: data.date,
        createdAt: data.created_at,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    const previous = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar transação:', error.message);
      setTransactions(previous);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        addCategory,
        user,
        login,
        signUp,
        loginWithGoogle,
        logout,
        loading,
        transactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos deve ser utilizado dentro de um TodoProvider');
  }
  return context;
};
