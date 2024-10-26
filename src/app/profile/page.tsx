'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileContainer } from '@/components/containers/UserProfileContainer';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <p className="text-red-500">User not found. Please log in.</p>;
  }

  return <UserProfileContainer userId={user.userId} />;
}
