import React, { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile';
import { useUpdateUserPreference } from '@/hooks/useUpdateUserPreference';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { Input } from '@/components/atoms/Input';
import { UserCard } from '@/components/molecules/UserCard';
import { UserPreferenceForm } from '@/components/molecules/UserPreferenceForm';
import type { UserPreference } from '@/types';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: user, isLoading, isError } = useUserProfile(userId);
  const { updateProfile, isPending: isProfileUpdating } =
    useUpdateUserProfile(userId);

  const { updatePreference, isPending: isPreferenceUpdating } =
    useUpdateUserPreference(userId);

  const [name, setName] = useState<string>(user?.name || '');
  const [profilePicture, setProfilePicture] = useState<File | undefined>(
    undefined
  );
  const [theme] = useState<UserPreference['theme']>(
    user?.preference.theme || 'light'
  );
  const [language] = useState<UserPreference['language']>(
    user?.preference.language || 'en'
  );

  const handleProfileSave = () => {
    updateProfile({ name, profilePicture });
  };

  const handlePreferenceSave = () => {
    updatePreference({ theme, language });
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

  if (isLoading) return <Spinner />;
  if (isError || !user)
    return <p className="text-red-500">Failed to load user profile.</p>;

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
        <Button
          onClick={handleProfileSave}
          disabled={isProfileUpdating || isLoading}
        >
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
