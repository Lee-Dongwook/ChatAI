import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '@/redux/slice/authSlice';
import type { User } from '@/types';

interface UpdateProfileProps {
  name: string;
  profilePicture?: File | null;
}

export const useUpdateUserProfile = (userId: string) => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async ({ name, profilePicture }: UpdateProfileProps) => {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userDocSnap.data() as User;

      const updates: Partial<User> = {
        name,
      };

      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${userId}`);
        await uploadBytes(storageRef, profilePicture);
        const downloadURL = await getDownloadURL(storageRef);
        updates.profilePicture = downloadURL;
      }

      await updateDoc(userDocRef, updates);

      const updatedUserData: User = {
        ...userData,
        ...updates,
      };

      return updatedUserData;
    },
    onSuccess: (updatedUserData) => {
      dispatch(setUser(updatedUserData));
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });
  return {
    updateProfile: mutation.mutate,
    isPending: mutation.isPending,
  };
};
