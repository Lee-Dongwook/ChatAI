import React from 'react';

export const metadata = {
  title: 'User Profile',
  description: 'View and edit your user profile',
};

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-4">{children}</div>
    </div>
  );
}
