import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { UserPreference } from '@/types';

export const useUpdateUserPreference = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPreference: UserPreference) => {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { newPreference });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });
};
