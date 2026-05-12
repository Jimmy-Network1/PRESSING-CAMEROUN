import { openDB as idbOpen } from 'idb';

const DB_NAME = 'pressingDB';
const DB_VERSION = 2; // Mise à jour de la version pour ajouter les nouvelles tables

export const openDB = async () => {
  try {
    return await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Version 1 : Commandes
        if (oldVersion < 1) {
          const store = db.createObjectStore('commandes', { keyPath: 'id', autoIncrement: true });
          store.createIndex('statutPaiement', 'statutPaiement');
          store.createIndex('statutLavage', 'statutLavage');
          store.createIndex('dateDepot', 'dateDepot');
        }
        
        // Version 2 : Utilisateurs (Auth) et Dépenses
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('utilisateurs')) {
            db.createObjectStore('utilisateurs', { keyPath: 'username' });
          }
          if (!db.objectStoreNames.contains('depenses')) {
            const depensesStore = db.createObjectStore('depenses', { keyPath: 'id', autoIncrement: true });
            depensesStore.createIndex('date', 'date');
          }
        }
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la base de données:', error);
    throw error;
  }
};

// ==========================================
// 🔐 GESTION DES UTILISATEURS (AUTH)
// ==========================================

export const initDefaultUsers = async () => {
  const db = await openDB();
  const patron = await db.get('utilisateurs', 'admin');
  
  if (!patron) {
    await db.put('utilisateurs', { username: 'admin', password: '123', role: 'patron', nom: 'Gérant Principal' });
    await db.put('utilisateurs', { username: 'caisse', password: '123', role: 'caissier', nom: 'Caissier 1' });
  }
};

export const loginUser = async (username, password) => {
  const db = await openDB();
  const user = await db.get('utilisateurs', username);
  if (user && user.password === password) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
  throw new Error('Identifiants incorrects');
};


// ==========================================
// 🧺 GESTION DES COMMANDES
// ==========================================

export const addCommande = async (commande) => {
  try {
    const db = await openDB();
    commande.dateCreation = new Date().toISOString();
    return await db.add('commandes', commande);
  } catch (error) { throw error; }
};

export const getAllCommandes = async () => {
  try {
    const db = await openDB();
    return await db.getAll('commandes');
  } catch (error) { return []; }
};

export const getCommandeById = async (id) => {
  try {
    const db = await openDB();
    return await db.get('commandes', id);
  } catch (error) { return null; }
};

export const updateCommande = async (id, changes) => {
  try {
    const db = await openDB();
    const commande = await db.get('commandes', id);
    if (!commande) throw new Error('Commande introuvable');
    const updatedCommande = { ...commande, ...changes };
    await db.put('commandes', updatedCommande);
    return updatedCommande;
  } catch (error) { throw error; }
};

export const deleteCommande = async (id) => {
  try {
    const db = await openDB();
    await db.delete('commandes', id);
  } catch (error) { throw error; }
};

export const getCommandesDuJour = async () => {
  try {
    const db = await openDB();
    const today = new Date().toISOString().split('T')[0];
    const toutesCommandes = await db.getAll('commandes');
    return toutesCommandes.filter(c => c.dateDepot && c.dateDepot.startsWith(today));
  } catch (error) { return []; }
};

export const getCommandesNonPayees = async () => {
  try {
    const db = await openDB();
    return await db.getAllFromIndex('commandes', 'statutPaiement', 'non_paye');
  } catch (error) { return []; }
};

// ==========================================
// 💸 GESTION DES DÉPENSES
// ==========================================

export const addDepense = async (depense) => {
  try {
    const db = await openDB();
    depense.dateCreation = new Date().toISOString();
    return await db.add('depenses', depense);
  } catch (error) { throw error; }
};

export const getAllDepenses = async () => {
  try {
    const db = await openDB();
    return await db.getAll('depenses');
  } catch (error) { return []; }
};

export const deleteDepense = async (id) => {
  try {
    const db = await openDB();
    await db.delete('depenses', id);
  } catch (error) { throw error; }
};
