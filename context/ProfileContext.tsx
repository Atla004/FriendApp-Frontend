import { createContext, useContext, useEffect, useState } from 'react';

export interface Profile {
  ready: boolean;
  photo: string[] | null;
  bio: string | null;
  gender: string | null;
  birthDate: Date | null;
  email: string;
  full_name?: string;
  country?: string;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
}



const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    ready: false,
    photo: null,
    bio: "",
    gender: null,
    birthDate: null,
    email: '',
    country: '6759e641c14dec93250d8190',
    full_name: ''
  });

  const updateProfile = (updates: Partial<Profile>) => {

    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      newProfile.ready = Boolean(
        newProfile.bio && 
        newProfile.gender && 
        newProfile.birthDate &&
        newProfile.photo &&
        newProfile.full_name 
      );
      return newProfile;
    });

  };

  useEffect(() => {
    console.log("Profile context se cambio", profile);
  }, [profile]);


  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}