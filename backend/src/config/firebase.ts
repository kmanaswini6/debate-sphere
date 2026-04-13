import * as admin from 'firebase-admin';

let firebaseInitialized = false;

export const initializeFirebase = (): void => {
  if (firebaseInitialized) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('⚠️  Firebase Admin SDK not fully configured. Auth will not work.');
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
  }
};

export const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  if (!firebaseInitialized) {
    throw new Error('Firebase Admin SDK not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
};

export { admin };
