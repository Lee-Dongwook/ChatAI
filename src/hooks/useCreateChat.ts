import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import type { ChatSession } from '@/types';

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionName: string) => {
      const newChat: ChatSession = {
        sessionName,
        createdAt: serverTimestamp() as Timestamp,
        lastActivity: serverTimestamp() as Timestamp,
      };
      const docRef = await addDoc(collection(db, 'chats'), newChat);
      return { ...newChat, id: docRef.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
    },
  });
};
