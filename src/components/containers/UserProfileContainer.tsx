import React from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { UserProfileLayout } from '@/components/organisms/UserProfileLayout';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile';
import { useUpdateUserPreference } from '@/hooks/useUpdateUserPreference';

interface UserProfileContainerProps {
  userId: string;
}

const UserProfileContainer: React.FC<UserProfileContainerProps> = ({
  userId,
}) => {
  const { data: user, isLoading, isError } = useUserProfile(userId);

  const { updateProfile, isPending: isProfileUpdating } =
    useUpdateUserProfile(userId);

  const { updatePreference, isPending: isPreferenceUpdating } =
    useUpdateUserPreference(userId);

  if (isLoading) return <Spinner />;

  if (isError || !user)
    return (
      <p className="text-red-500">
        Failed to load user profile. Please try again later.
      </p>
    );

  return (
    <UserProfileLayout
      user={user}
      isProfileUpdating={isProfileUpdating}
      isPreferenceUpdating={isPreferenceUpdating}
      onProfileSave={updateProfile}
      onPreferenceSave={updatePreference}
    />
  );
};

export default UserProfileContainer;
