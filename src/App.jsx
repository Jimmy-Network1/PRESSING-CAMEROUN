import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initDefaultUsers } from './db/indexedDB';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Commandes from './pages/Commandes';
import NouvelleCommande from './pages/NouvelleCommande';
import Depenses from './pages/Depenses';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser les faux utilisateurs dans IndexedDB si besoin
    initDefaultUsers().finally(() => {
      // Vérifier si un utilisateur est déjà connecté dans localStorage
      const storedUser = localStorage.getItem('pressing_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('pressing_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pressing_user');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="pb-10">
          <Routes>
            {/* Le Caissier n'a pas accès au Dashboard, il est redirigé vers /commandes */}
            <Route 
              path="/" 
              element={user.role === 'patron' ? <Dashboard /> : <Navigate to="/commandes" replace />} 
            />
            <Route path="/commandes" element={<Commandes user={user} />} />
            <Route path="/nouvelle-commande" element={<NouvelleCommande />} />
            <Route 
              path="/depenses" 
              element={user.role === 'patron' ? <Depenses user={user} /> : <Navigate to="/commandes" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
