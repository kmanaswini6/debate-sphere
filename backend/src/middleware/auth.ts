import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

interface AuthenticatedRequest extends Request {
    user?: { uid: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            req.user = { uid: decodedToken.uid };
            next();
        })
        .catch((error) => {
            console.error('Error verifying token:', error);
            res.sendStatus(403); // Forbidden
        });
};

export { AuthenticatedRequest, authenticateToken };