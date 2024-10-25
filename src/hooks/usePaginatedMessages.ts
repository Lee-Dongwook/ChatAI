import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatMessage } from '@/types';

export const usePaginatedMessages = (sessionId: string, pageSize = 10) => {
  return useInfiniteQuery<
    {
      messages: ChatMessage[];
      nextPage: QueryDocumentSnapshot<DocumentData> | null;
    },
    Error
  >({
    queryKey: ['paginatedMessages', sessionId],
    queryFn: async ({ pageParam = null }) => {
      const messagesRef = collection(db, 'chats', sessionId, 'messages');
      const q = query(
        messagesRef,
        orderBy('createdAt', 'asc'),
        limit(pageSize),
        ...(pageParam ? [startAfter(pageParam)] : [])
      );
      const snapshot = await getDocs(q);

      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as ChatMessage[];

      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      return {
        messages,
        nextPage: lastVisibleDoc,
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    enabled: !!sessionId,
  });
};
