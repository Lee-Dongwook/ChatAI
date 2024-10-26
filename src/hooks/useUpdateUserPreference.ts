import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import type { UserPreference } from '@/types';
import { setUserPreference } from '@/redux/slice/userSlice';

export const useUpdateUserPreference = (userId: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatePreference: UserPreference) => {
      const docRef = doc(db, 'users', userId);

      await updateDoc(docRef, {
        'preference.theme': updatePreference.theme,
        'preference.language': updatePreference.language,
      });

      return updatePreference;
    },
    onSuccess: (preference) => {
      dispatch(setUserPreference(preference));
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });

  return {
    updatePreference: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
