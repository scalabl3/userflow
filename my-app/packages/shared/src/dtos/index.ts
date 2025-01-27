import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

// Export LoginProvider DTOs
export * from './LoginProvider/CreateLoginProviderDto';
export * from './LoginProvider/UpdateLoginProviderDto';
export * from './LoginProvider/ResponseLoginProviderDto';
