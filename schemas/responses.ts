import { z } from 'zod';

// Login
export const loginBodySchema = z.object({
  username: z.string().min(1).regex(/^\S+$/),
  password: z.string().min(8).regex(/^\S+$/),
});


const UserInfoSchema = z.object({
  bio: z.string().optional(),
  full_name: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  birthdate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
  country: z.string().optional(),
  photos: z.array(z.string()).optional()
});

export const loginResponseSchema = z.object({
  success: z.string(),
  data: z.object({
    user: z.object({
      _id: z.string(),
      username: z.string(),
      email: z.string().email(),
      info: UserInfoSchema.optional(), // Hacer que info sea opcional
    }),
    token: z.string(),
  }),
});

// Register
export const registerBodySchema = z.object({
  username: z.string().min(1).regex(/^\S+$/),
  password: z.string().min(8).regex(/^\S+$/),
  email: z.string().email(),
});

export const registerResponseSchema = z.object({
  success: z.string(),
});

// Create Chat
export const createChatBodySchema = z.object({
  target: z.string(),
});

export const createChatResponseSchema = z.object({
  success: z.string(),
  data: z.object({
    chat_id: z.string(),
  }),
});

// Get Chats
export const getChatsResponseSchema = z.object({
  success: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      users: z.array(
        z.object({
          username: z.string(),
        })
      ),
      __v: z.number(),
      last_message: z.object({
        datetime_sent: z.string(),
        content: z.string(),
        author: z.object({
          username: z.string(),
        }),
      }),
    })
  ),
});

// Send Message
export const sendMessageBodySchema = z.object({
  content: z.string().max(512),
  chat: z.string(),
  datetime_sent: z.string().optional(),
  type: z.enum(["text", "image"]),
});

export const sendMessageResponseSchema = z.object({
  success: z.string(),
});

// Get Messages
export const getMessagesResponseSchema = z.object({
  success: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      datetime_sent: z.string(),
      content: z.string(),
      chat: z.string(),
      author: z.string(),
      type: z.string(),
    })
  ),
});


export type LoginBody = z.infer<typeof loginBodySchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export type CreateChatBody = z.infer<typeof createChatBodySchema>;
export type CreateChatResponse = z.infer<typeof createChatResponseSchema>;

export type GetChatsResponse = z.infer<typeof getChatsResponseSchema>;

export type SendMessageBody = z.infer<typeof sendMessageBodySchema>;
export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>;
