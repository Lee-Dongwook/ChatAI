import { useMutation } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Analytics, AnalyticsEvent } from '@/types';

export const useAnalytics = () => {
  return useMutation({
    mutationFn: async (data: Omit<Analytics, 'createdAt'>) => {
      const newEvent: Analytics = {
        ...data,
        createdAt: serverTimestamp() as Timestamp,
      };

      await addDoc(collection(db, 'analytics'), newEvent);
    },
  });
};
