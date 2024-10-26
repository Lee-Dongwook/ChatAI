import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { UserCard } from '@/components/molecules/UserCard';
import { UserPreferenceForm } from '@/components/molecules/UserPreferenceForm';
import type { User, UserPreference } from '@/types';

interface UserProfileLayoutProps {
  user: User;
  isProfileUpdating: boolean;
  isPreferenceUpdating: boolean;
  onProfileSave: (profileData: {
    name: string;
    profilePicture?: File | null;
  }) => void;
  onPreferenceSave: (preference: UserPreference) => void;
}

export const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({
  user,
  isProfileUpdating,
  isPreferenceUpdating,
  onProfileSave,
  onPreferenceSave,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [profilePicture, setProfilePicture] = useState<File | undefined>(
    undefined
  );
  const [theme] = useState<UserPreference['theme']>(
    user.preference.theme || 'light'
  );
  const [language] = useState<UserPreference['language']>(
    user.preference.language || 'en'
  );

  const handleProfileSave = () => {
    onProfileSave({ name, profilePicture });
  };

  const handlePreferenceSave = () => {
    onPreferenceSave({ theme, language });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeProfilePicture = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <UserCard
        name={user.name}
        email={user.email}
        profilePicture={user.profilePicture}
        role={user.role}
        lastLogin={user.lastLogin}
      />

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Update Profile</h2>
        <Input
          type="text"
          value={name}
          onChange={handleChangeName}
          placeholder="Enter your name"
          className="p-2 border rounded-lg"
        />
        <Input
          type="file"
          onChange={handleChangeProfilePicture}
          className="p-2 border rounded-lg"
        />
        <Button onClick={handleProfileSave} disabled={isProfileUpdating}>
          {isProfileUpdating ? 'Updating...' : 'Save Profile'}
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <UserPreferenceForm
          initialTheme={user.preference.theme}
          initialLanguage={user.preference.language}
          onSave={handlePreferenceSave}
        />
      </div>
      {isPreferenceUpdating && <p>Updating preferences...</p>}
    </div>
  );
};
