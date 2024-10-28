'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChatContainer } from '@/components/containers/ChatContainer';

export default function ChatSessionPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { sessionId } = useParams();

  const sessionIdStr = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/');
    }
  }, [isAuthenticated, router]);

  if (!sessionId) {
    return <p className="text-red-500">Invalid session. Please try again.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat Session</h1>
      <ChatContainer sessionId={sessionIdStr} />
    </div>
  );
}
