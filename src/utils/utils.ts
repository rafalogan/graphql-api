import { config } from 'dotenv';

export const execDotenv = () => {
  if (process.env.NODE_ENV === 'test') return config({ path: '.env.test' });
  if (isDev()) return config();
  return;
};

export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV.includes('dev');
