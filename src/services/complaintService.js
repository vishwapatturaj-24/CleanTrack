import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const complaintsRef = collection(db, 'complaints');

export const createComplaint = async (complaintData) => {
  const docRef = await addDoc(complaintsRef, {
    ...complaintData,
    status: 'pending',
    priority: 'medium',
    statusHistory: [
      {
        status: 'pending',
        note: 'Complaint submitted',
        updatedBy: 'system',
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getMyComplaints = async (userId) => {
  const q = query(
    complaintsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllComplaints = async () => {
  const q = query(complaintsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getComplaintsByStatus = async (status) => {
  const q = query(
    complaintsRef,
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getComplaintsByCategory = async (category) => {
  const q = query(
    complaintsRef,
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getComplaintById = async (complaintId) => {
  const docRef = doc(db, 'complaints', complaintId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateComplaintStatus = async (complaintId, status, note, updatedBy) => {
  const docRef = doc(db, 'complaints', complaintId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status,
      note: note || `Status changed to ${status}`,
      updatedBy,
      updatedAt: new Date().toISOString(),
    }),
  });
};

export const updateComplaintPriority = async (complaintId, priority) => {
  const docRef = doc(db, 'complaints', complaintId);
  await updateDoc(docRef, {
    priority,
    updatedAt: serverTimestamp(),
  });
};
