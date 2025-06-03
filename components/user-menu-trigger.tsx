'use client';

import { ChevronUp } from 'lucide-react';
import Image from 'next/image';

export interface UserMenuTriggerProps {
  userEmail: string | null;
  isAnonymous: boolean;
}

export const UserMenuTrigger = ({
  userEmail,
  isAnonymous,
}: UserMenuTriggerProps) => {
  return (
    <>
      {userEmail && (
        <Image
          src={`https://avatar.vercel.sh/${userEmail}`}
          alt={userEmail ?? 'User Avatar'}
          width={24}
          height={24}
          className="rounded-full"
        />
      )}
      <span data-testid="user-email" className="truncate">
        {isAnonymous ? 'Guest' : userEmail || 'test'}
      </span>

      <ChevronUp className="ml-auto" />
    </>
  );
};
