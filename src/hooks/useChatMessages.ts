import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatMessage } from '@/types';

export const useChatMessages = (sessionId: string) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: ['chatMessages', sessionId],
    queryFn: async () => {
      const messagesRef = collection(db, 'chats', sessionId, 'messages');
      const snapshot = await getDocs(messagesRef);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as ChatMessage[];
    },
    enabled: !!sessionId,
    refetchInterval: 5000,
  });
};
