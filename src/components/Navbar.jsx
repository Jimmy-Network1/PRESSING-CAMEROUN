import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shirt, LayoutDashboard, ListOrdered, PlusCircle, Menu, X } from 'lucide-react';
import { getCommandesNonPayees } from '../db/indexedDB';

export default function Navbar() {
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

  const navLinks = [
    { name: 'Tableau de bord', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Commandes', path: '/commandes', icon: <ListOrdered size={18} /> },
  ];

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-green-400 transition-colors">
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
            
            <div className="ml-4 pl-4 border-l border-slate-600">
              <Link 
                to="/nouvelle-commande" 
                className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-500 flex items-center gap-2 transition-colors shadow-sm"
              >
                <PlusCircle size={18} />
                <span>Nouvelle commande</span>
              </Link>
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
        </div>
      )}
    </nav>
  );
}
