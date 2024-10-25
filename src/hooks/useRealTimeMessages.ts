import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatMessage } from '@/types';

export const useRealTimeMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const messageRef = collection(db, 'chats', sessionId, 'messages');
    const q = query(messageRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as ChatMessage[];
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to get messages:', error);
        setError('메시지를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  return { messages, loading, error };
};
