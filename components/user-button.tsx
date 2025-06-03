'use client';

import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

interface UserButtonProps {
  isAnonymous: boolean;
}

export const UserButton = ({ isAnonymous }: UserButtonProps) => {
  const logout = () => {
    const supabase = createClient();
    supabase.auth.signOut();
    return redirect('/');
  };

  return (
    <button
      type="button"
      className="w-full cursor-pointer"
      onClick={() => {
        if (isAnonymous) {
          redirect('/login');
        } else {
          logout();
        }
      }}
    >
      {isAnonymous ? 'Login to your account' : 'Sign out'}
    </button>
  );
};
