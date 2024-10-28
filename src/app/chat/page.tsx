'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChatSessions } from '@/hooks/useChatSessions';
import { Spinner } from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    data: chatSessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useChatSessions(user?.userId || '');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (sessionsLoading) {
    return <Spinner />;
  }

  if (sessionsError) {
    return <p className="text-red-500">Failed to load chat sessions.</p>;
  }

  if (chatSessions.length === 0) {
    return <p className="text-gray-500">You have no active now.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      <ul>
        {chatSessions.map((session) => (
          <li key={session.id} className="border-b p-2">
            <Button
              className="text-blue-500 underline"
              onClick={() => router.push(`/chat/${session.id}`)}
            >
              {session.sessionName || `Session ${session.id}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
