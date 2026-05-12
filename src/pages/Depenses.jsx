import React, { useState, useEffect } from 'react';
import { getAllDepenses, addDepense, deleteDepense } from '../db/indexedDB';
import { Wallet, PlusCircle, Trash2, Calendar, FileText } from 'lucide-react';

export default function Depenses({ user }) {
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [motif, setMotif] = useState('');
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    chargerDepenses();
  }, []);

  const chargerDepenses = async () => {
    setLoading(true);
    const data = await getAllDepenses();
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trie par date décroissante
    setDepenses(data);
    setLoading(false);
  };

  const handleAddDepense = async (e) => {
    e.preventDefault();
    if (!motif || !montant) return;

    try {
      await addDepense({
        motif,
        montant: Number(montant),
        date,
        ajoutePar: user.nom
      });
      setMotif('');
      setMontant('');
      chargerDepenses();
    } catch (error) {
      alert("Erreur lors de l'ajout de la dépense.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette dépense ?')) {
      try {
        await deleteDepense(id);
        chargerDepenses();
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Gestion des Dépenses</h1>
          <p className="text-slate-500 mt-1 text-sm">Suivez les sorties d'argent (savon, électricité, salaires...).</p>
        </div>
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
          <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Total des charges</p>
          <p className="text-xl font-black text-red-700">{totalDepenses.toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulaire d'ajout */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddDepense} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-red-500" />
              Nouvelle Dépense
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Motif</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    placeholder="Ex: Achat OMO"
                    className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Montant (FCFA)</label>
                <div className="relative">
                  <Wallet size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
              >
                Ajouter la dépense
              </button>
            </div>
          </form>
        </div>

        {/* Liste des dépenses */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Chargement...</div>
            ) : depenses.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Wallet size={48} className="mx-auto text-slate-300 mb-3" />
                <p>Aucune dépense enregistrée.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {depenses.map(d => (
                  <li key={d.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{d.motif}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {new Date(d.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-xs text-slate-400">Par: {d.ajoutePar}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-red-600">
                        - {d.montant.toLocaleString('fr-FR')} FCFA
                      </span>
                      <button 
                        onClick={() => handleDelete(d.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
