import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Type your message...',
}) => {
  const [message, SetMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      SetMessage('');
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2">
      <Input
        type="text"
        value={message}
        onChange={handleChangeMessage}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow px-2 py-1 text-sm"
      />
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        className="ml-2 px-3 py-1 text-sm"
      >
        Send
      </Button>
    </div>
  );
};
