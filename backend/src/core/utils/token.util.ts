import { v4 as uuidv4 } from 'uuid';

export function generateEmailToken(): { token: string; expiresAt: Date } {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };
}
