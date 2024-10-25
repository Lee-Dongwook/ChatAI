import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/redux/slice/userSlice';
import type { UserRole } from '@/types';

export const useCheckUserRole = (userId: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const query = useQuery<UserRole, Error>({
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

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setUserRole(query.data));
    }
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.status === 'success' || query.status === 'error') {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    }
  }, [query.status, queryClient, userId]);

  return query;
};
