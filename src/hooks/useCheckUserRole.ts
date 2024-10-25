import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { UserRole } from '@/types';

export const useCheckUserRole = (userId: string) => {
  return useQuery<UserRole, Error>({
    queryKey: ['checkUserRole', userId],
    queryFn: async () => {
      const userDocRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        return snapshot.data().role as UserRole;
      } else {
        throw new Error('User role not found');
      }
    },
    enabled: !!userId,
  });
};
