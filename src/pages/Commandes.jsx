import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Calendar, Trash2, Inbox, CheckCircle2, Clock, XCircle, Filter, Banknote, Search } from 'lucide-react';
import { getAllCommandes, updateCommande, deleteCommande } from '../db/indexedDB';

export default function Commandes({ user }) {
  const [commandes, setCommandes] = useState([]);
  const [filtre, setFiltre] = useState('Toutes');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerCommandes();
  }, []);

  const chargerCommandes = async () => {
    setLoading(true);
    const data = await getAllCommandes();
    data.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    setCommandes(data);
    setLoading(false);
  };

  const handleUpdateLavage = async (id) => {
    try {
      await updateCommande(id, { statutLavage: 'lave' });
      setCommandes(commandes.map(c => c.id === id ? { ...c, statutLavage: 'lave' } : c));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleUpdatePaiement = async (id) => {
    try {
      await updateCommande(id, { statutPaiement: 'paye' });
      setCommandes(commandes.map(c => c.id === id ? { ...c, statutPaiement: 'paye' } : c));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await deleteCommande(id);
        setCommandes(commandes.filter(c => c.id !== id));
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const commandesFiltrees = commandes.filter(c => {
    // Filtre par statut/date
    let passFilter = true;
    if (filtre === 'Non lavées') passFilter = c.statutLavage === 'non_lave';
    else if (filtre === 'Non payées') passFilter = c.statutPaiement === 'non_paye';
    else if (filtre === 'À livrer aujourd\'hui') passFilter = c.dateLivraison === today;

    // Filtre par recherche (nom ou tel)
    let passSearch = true;
    if (recherche) {
      const searchLower = recherche.toLowerCase();
      passSearch = (c.nomClient?.toLowerCase().includes(searchLower)) || 
                   (c.telephone?.includes(recherche));
    }

    return passFilter && passSearch;
  });

  const filtresOptions = ['Toutes', 'Non lavées', 'Non payées', 'À livrer aujourd\'hui'];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Liste des Commandes</h1>
          <p className="text-slate-500 mt-1 text-sm">Gérez et suivez le statut de toutes les commandes.</p>
        </div>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Recherche */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher (nom ou téléphone)..."
            className="w-full pl-10 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Filtres statuts */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {filtresOptions.map(f => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                filtre === f 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des commandes */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
          Chargement des commandes...
        </div>
      ) : commandesFiltrees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Inbox size={48} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Aucune commande trouvée</h3>
          <p className="text-slate-500 text-sm">Essayez de modifier votre recherche ou vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandesFiltrees.map(commande => (
            <div key={commande.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col overflow-hidden">
              
              {/* En-tête de la carte */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="font-bold text-lg text-slate-800 truncate pr-2" title={commande.nomClient}>
                    {commande.nomClient}
                  </h2>
                  <div className="flex flex-col gap-1 items-end">
                    {commande.statutLavage === 'lave' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                        <CheckCircle2 size={12} /> Lavé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold bg-red-50 text-red-700 border border-red-100 whitespace-nowrap">
                        <XCircle size={12} /> Non lavé
                      </span>
                    )}
                    
                    {commande.statutPaiement === 'paye' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                        <CheckCircle2 size={12} /> Payé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap">
                        <Clock size={12} /> Non payé
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-slate-600 space-y-2 mt-2">
                  {commande.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>{commande.telephone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{commande.quartier}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 font-medium bg-blue-50/50 p-1.5 rounded-md mt-1 border border-blue-100">
                    <Calendar size={14} className="text-blue-500" />
                    <span>{new Date(commande.dateDepot).toLocaleDateString('fr-FR')} → {new Date(commande.dateLivraison).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="p-5 flex-1 bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  Articles ({commande.articles?.length || 0})
                </h3>
                <ul className="space-y-2 mb-4 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {commande.articles?.map((article, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="font-medium text-slate-800">{article.quantite}x {article.nom}</span>
                      <span className="text-slate-500 text-xs">{(article.quantite * article.prixUnitaire).toLocaleString('fr-FR')} FCFA</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-end pt-3 border-t border-slate-100 mt-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-xl font-bold text-slate-900">{commande.montantTotal?.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-end items-center">
                
                {commande.statutLavage === 'non_lave' && (
                  <button 
                    onClick={() => handleUpdateLavage(commande.id)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-1 text-xs bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md font-semibold transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Laver
                  </button>
                )}
                {commande.statutPaiement === 'non_paye' && (
                  <button 
                    onClick={() => handleUpdatePaiement(commande.id)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-1 text-xs bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-2 rounded-md font-semibold transition-colors shadow-sm"
                  >
                    <Banknote size={14} /> Payer
                  </button>
                )}
                
                {/* Seul le patron peut supprimer */}
                {user?.role === 'patron' && (
                  <button 
                    onClick={() => handleDelete(commande.id)}
                    className="flex justify-center items-center text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors border border-transparent hover:border-red-100 ml-auto"
                    title="Supprimer la commande"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
