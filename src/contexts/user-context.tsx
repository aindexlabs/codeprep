"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '@/lib/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Create or update user profile in database
    const createUserProfile = async (firebaseUser: FirebaseUser, displayName?: string) => {
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // Create new user profile
            const newUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                role: 'Dev Student',
                createdAt: Date.now(),
                lastLogin: Date.now(),
            };
            await set(userRef, newUser);
            return newUser;
        } else {
            // Update last login
            const existingUser = snapshot.val();
            await set(ref(database, `users/${firebaseUser.uid}/lastLogin`), Date.now());
            return existingUser;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userProfile = await createUserProfile(firebaseUser);
                    setUser(userProfile);
                } catch (error) {
                    console.error('Error creating user profile:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Sign up with email and password
    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfile(userCredential.user, name);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    // Sign out
    const signOut = async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
