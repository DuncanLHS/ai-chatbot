import 'server-only';

import type { ArtifactKind } from '@/components/artifact';
import type { User } from '@supabase/supabase-js';
import { createClient } from '../supabase/server';
import type { Tables, TablesInsert } from './database.types';

export async function getUser(): Promise<User | undefined> {
  const superbase = await createClient();
  const {
    data: { user },
  } = await superbase.auth.getUser();

  return user ?? undefined;
}

export async function saveChat({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat')
    .insert({
      id,
      title,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
  return data;
}

export async function deleteChatById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to delete chat in database', error);
    throw error;
  }

  return data;
}

export async function getMyChats({
  limit,
  startingAfter,
  endingBefore,
}: {
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const supabase = await createClient();

    const user = await getUser();

    if (!user) {
      throw new Error('User not found');
    }
    
    const extendedLimit = limit + 1;

    const query = async (createdAtCondition?: string, comparison?: 'gt' | 'lt') => {
      let queryBuilder = supabase
        .from('chat')
        .select('*')
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false })
        .limit(extendedLimit);
      
      if (createdAtCondition && comparison) {
        queryBuilder = queryBuilder[comparison]('created_at', createdAtCondition);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    };

    let filteredChats: Tables<'chat'>[] = [];

    if (startingAfter) {
      const { data: selectedChat, error } = await supabase
        .from('chat')
        .select('*')
        .eq('id', startingAfter)
        .limit(1)
        .single();

      if (error || !selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(selectedChat.createdAt, 'gt');
    } else if (endingBefore) {
      const { data: selectedChat, error } = await supabase
        .from('chat')
        .select('*')
        .eq('id', endingBefore)
        .limit(1)
        .single();

      if (error || !selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(selectedChat.createdAt, 'lt');
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to get chats by user from database', error);
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Failed to get chat by id from database', error);
    throw error;
  }
  return data;

}

export async function saveMessages({
  messages,
}: {
  messages: TablesInsert<'message'>[];
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('message')
    .insert(messages)
    .select()
    
  if (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
  return data;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('chatId', id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
  return data;
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vote')
    .upsert({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    })
    .select()
    .single();
  if (error) {
    console.error('Failed to vote message in database', error);
    throw error;
  }
  return data;
  
}

export async function getVotesByChatId({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vote')
    .select('*')
    .eq('chatId', id)

  if (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
  return data;
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
}) {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('document')
    .insert({
      id,
      title,
      kind,
      content,
    })
    .select()
    .single();
  if (error) {
    console.error('Failed to save document in database', error);
    throw error;
  }
  return data;
  
}

export async function getDocumentsById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('document')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to get document by id from database', error);
    throw error;
  }
  return data;
}

export async function getDocumentById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('document')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Failed to get document by id from database', error);
    throw error;
  }
  return data;
  
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('document')
    .delete()
    .eq('id', id)
    .gt('created_at', timestamp)
    .select()
  if (error) {
    console.error('Failed to delete documents by id from database', error);
    throw error;
  }
  return data;
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: TablesInsert<'suggestion'>[];
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suggestion')
    .insert(suggestions)
    .select()
    .single();

  if (error) {
    console.error('Failed to save suggestions in database', error);
    throw error;
  }
  return data;
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suggestion')
    .select('*')
    .eq('documentId', documentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Failed to get suggestions by document version from database',
      error,
    );
    throw error;
  }
  return data;
}

export async function getMessageById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to get message by id from database', error);
    throw error;
  }
  return data;
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('message')
    .delete()
    .eq('chatId', chatId)
    .gt('created_at', timestamp)
    .select()

  if (error) {
    console.error('Failed to delete messages by chat id from database', error);
    throw error;
  }
  return data;
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat')
    .update({ visibility })
    .eq('id', chatId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update chat visibility in database', error);
    throw error;
  }
  return data;
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('message')
    .select('*', {count: 'exact', head: true})
    .eq('userId', id)
    .gte('created_at', new Date(Date.now() - differenceInHours * 60 * 60 * 1000))
    .single();
  if (error) {
    console.error(
      'Failed to get message count by user id for the last 24 hours from database')
    throw error;
  }
  return count ?? 0;
  
}
