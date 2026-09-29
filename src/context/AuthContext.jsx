import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword, 
  logoutFirebase,
  formatAuthError,
  onAuthStateChanged 
} from '../lib/firebase';
import { syncFirebaseAuthToken } from '../lib/api';
import { toast } from '../components/ui/toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendToken, setBackendToken] = useState(() => localStorage.getItem('bhavesh_user_jwt') || '');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Check if a specific user has agreed to Terms & Privacy Policy
  const checkUserTermsAgreement = (user) => {
    if (!user) return true;
    const key = `bhavesh_terms_agreed_${user.uid}`;
    const stored = localStorage.getItem(key);
    return !!stored;
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Verify terms agreement after login
        const hasAgreed = checkUserTermsAgreement(user);
        if (!hasAgreed) {
          setTermsModalOpen(true);
        }

        try {
          const idToken = await user.getIdToken();
          const syncRes = await syncFirebaseAuthToken(idToken);
          if (syncRes?.jwtToken) {
            localStorage.setItem('bhavesh_user_jwt', syncRes.jwtToken);
            setBackendToken(syncRes.jwtToken);
          }
        } catch (err) {
          console.warn('Failed to sync Firebase token with backend:', err);
        }
      } else {
        localStorage.removeItem('bhavesh_user_jwt');
        setBackendToken('');
        setTermsModalOpen(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const agreeUserTerms = async () => {
    if (currentUser) {
      const key = `bhavesh_terms_agreed_${currentUser.uid}`;
      const payload = {
        agreed: true,
        uid: currentUser.uid,
        email: currentUser.email,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(payload));
      localStorage.setItem('bhavesh_terms_agreed', JSON.stringify(payload)); // Also set general key
      setTermsModalOpen(false);
      toast({
        title: 'Agreement Recorded',
        description: 'Terms of Service and Privacy Policy accepted.',
        variant: 'default',
        duration: 3500,
      });
    }
  };

  const declineUserTerms = async () => {
    setTermsModalOpen(false);
    await logout();
    toast({
      title: 'Agreement Declined',
      description: 'You have been signed out. You can sign in and accept anytime.',
      variant: 'default',
      duration: 4000,
    });
  };

  // Actions
  const signInWithGoogle = async () => {
    try {
      const { user, idToken } = await loginWithGoogle();
      try {
        const syncRes = await syncFirebaseAuthToken(idToken);
        if (syncRes?.jwtToken) {
          localStorage.setItem('bhavesh_user_jwt', syncRes.jwtToken);
          setBackendToken(syncRes.jwtToken);
        }
      } catch (syncErr) {
        console.warn('Backend token sync info:', syncErr.message);
      }
      setAuthModalOpen(false);
      toast({
        title: 'Welcome!',
        description: `Signed in as ${user.displayName || user.email}`,
        variant: 'default',
      });
      return user;
    } catch (err) {
      console.error('Google Sign In Error:', err);
      const friendlyMsg = formatAuthError(err);
      toast({
        title: 'Sign In Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
      throw new Error(friendlyMsg);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const { user, idToken } = await loginWithEmail(email, password);
      try {
        const syncRes = await syncFirebaseAuthToken(idToken);
        if (syncRes?.jwtToken) {
          localStorage.setItem('bhavesh_user_jwt', syncRes.jwtToken);
          setBackendToken(syncRes.jwtToken);
        }
      } catch (syncErr) {
        console.warn('Backend token sync info:', syncErr.message);
      }
      setAuthModalOpen(false);
      toast({
        title: 'Welcome Back!',
        description: `Signed in as ${user.displayName || user.email}`,
        variant: 'default',
      });
      return user;
    } catch (err) {
      console.error('Email Login Error:', err);
      const friendlyMsg = formatAuthError(err);
      toast({
        title: 'Login Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
      throw new Error(friendlyMsg);
    }
  };

  const signUpWithEmail = async (name, email, password) => {
    try {
      const { user, idToken } = await registerWithEmail(name, email, password);
      try {
        const syncRes = await syncFirebaseAuthToken(idToken);
        if (syncRes?.jwtToken) {
          localStorage.setItem('bhavesh_user_jwt', syncRes.jwtToken);
          setBackendToken(syncRes.jwtToken);
        }
      } catch (syncErr) {
        console.warn('Backend token sync info:', syncErr.message);
      }
      setAuthModalOpen(false);
      toast({
        title: 'Account Created!',
        description: `Welcome to the platform, ${name || user.email}!`,
        variant: 'default',
      });
      return user;
    } catch (err) {
      console.error('Sign Up Error:', err);
      const friendlyMsg = formatAuthError(err);
      toast({
        title: 'Account Creation Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
      throw new Error(friendlyMsg);
    }
  };

  const sendResetEmail = async (email) => {
    try {
      await resetPassword(email);
      toast({
        title: 'Password Reset Sent',
        description: `Check your inbox at ${email} for reset instructions.`,
        variant: 'default',
      });
      setAuthModalMode('signin');
    } catch (err) {
      const friendlyMsg = formatAuthError(err);
      toast({
        title: 'Reset Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    try {
      await logoutFirebase();
      localStorage.removeItem('bhavesh_user_jwt');
      setBackendToken('');
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        backendToken,
        loading,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        termsModalOpen,
        setTermsModalOpen,
        agreeUserTerms,
        declineUserTerms,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendResetEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
