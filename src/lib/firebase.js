import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBmJrlIDRQjuwMWXuJimwxaXjtu0fcw9Hg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bhaveshportfolio-989b3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bhaveshportfolio-989b3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bhaveshportfolio-989b3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "222804256584",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:222804256584:web:9d0f8993bad86f8fb0757d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WPP8L8TGM7"
};

// Initialize Firebase safely for singletons
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Format Firebase Auth error codes into human-readable messages
 */
export function formatAuthError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled (popup closed).';
    case 'auth/cancelled-popup-request':
      return 'Popup was cancelled. Please try again.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized. Please add this domain / localhost to Firebase Console -> Authentication -> Settings -> Authorized Domains.';
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return 'Google Sign-In is not enabled yet in your Firebase Console (Authentication -> Sign-in providers -> Google).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Sign in or Sign up with Google Popup
 */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

/**
 * Create a new account with Name, Email and Password
 */
export async function registerWithEmail(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(result.user, { displayName: name });
  }
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

/**
 * Reset password via email link
 */
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Sign out current Firebase user
 */
export async function logoutFirebase() {
  return firebaseSignOut(auth);
}

export { onAuthStateChanged };
