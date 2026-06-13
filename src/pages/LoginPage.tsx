import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { CheckSquare, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signUp } = useTodos();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Este e-mail já está cadastrado. Tente fazer login.';
    }
    if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
      return 'E-mail ou senha incorretos.';
    }
    if (lower.includes('password should be at least')) {
      return 'A senha deve conter pelo menos 6 caracteres.';
    }
    if (lower.includes('valid email address') || lower.includes('invalid email')) {
      return 'Por favor, insira um e-mail válido.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Por favor, verifique e confirme seu e-mail para poder logar.';
    }
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (isSignUp && !name.trim()) {
      setError('Por favor, insira seu nome completo.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, name);
        if (res.error) {
          setError(translateError(res.error));
        } else {
          setError('Cadastro realizado com sucesso! Você já pode entrar.');
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const res = await login(email, password);
        if (res.error) {
          setError(translateError(res.error));
        }
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 mb-6">
          <CheckSquare className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sua Lista de Tarefas
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Gerencie seu dia de forma simples, moderna e eficiente.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 border border-slate-100 sm:rounded-2xl sm:px-10">
          {/* Seletor de Abas */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isSignUp
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all duration-200 ${
                isSignUp
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className={`px-4 py-3 rounded-xl text-sm border ${
                error.includes('sucesso') || error.includes('realizado')
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignUp}
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: joao@exemplo.com"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <>
                    {isSignUp ? 'Criar minha conta' : 'Entrar no App'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Armazenamento Seguro</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              Seus dados de tarefas são criptografados e sincronizados com a nuvem do Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
