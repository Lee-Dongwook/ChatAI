import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatSession } from '@/types';

export const useUserChats = (userId: string) => {
  return useQuery<ChatSession[], Error>({
    queryKey: ['userChats', userId],
    queryFn: async () => {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as ChatSession[];
    },
    enabled: !!userId,
  });
};
