// src/lib/firestore.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ============= SINGLE DOCUMENT (Home, About) =============

/**
 * Get single document data (e.g. home/main, about/main)
 */
export const getSingleDoc = async (collectionName, docId = 'main') => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${docId}:`, error);
    throw error;
  }
};

/**
 * Set/update single document
 */
export const setSingleDoc = async (collectionName, data, docId = 'main') => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(
      docRef,
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error(`Error setting ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// ============= COLLECTION (Projects, Skills) =============

/**
 * Get all documents from collection (ordered by createdAt desc)
 */
export const getCollection = async (collectionName, orderField = 'createdAt') => {
  try {
    const q = query(collection(db, collectionName), orderBy(orderField, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    // Fallback if orderBy fails (no index or no field)
    try {
      const snap = await getDocs(collection(db, collectionName));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(`Error fetching ${collectionName}:`, e);
      throw e;
    }
  }
};

/**
 * Get single document by ID from collection
 */
export const getDocById = async (collectionName, id) => {
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${id}:`, error);
    throw error;
  }
};

/**
 * Add new document to collection
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error(`Error adding to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update existing document
 */
export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${collectionName}/${id}:`, error);
    throw error;
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${id}:`, error);
    throw error;
  }
};

// ============= CONTACT MESSAGES =============

export const submitContactMessage = async (data) => {
  return addDocument('messages', { ...data, read: false });
};

export const getMessages = async () => {
  return getCollection('messages');
};

export const markMessageRead = async (id) => {
  return updateDocument('messages', id, { read: true });
};
