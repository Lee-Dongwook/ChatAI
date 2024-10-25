import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { Feedback } from '@/types';

export const useUserFeedback = (userId: string) => {
  return useQuery<Feedback[], Error>({
    queryKey: ['userFeedback', userId],
    queryFn: async () => {
      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as Feedback[];
    },
    enabled: !!userId,
  });
};
