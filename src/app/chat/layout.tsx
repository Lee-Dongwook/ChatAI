import React from 'react';

export const metadata = {
  title: 'Chat',
};

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Chat Sessions</h1>
      </header>
      <main className="flex-grow overflow-y-auto bg-gray-100">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </main>
    </div>
  );
}
