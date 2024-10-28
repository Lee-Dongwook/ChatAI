import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatSession } from '@/types';

export const useChatSessions = (userId: string) => {
  return useQuery<ChatSession[], Error>({
    queryKey: ['chatSessions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const sessionRef = collection(db, 'chats');
      const q = query(sessionRef, where('userIds', 'array-contains', userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as ChatSession[];
    },
    enabled: !!userId,
  });
};
