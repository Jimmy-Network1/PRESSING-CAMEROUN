import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shirt, LayoutDashboard, ListOrdered, PlusCircle, Menu, X, LogOut, User as UserIcon, Wallet } from 'lucide-react';
import { getCommandesNonPayees } from '../db/indexedDB';

export default function Navbar({ user, onLogout }) {
  const [nonPayeesCount, setNonPayeesCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    chargerBadge();
    setIsMobileMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  const chargerBadge = async () => {
    const data = await getCommandesNonPayees();
    setNonPayeesCount(data.length);
  };

  // Le Caissier n'a pas accès au Dashboard ni aux dépenses
  const navLinks = [];
  if (user?.role === 'patron') {
    navLinks.push({ name: 'Tableau de bord', path: '/', icon: <LayoutDashboard size={18} /> });
  }
  navLinks.push({ name: 'Commandes', path: '/commandes', icon: <ListOrdered size={18} /> });
  if (user?.role === 'patron') {
    navLinks.push({ name: 'Dépenses', path: '/depenses', icon: <Wallet size={18} /> });
  }

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={user?.role === 'patron' ? '/' : '/commandes'} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-green-400 transition-colors">
              <Shirt className="h-7 w-7 text-green-500" />
              <span>MonPressing</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-slate-700 text-green-400' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                {link.path === '/commandes' && nonPayeesCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                    {nonPayeesCount}
                  </span>
                )}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-slate-600 flex items-center gap-4">
              <Link 
                to="/nouvelle-commande" 
                className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-500 flex items-center gap-2 transition-colors shadow-sm"
              >
                <PlusCircle size={18} />
                <span>Nouvelle commande</span>
              </Link>
              
              <div className="flex items-center gap-3 border-l border-slate-600 pl-4">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-green-400">{user?.nom}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-2 pt-2 pb-4 space-y-1 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                location.pathname === link.path 
                  ? 'bg-slate-700 text-green-400' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
              {link.path === '/commandes' && nonPayeesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
                  {nonPayeesCount} non payées
                </span>
              )}
            </Link>
          ))}
          <Link 
            to="/nouvelle-commande" 
            className="block mt-4 px-3 py-3 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-500 flex items-center gap-3"
          >
            <PlusCircle size={20} />
            <span>Nouvelle commande</span>
          </Link>
          
          <div className="mt-4 pt-4 border-t border-slate-700 px-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon size={18} className="text-slate-400" />
                <span className="text-sm font-bold text-green-400">{user?.nom}</span>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
