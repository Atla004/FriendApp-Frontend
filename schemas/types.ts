import { z } from 'zod';

const UserInfoSchema = z.object({
  biography: z.string().max(512),
  gender: z.enum(['male', 'female', 'other']),
  birthdate: z.date(),
  country: z.string(), 
  photos: z.array(z.string().url())
});

const UserSchema = z.object({
  _id: z.string(), 
  username: z.string().regex(/^\S+$/),
  password: z.string(),
  email: z.string().email(),
  deleted: z.boolean(),
  info: UserInfoSchema
});

const CountrySchema = z.object({
  _id: z.string(), 
  name: z.string().max(128)
});

const lastMessageSchema = z.object({
  datetime_sent: z.string(),
  content: z.string(),
  author: z.string(),
});

const ChatSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  user: z.string(),
  photo: z.string(),
  last_message: lastMessageSchema.nullable(),
});

const LikeSchema = z.object({
  _id: z.string(), 
  user: z.string(), 
  target: z.string() 
});

const MessageSchema = z.object({
  _id: z.string(), 
  type: z.enum(['text', 'image']),
  content: z.string().max(512),
  chat: z.string(), 
  author: z.string(), 
  datetimeSent: z.date()
});

type UserInfo = z.infer<typeof UserInfoSchema>;
type User = z.infer<typeof UserSchema>;
type Country = z.infer<typeof CountrySchema>;
type Chat = z.infer<typeof ChatSchema>;
type Like = z.infer<typeof LikeSchema>;
type Message = z.infer<typeof MessageSchema>;

// Export schemas and types
export { UserSchema, CountrySchema, ChatSchema, LikeSchema, MessageSchema };
export type { User, UserInfo, Country, Chat, Like, Message };
