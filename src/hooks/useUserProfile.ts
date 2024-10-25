import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { User } from '@/types';

export const useUserProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      return userDoc.data() as User;
    },
    enabled: !!userId,
  });
};
