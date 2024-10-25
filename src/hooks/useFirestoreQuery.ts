import { useQuery } from '@tanstack/react-query';
import { Query, getDocs } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

export const useFirestoreQuery = <T>(
  queryKey: string,
  firestoreQuery: Query<DocumentData>
) => {
  return useQuery<T[], Error>({
    queryKey: [queryKey],
    queryFn: async () => {
      const snapshot = await getDocs(firestoreQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    },
    staleTime: 1000 * 60 * 10,
  });
};
