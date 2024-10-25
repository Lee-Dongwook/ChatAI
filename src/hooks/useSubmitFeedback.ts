import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Feedback } from '@/types';

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: Omit<Feedback, 'createdAt'>) => {
      const newFeedback = {
        ...feedback,
        createdAt: serverTimestamp() as Timestamp,
      };
      await addDoc(collection(db, 'feedback'), newFeedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFeedback'] });
    },
  });
};
