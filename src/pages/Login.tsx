import React, { useState } from 'react';
import { Shirt, Lock, User, LogIn } from 'lucide-react';
import { loginUser } from '../db/indexedDB';
import { Utilisateur } from '../types';

interface LoginProps {
  onLogin: (u: Utilisateur) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(username, password);
      onLogin(user); // Met à jour l'état dans App.jsx
    } catch (err) {
      setError('Identifiant ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-800 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shirt className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">MonPressing</h1>
          <p className="text-slate-400 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm font-medium mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Identifiant</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="admin ou caisse"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Connexion
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
            <p className="font-semibold text-slate-700 mb-1">Comptes par défaut (Test)</p>
            <p>Patron: <span className="font-mono bg-slate-200 px-1 rounded text-slate-800">admin</span> / <span className="font-mono bg-slate-200 px-1 rounded text-slate-800">123</span></p>
            <p>Caissier: <span className="font-mono bg-slate-200 px-1 rounded text-slate-800">caisse</span> / <span className="font-mono bg-slate-200 px-1 rounded text-slate-800">123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
