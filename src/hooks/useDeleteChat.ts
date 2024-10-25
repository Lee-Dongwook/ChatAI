import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const useDeleteChat = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const chatRef = doc(db, 'chats', sessionId);
      await deleteDoc(chatRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions', userId] });
    },
  });
};
