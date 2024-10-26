import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  name?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  size = 40,
  name,
  className,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return '';
    const words = name
      .split(' ')
      .map((word) => word[0])
      .join('');
    return words.toUpperCase();
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gray-200 text-white font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
