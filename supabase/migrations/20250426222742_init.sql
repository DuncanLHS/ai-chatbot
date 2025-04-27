-- Initialize schema for AI chatbot

create type document_kind AS enum ('text', 'code', 'image', 'sheet');

-- Create chat table
create table public.chat (
  id uuid not null default gen_random_uuid (),
  "createdAt" timestamp without time zone not null default now(),
  title text not null,
  "userId" uuid not null default auth.uid (),
  visibility text not null default 'private',
  constraint chat_pkey primary key (id),
  constraint chat_userId_fkey foreign KEY ("userId") references auth.users (id)
);

-- Create document table with composite primary key
create table public.document (
  id uuid not null default gen_random_uuid (),
  "createdAt" timestamp without time zone not null default now(),
  title text not null,
  content text null,
  kind document_kind not null default 'text',
  "userId" uuid not null default auth.uid (),
  constraint document_id_createdAt_pk primary key (id, "createdAt"),
  constraint document_userId_fkey foreign KEY ("userId") references auth.users (id)
);

-- Create suggestion table
create table public.suggestion (
  id uuid not null default gen_random_uuid (),
  "documentId" uuid not null,
  "documentCreatedAt" timestamp without time zone not null,
  "originalText" text not null,
  "suggestedText" text not null,
  description text null,
  "isResolved" boolean not null default false,
  "userId" uuid not null default auth.uid (),
  "createdAt" timestamp without time zone not null default now(),
  constraint suggestion_id_pk primary key (id),
  constraint suggestion_documentId_documentCreatedAt_document_id_createdAt_f foreign KEY ("documentId", "documentCreatedAt") references public.document (id, "createdAt") on delete CASCADE,
  constraint suggestion_userId_fkey foreign KEY ("userId") references auth.users (id)
);

-- Create message table
create table public.message (
  id uuid not null default gen_random_uuid (),
  "chatId" uuid not null,
  role text not null,
  parts json not null,
  attachments json not null,
  "createdAt" timestamp without time zone not null default now(),
  constraint message_pkey primary key (id),
  constraint message_chatId_chat_id_fk foreign KEY ("chatId") references public.chat (id) on delete CASCADE
);

-- Create vote table
create table public.vote (
  "chatId" uuid not null,
  "messageId" uuid not null,
  "isUpvoted" boolean not null,
  constraint vote_chatId_messageId_pk primary key ("chatId", "messageId"),
  constraint vote_chatId_chat_id_fk foreign KEY ("chatId") references public.chat (id) on delete CASCADE,
  constraint vote_messageId_message_id_fk foreign KEY ("messageId") references public.message (id) on delete CASCADE
);
