import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AUTH_TOKEN_KEY = 'debatesphere_auth_token';

export const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return token;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await getIdToken(result.user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return { user: result.user, token };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(result.user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return { user: result.user, token };
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Note: Display name would need to be updated separately or via custom claims
    const token = await getIdToken(result.user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return { user: result.user, token };
  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    clearAuthToken();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
