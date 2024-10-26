'use client';
import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { Avatar } from '@/components/atoms/Avatar';

interface UserCardProps {
  name: string;
  email: string;
  profilePicture?: string | null;
  role: 'user' | 'admin' | 'premium';
  lastLogin: Timestamp;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  profilePicture,
  role,
  lastLogin,
}: UserCardProps) => {
  const formattedLastLogin = lastLogin.toDate().toString();

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-4 shadow-md">
      <Avatar src={profilePicture} name={name} size={50} className="mr-4" />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{email}</p>
        <p className="text-sm text-gray-400 mt-1">Role: {role}</p>
        <p className="text-xs text-gray-400">
          Last login: {formattedLastLogin}
        </p>
      </div>
    </div>
  );
};
