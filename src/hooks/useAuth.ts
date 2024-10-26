import { useMutation } from '@tanstack/react-query';
import { auth, db } from '../../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setError } from '@/redux/slice/authSlice';
import type { User } from '@/types';
import type { RootState } from '@/redux/store';

interface AuthParams {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  const signUp = useMutation({
    mutationFn: async ({ email, password }: AuthParams) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    },
    onSuccess: async (user: FirebaseUser) => {
      const userInfo: User = {
        userId: user.uid,
        email: user.email as string,
        name: user.displayName || '',
        createdAt: serverTimestamp() as Timestamp,
        role: 'user',
        lastLogin: serverTimestamp() as Timestamp,
        preference: {
          theme: 'light',
          language: 'ko',
        },
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userInfo);
        dispatch(setUser(userInfo));
      } catch (error) {
        dispatch(setError(`Failed to save user data to Firestore : ${error}`));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const login = useMutation({
    mutationFn: async ({ email, password }: AuthParams) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    },
    onSuccess: async (user: FirebaseUser) => {
      const userInfo: User = {
        userId: user.uid,
        email: user.email as string,
        name: user.displayName || '',
        createdAt: Timestamp.now(),
        role: 'user',
        lastLogin: Timestamp.now(),
        preference: {
          theme: 'light',
          language: 'ko',
        },
      };
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp(),
        });
        dispatch(setUser(userInfo));
      } catch (error) {
        dispatch(setError(`Failed to update last login time : ${error}`));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const logOut = useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      dispatch(clearUser());
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  return {
    user,
    isAuthenticated,
    signUp: {
      mutate: signUp.mutate,
      isPending: signUp.isPending,
      isError: signUp.isError,
      error: signUp.error,
    },
    login: {
      mutate: login.mutate,
      isPending: login.isPending,
      isError: login.isError,
      error: login.error,
    },
    logOut: {
      mutate: logOut.mutate,
      isPending: logOut.isPending,
      isError: logOut.isError,
      error: logOut.error,
    },
  };
};
