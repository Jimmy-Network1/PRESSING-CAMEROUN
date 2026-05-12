import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCommandes, getAllDepenses } from '../db/indexedDB';
import { ShoppingCart, Droplets, Banknote, CalendarClock, TrendingUp, ChevronRight, CheckCircle2, Clock, XCircle, TrendingDown, Scale } from 'lucide-react';

export default function Dashboard() {
  const [commandes, setCommandes] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setLoading(true);
    const dataCommandes = await getAllCommandes();
    const dataDepenses = await getAllDepenses();
    
    dataCommandes.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    setCommandes(dataCommandes);
    setDepenses(dataDepenses);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
        Chargement du tableau de bord...
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);

  // Stats
  const commandesDuJour = commandes.filter(c => c.dateDepot === today).length;
  const enAttenteLavage = commandes.filter(c => c.statutLavage === 'non_lave').length;
  const nonPayees = commandes.filter(c => c.statutPaiement === 'non_paye').length;
  const aLivrerAujourdhui = commandes.filter(c => c.dateLivraison === today).length;

  // CA
  const caDuJour = commandes.filter(c => c.dateDepot === today).reduce((acc, c) => acc + c.montantTotal, 0);
  const caDuMois = commandes.filter(c => c.dateDepot?.startsWith(currentMonth)).reduce((acc, c) => acc + c.montantTotal, 0);
  const caTotal = commandes.reduce((acc, c) => acc + c.montantTotal, 0);

  // Dépenses & Bénéfice (Global)
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const beneficeNet = caTotal - totalDepenses;

  // Graphique
  const daysLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label = daysLabels[d.getDay()];
    const count = commandes.filter(c => c.dateDepot === dateStr).length;
    return { dateStr, label, count };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 1); // Avoid division by zero
  const dernieresCommandes = commandes.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Vue d'ensemble</h1>
          <p className="text-slate-500 mt-1 text-sm">Gérez votre activité et suivez vos performances financières.</p>
        </div>
      </div>

      {/* Cartes Stats Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Commandes du jour</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{commandesDuJour}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">En attente lavage</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{enAttenteLavage}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Droplets size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Non payées</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{nonPayees}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Banknote size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">À livrer (Auj.)</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{aLivrerAujourdhui}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <CalendarClock size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale: CA & Graphique */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chiffre d'affaires & Bénéfice */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Scale className="text-slate-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Bilan Financier Global</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-100 bg-green-50">
                <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={14}/> Total Entrées (CA)</p>
                <p className="text-xl font-black text-green-800">{caTotal.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-100 bg-red-50">
                <p className="text-xs text-red-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingDown size={14}/> Total Charges</p>
                <p className="text-xl font-black text-red-800">- {totalDepenses.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-100 bg-blue-50">
                <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Scale size={14}/> Bénéfice Net</p>
                <p className="text-xl font-black text-blue-800">{beneficeNet.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <TrendingUp className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Évolution (7 derniers jours)</h2>
            </div>
            <div className="flex items-end justify-between h-56 pb-2 gap-2 mt-4 px-2">
              {last7Days.map((day, idx) => {
                const heightPercent = (day.count / maxCount) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div className="text-xs text-slate-500 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count}
                    </div>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-md relative flex items-end h-full">
                      <div 
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-500"
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-600 mt-3 font-medium">{day.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne Secondaire: Dernières commandes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Dernières commandes</h2>
            <Link to="/commandes" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {dernieresCommandes.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-10 flex flex-col items-center">
                <ShoppingCart className="text-slate-300 w-12 h-12 mb-3" />
                <p>Aucune commande récente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dernieresCommandes.map(c => (
                  <div key={c.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800">{c.nomClient}</span>
                      <span className="text-sm font-bold text-green-700">{c.montantTotal?.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-3 line-clamp-1">
                      {c.articles?.map(a => `${a.quantite}x ${a.nom}`).join(', ')}
                    </div>
                    <div className="flex gap-2">
                      {c.statutLavage === 'lave' ? (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded font-bold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle2 size={12} /> Lavé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded font-bold bg-red-50 text-red-700 border border-red-100">
                          <XCircle size={12} /> Non lavé
                        </span>
                      )}
                      
                      {c.statutPaiement === 'paye' ? (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded font-bold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle2 size={12} /> Payé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock size={12} /> Non payé
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
