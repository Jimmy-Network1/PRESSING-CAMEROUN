import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Commandes from './pages/Commandes';
import NouvelleCommande from './pages/NouvelleCommande';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main className="pb-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/nouvelle-commande" element={<NouvelleCommande />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
