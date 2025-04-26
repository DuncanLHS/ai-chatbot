-- Initialize schema for AI Chatbot
-- This migration consolidates all the Drizzle migrations into a single Supabase migration

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" varchar(64) NOT NULL,
    "password" varchar(64)
);

-- Create Chat table
CREATE TABLE IF NOT EXISTS "Chat" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp NOT NULL,
    "title" text NOT NULL,
    "userId" uuid NOT NULL,
    "visibility" varchar DEFAULT 'private' NOT NULL,
    CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Document table with composite primary key
CREATE TABLE IF NOT EXISTS "Document" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp NOT NULL,
    "title" text NOT NULL,
    "content" text,
    "kind" varchar DEFAULT 'text' NOT NULL, -- Note: renamed from "text" to "kind" to match schema.ts
    "userId" uuid NOT NULL,
    CONSTRAINT "Document_id_createdAt_pk" PRIMARY KEY("id","createdAt"),
    CONSTRAINT "Document_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Suggestion table
CREATE TABLE IF NOT EXISTS "Suggestion" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "documentId" uuid NOT NULL,
    "documentCreatedAt" timestamp NOT NULL,
    "originalText" text NOT NULL,
    "suggestedText" text NOT NULL,
    "description" text,
    "isResolved" boolean DEFAULT false NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp NOT NULL,
    CONSTRAINT "Suggestion_id_pk" PRIMARY KEY("id"),
    CONSTRAINT "Suggestion_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "Document"("id","createdAt") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Message table (deprecated)
CREATE TABLE IF NOT EXISTS "Message" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "chatId" uuid NOT NULL,
    "role" varchar NOT NULL,
    "content" json NOT NULL,
    "createdAt" timestamp NOT NULL,
    CONSTRAINT "Message_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Vote table (deprecated)
CREATE TABLE IF NOT EXISTS "Vote" (
    "chatId" uuid NOT NULL,
    "messageId" uuid NOT NULL,
    "isUpvoted" boolean NOT NULL,
    CONSTRAINT "Vote_chatId_messageId_pk" PRIMARY KEY("chatId","messageId"),
    CONSTRAINT "Vote_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Vote_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Message_v2 table
CREATE TABLE IF NOT EXISTS "Message_v2" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "chatId" uuid NOT NULL,
    "role" varchar NOT NULL,
    "parts" json NOT NULL,
    "attachments" json NOT NULL,
    "createdAt" timestamp NOT NULL,
    CONSTRAINT "Message_v2_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Vote_v2 table
CREATE TABLE IF NOT EXISTS "Vote_v2" (
    "chatId" uuid NOT NULL,
    "messageId" uuid NOT NULL,
    "isUpvoted" boolean NOT NULL,
    CONSTRAINT "Vote_v2_chatId_messageId_pk" PRIMARY KEY("chatId","messageId"),
    CONSTRAINT "Vote_v2_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Vote_v2_messageId_Message_v2_id_fk" FOREIGN KEY ("messageId") REFERENCES "Message_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Add comments to mark deprecated schema components
COMMENT ON TABLE "Message" IS 'DEPRECATED: This table is deprecated and will be replaced with Message_v2';
COMMENT ON TABLE "Vote" IS 'DEPRECATED: This table is deprecated and will be replaced with Vote_v2';
