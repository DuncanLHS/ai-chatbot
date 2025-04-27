import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { getUser } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user =  await getUser();

  if (!user) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
          userType={user.is_anonymous ? 'guest' : 'regular'}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
        userType={user.is_anonymous ? 'guest' : 'regular'}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
