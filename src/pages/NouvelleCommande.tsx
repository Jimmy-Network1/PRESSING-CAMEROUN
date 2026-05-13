import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCommande } from '../db/indexedDB';
import { User, MapPin, Phone, Calendar, Shirt, PlusCircle, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Article, Commande } from '../types';

const QUARTIERS = [
  'Bastos', 'Melen', 'Mvog-Mbi', 'Essos', 'Nkoldongo',
  'Biyem-Assi', 'Ngoa-Ekele', 'Omnisport', 'Mfandena', 'Autre'
];

const ARTICLES_TYPES = [
  'Chemise', 'Pantalon', 'Robe', 'Boubou', 'Pagne',
  'Jupe', 'Veste', 'Djellaba', 'Drap', 'Couverture', 'Uniforme scolaire', 'Autre'
];

const MODES_PAIEMENT = ['Cash', 'Orange Money', 'MTN MoMo'];

export default function NouvelleCommande() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  
  const [nomClient, setNomClient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [quartier, setQuartier] = useState(QUARTIERS[0]);
  const [dateDepot, setDateDepot] = useState(today);
  const [dateLivraison, setDateLivraison] = useState('');
  const [modePaiement, setModePaiement] = useState(MODES_PAIEMENT[0]);
  
  const [articles, setArticles] = useState<Article[]>([
    { id: Date.now(), nom: ARTICLES_TYPES[0], quantite: 1, prixUnitaire: 0 }
  ]);

  const montantTotal = useMemo(() => {
    return articles.reduce((acc, article) => acc + (article.quantite * article.prixUnitaire), 0);
  }, [articles]);

  const handleAddArticle = () => {
    setArticles([
      ...articles,
      { id: Date.now(), nom: ARTICLES_TYPES[0], quantite: 1, prixUnitaire: 0 }
    ]);
  };

  const handleRemoveArticle = (id: number | undefined) => {
    if (articles.length > 1) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleArticleChange = (id: number | undefined, field: string, value: any) => {
    setArticles(articles.map(a => {
      if (a.id === id) {
        const newArticle = { ...a, [field]: value };
        return newArticle;
      }
      return a;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (articles.length === 0) return;

    const finalArticles = articles.map(a => ({
      nom: a.nom,
      quantite: Number(a.quantite),
      prixUnitaire: Number(a.prixUnitaire),
      sousTotal: Number(a.quantite) * Number(a.prixUnitaire)
    }));

    const nouvelleCommande: Commande = {
      nomClient,
      telephone,
      quartier,
      dateDepot,
      dateLivraison,
      modePaiement: modePaiement.toLowerCase().replace(' ', '_'),
      articles: finalArticles,
      montantTotal,
      statutLavage: 'non_lave',
      statutPaiement: 'non_paye',
      statutLivraison: 'en_attente'
    };

    try {
      await addCommande(nouvelleCommande);
      setSuccessMsg('Commande enregistrée avec succès');
      setTimeout(() => {
        navigate('/commandes');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-2">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Nouvelle Commande</h1>
        <p className="text-slate-500 mt-1 text-sm">Créez une nouvelle fiche de dépôt pour un client.</p>
      </div>
      
      {successMsg && (
        <div className="bg-green-50 text-green-800 border border-green-200 p-4 mb-8 rounded-lg flex items-center gap-3 font-medium shadow-sm animate-fade-in">
          <CheckCircle2 className="text-green-600" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Informations Client */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User size={20} className="text-blue-600" />
            Informations du Client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nom complet *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                  className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nom complet"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-slate-400" />
                </div>
                <input 
                  type="tel" 
                  pattern="[0-9]{9}"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ex: 691234567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Quartier de résidence</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <select 
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Détails Commande */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar size={20} className="text-purple-600" />
            Détails du Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date de livraison *</label>
              <input 
                type="datetime-local" 
                required
                min={new Date().toISOString().slice(0, 16)}
                value={dateLivraison}
                onChange={(e) => setDateLivraison(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div className="lg:col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mode de paiement préféré</label>
              <div className="flex flex-wrap gap-3">
                {MODES_PAIEMENT.map(mode => (
                  <label key={mode} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${modePaiement === mode ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="modePaiement" 
                      value={mode}
                      checked={modePaiement === mode}
                      onChange={(e) => setModePaiement(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shirt size={20} className="text-green-600" />
              Articles à Nettoyer
            </h2>
            <button 
              type="button" 
              onClick={handleAddArticle}
              className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-sm"
            >
              <PlusCircle size={16} /> Ajouter
            </button>
          </div>
          
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={article.id} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type d'article</label>
                  <select 
                    value={article.nom}
                    onChange={(e) => handleArticleChange(article.id, 'nom', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                  >
                    {ARTICLES_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-24">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Quantité</label>
                  <input 
                    type="number" 
                    min="1" 
                    required
                    value={article.quantite}
                    onChange={(e) => handleArticleChange(article.id, 'quantite', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-center"
                  />
                </div>
                <div className="w-full md:w-36">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Prix U. (FCFA)</label>
                  <input 
                    type="number" 
                    min="0" 
                    required
                    value={article.prixUnitaire}
                    onChange={(e) => handleArticleChange(article.id, 'prixUnitaire', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-right"
                  />
                </div>
                <div className="w-full md:w-36">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Sous-total</label>
                  <div className="w-full border border-slate-200 rounded-lg p-2.5 font-bold bg-white text-slate-800 text-right shadow-inner">
                    {(article.quantite * article.prixUnitaire).toLocaleString('fr-FR')}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveArticle(article.id)}
                  className={`p-2.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all ${articles.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={articles.length === 1}
                  title="Supprimer cet article"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Submit */}
        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md mt-8">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Montant Total à Payer</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-white flex items-baseline gap-2">
              {montantTotal.toLocaleString('fr-FR')} <span className="text-xl text-green-400">FCFA</span>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3.5 px-8 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
          >
            Enregistrer <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
