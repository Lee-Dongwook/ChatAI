import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import type { UserPreference } from '@/types';
import { setUserPreference } from '@/redux/slice/userSlice';

export const useUpdateUserPreference = (userId: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPreference: UserPreference) => {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { newPreference });
      return newPreference;
    },
    onSuccess: (preference) => {
      dispatch(setUserPreference(preference));
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });
};
