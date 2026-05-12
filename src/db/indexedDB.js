import { openDB as idbOpen } from 'idb';

const DB_NAME = 'pressingDB';
const DB_VERSION = 1;
const STORE_NAME = 'commandes';

export const openDB = async () => {
  try {
    return await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('statutPaiement', 'statutPaiement');
          store.createIndex('statutLavage', 'statutLavage');
          store.createIndex('dateDepot', 'dateDepot');
        }
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la base de données:', error);
    throw error;
  }
};

export const addCommande = async (commande) => {
  try {
    const db = await openDB();
    commande.dateCreation = new Date().toISOString();
    return await db.add(STORE_NAME, commande);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commande:', error);
    throw error;
  }
};

export const getAllCommandes = async () => {
  try {
    const db = await openDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
};

export const getCommandeById = async (id) => {
  try {
    const db = await openDB();
    return await db.get(STORE_NAME, id);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
    return null;
  }
};

export const updateCommande = async (id, changes) => {
  try {
    const db = await openDB();
    const commande = await db.get(STORE_NAME, id);
    if (!commande) throw new Error('Commande introuvable');
    
    const updatedCommande = { ...commande, ...changes };
    await db.put(STORE_NAME, updatedCommande);
    return updatedCommande;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error);
    throw error;
  }
};

export const deleteCommande = async (id) => {
  try {
    const db = await openDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
    throw error;
  }
};

export const getCommandesDuJour = async () => {
  try {
    const db = await openDB();
    const today = new Date().toISOString().split('T')[0];
    
    // On récupère toutes les commandes et on filtre, 
    // car dateDepot peut inclure l'heure (bien qu'on puisse juste stocker YYYY-MM-DD)
    const toutesCommandes = await db.getAll(STORE_NAME);
    return toutesCommandes.filter(c => c.dateDepot && c.dateDepot.startsWith(today));
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du jour:', error);
    return [];
  }
};

export const getCommandesNonLavees = async () => {
  try {
    const db = await openDB();
    return await db.getAllFromIndex(STORE_NAME, 'statutLavage', 'non_lave');
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes non lavées:', error);
    return [];
  }
};

export const getCommandesNonPayees = async () => {
  try {
    const db = await openDB();
    return await db.getAllFromIndex(STORE_NAME, 'statutPaiement', 'non_paye');
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes non payées:', error);
    return [];
  }
};
