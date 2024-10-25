import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatMessage, MessageType } from '@/types';

interface SendMessageParams {
  sessionId: string;
  message: string;
  sender: 'user' | 'bot';
  type: MessageType;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      message,
      sender,
      type,
    }: SendMessageParams) => {
      const newMessage: Omit<ChatMessage, 'id'> = {
        message,
        sender,
        createdAt: serverTimestamp() as Timestamp,
        type,
      };

      const messageRef = collection(db, 'chats', sessionId, 'messages');
      await addDoc(messageRef, newMessage);
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId] });
    },
  });
};
