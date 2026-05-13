export interface Article {
  id?: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}

export interface Commande {
  id?: number;
  nomClient: string;
  telephone?: string;
  quartier?: string;
  dateDepot: string;
  dateLivraison: string;
  modePaiement: string;
  articles: Article[];
  montantTotal: number;
  statutLavage: 'non_lave' | 'lave';
  statutPaiement: 'non_paye' | 'paye';
  statutLivraison: 'en_attente' | 'livre';
  dateCreation?: string;
}

export interface Utilisateur {
  username: string;
  role: 'patron' | 'caissier';
  nom: string;
  password?: string;
}

export interface Depense {
  id?: number;
  motif: string;
  montant: number;
  date: string;
  ajoutePar: string;
  dateCreation?: string;
}
