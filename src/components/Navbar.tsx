import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { Clipboard, Wallet, BarChart2, LogOut, Menu, X, User, Bell } from 'lucide-react';
import type { ActiveTab } from '../types/todo';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, user, logout } = useTodos();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItems = [
    { id: 'tasks' as ActiveTab, label: 'Tarefa', icon: Clipboard },
    { id: 'finance' as ActiveTab, label: 'Cash Flow', icon: Wallet },
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/40 backdrop-blur-md border-r border-slate-200/50 p-6 justify-between z-40">
        <div className="space-y-8">
          {/* Logo FLOWFY */}
          <div className="flex items-center gap-3 px-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="13" height="17" rx="6.5" transform="rotate(-15 6 10)" fill="#D0E5D0" />
              <rect x="13" y="6" width="13" height="17" rx="6.5" transform="rotate(15 13 6)" fill="#C6DAE8" style={{ mixBlendMode: 'multiply' }} />
            </svg>
            <span className="font-extrabold text-slate-800 text-lg tracking-wider font-sans">
              FLOWFY
            </span>
          </div>

          {/* Itens do Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100/40 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Menu (Usuário & Logout) */}
        <div className="space-y-4 border-t border-slate-200/50 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {userInitials || <User className="h-4 w-4" />}
            </div>
            <div className="text-left min-w-0">
              <p className="text-sm font-bold text-slate-800 leading-tight truncate">{user.name}</p>
              <p className="text-xs text-slate-400 leading-tight truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-200 text-xs font-bold"
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* HEADER & MENU MOBILE */}
      <header className="md:hidden w-full h-16 bg-white/60 backdrop-blur-md border-b border-slate-250/30 sticky top-0 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="13" height="17" rx="6.5" transform="rotate(-15 6 10)" fill="#D0E5D0" />
            <rect x="13" y="6" width="13" height="17" rx="6.5" transform="rotate(15 13 6)" fill="#C6DAE8" style={{ mixBlendMode: 'multiply' }} />
          </svg>
          <span className="font-extrabold text-slate-800 tracking-wider">FLOWFY</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Gaveta lateral mobile (Drawer Overlay) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-64 max-w-xs h-full bg-white/95 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl animate-scale-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="font-extrabold text-slate-800 tracking-wider">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                  {userInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
