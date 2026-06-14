import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { Lock, Mail, User, Eye, EyeOff, Bell } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signUp, loginWithGoogle } = useTodos();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.error) {
        setError(translateError(res.error));
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar fazer login com o Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col items-center justify-center p-4 overflow-hidden font-sans select-none">
      {/* ----------------- FORMAS FLUIDAS E ORGÂNICAS DO FUNDO ----------------- */}
      {/* Blob Verde Top Right */}
      <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] bg-[#D0E5D0]/30 rounded-[50%_50%_30%_70%_/_50%_60%_40%_60%] pointer-events-none" />
      
      {/* Blob Verde Top Left */}
      <div className="absolute top-[-50px] left-[-50px] w-[350px] h-[350px] bg-[#D0E5D0]/20 rounded-[60%_40%_60%_40%_/_40%_60%_40%_60%] pointer-events-none" />
      
      {/* Blob Lavanda Center Left */}
      <div className="absolute top-[40%] left-[-150px] w-[400px] h-[400px] bg-[#C6DAE8]/30 rounded-[50%_50%_40%_60%_/_60%_40%_60%_40%] pointer-events-none" />
      
      {/* Blob Lavanda Bottom Left */}
      <div className="absolute bottom-[-150px] left-[-50px] w-[550px] h-[550px] bg-[#C6DAE8]/40 rounded-[40%_60%_50%_50%_/_50%_50%_60%_40%] pointer-events-none" />
      
      {/* Blob Verde Bottom Right */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[#D0E5D0]/30 rounded-[60%_40%_50%_50%_/_50%_50%_60%_40%] pointer-events-none" />

      {/* ----------------- ELEMENTOS FLUTUANTES DECORATIVOS ----------------- */}
      {/* Bell Button (Top Right) */}
      <div className="absolute top-8 right-8 z-10">
        <button 
          onClick={() => setError('Notificações prontas para sincronização no Supabase.')}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:bg-white transition-all duration-200 cursor-pointer active:scale-95"
        >
          <Bell className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Top Left Diamond & Circle Overlap */}
      <div className="absolute top-[20%] left-[22%] w-16 h-16 bg-[#8FA3CD]/30 rounded-2xl rotate-12 pointer-events-none" />
      <div className="absolute top-[28%] left-[20%] w-12 h-12 bg-[#D0E5D0]/50 rounded-full pointer-events-none" />

      {/* Top Right Diamond & Circle */}
      <div className="absolute top-[18%] right-[15%] w-14 h-14 bg-[#8FA3CD]/60 rounded-2xl rotate-45 pointer-events-none" />
      <div className="absolute top-[30%] right-[12%] w-3 h-3 bg-[#D0E5D0] rounded-full pointer-events-none" />

      {/* Bottom Left Shapes */}
      <div className="absolute bottom-[20%] left-[16%] w-5 h-5 bg-[#8FA3CD]/40 rounded-full pointer-events-none" />
      <div className="absolute bottom-[22%] left-[20%] w-6 h-6 bg-[#8FA3CD]/75 rounded-md rotate-45 pointer-events-none" />
      <div className="absolute bottom-[18%] left-[24%] w-3 h-3 bg-[#D0E5D0] rounded-full pointer-events-none" />

      {/* Bottom Right Shapes */}
      <div className="absolute bottom-[22%] right-[8%] w-8 h-8 bg-[#8FA3CD]/60 rounded-lg rotate-12 pointer-events-none" />
      <svg className="absolute bottom-[10%] right-[15%] w-12 h-12 text-white/90 drop-shadow-sm pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
      </svg>

      {/* ----------------- LOGO DA MARCA ----------------- */}
      <div className="flex items-center justify-center gap-2 mb-8 z-10">
        <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top-left petal */}
          <rect x="22" y="15" width="22" height="42" rx="11" transform="rotate(-45 22 15)" fill="#9CBAD4" opacity="0.85" />
          {/* Top-right petal */}
          <rect x="56" y="22" width="22" height="42" rx="11" transform="rotate(45 56 22)" fill="#B5D2C2" opacity="0.85" />
          {/* Bottom-left petal */}
          <rect x="18" y="48" width="22" height="42" rx="11" transform="rotate(45 18 48)" fill="#B5D2C2" opacity="0.85" />
          {/* Bottom-right petal */}
          <rect x="52" y="42" width="22" height="42" rx="11" transform="rotate(-45 52 42)" fill="#9CBAD4" opacity="0.85" />
        </svg>
        <span className="text-2xl font-bold tracking-wider text-slate-700 font-sans">FLOWFY</span>
      </div>

      {/* ----------------- CARD DE LOGIN CENTRAL ----------------- */}
      <div className="w-full max-w-[440px] bg-white rounded-[16px] px-8 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100/50 z-10">
        <h2 className="text-[24px] font-semibold text-slate-800 text-center tracking-tight mb-2">
          {isSignUp ? 'Criar sua Conta' : 'Bem-vindo de Volta'}
        </h2>
        <p className="text-[14px] text-slate-400 font-normal leading-relaxed text-center px-4 mb-8">
          {isSignUp
            ? 'Cadastre-se para gerenciar suas tarefas e finanças.'
            : 'Acesse sua conta para gerenciar suas tarefas e finanças.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`px-4 py-3 rounded-xl text-sm border text-center transition-all ${
              error.includes('sucesso') || error.includes('realizado')
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="h-5 w-5" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required={isSignUp}
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome Completo"
                className="w-full bg-[#F1F3F6]/50 border border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA3CD]/30 focus:bg-white focus:border-[#8FA3CD] transition-all duration-200 disabled:opacity-50"
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {isSignUp ? <Mail className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSignUp ? "E-mail" : "Usuário ou E-mail"}
              className="w-full bg-[#F1F3F6]/50 border border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA3CD]/30 focus:bg-white focus:border-[#8FA3CD] transition-all duration-200 disabled:opacity-50"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="h-5 w-5" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-[#F1F3F6]/50 border border-slate-100 rounded-xl py-3.5 pl-11 pr-11 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA3CD]/30 focus:bg-white focus:border-[#8FA3CD] transition-all duration-200 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#8FA3CD] hover:bg-[#7E92BB] active:scale-[0.99] transition-all duration-200 text-white font-medium rounded-xl text-center text-sm shadow-sm shadow-[#8FA3CD]/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : isSignUp ? 'Criar minha conta' : 'Entrar'}
            </button>
          </div>
        </form>

        {!isSignUp && (
          <button
            onClick={() => setError('A recuperação de senha via e-mail deve ser configurada no console do Supabase.')}
            className="text-xs text-slate-400 hover:text-slate-500 transition-colors block mx-auto mt-4 text-center"
          >
            Esqueceu sua senha?
          </button>
        )}

        {/* Divisor */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">ou entre com</span>
          </div>
        </div>

        {/* Login Social */}
        <div className="mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 border border-slate-200/70 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 font-semibold text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Entrar com o Google
          </button>
        </div>

        {/* Rodapé do Card */}
        <p className="text-center text-sm text-slate-400 mt-6">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-slate-600 hover:text-slate-800 font-semibold ml-1 transition-colors focus:outline-none"
          >
            {isSignUp ? 'Entre' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  );
};

