import { config } from 'dotenv';

config();

function loadFromEnv(varName: string): string {
  const envVar = process.env[varName];
  if (!envVar) {
    throw new Error(`Missing ${varName} in vars!`);
  }
  return envVar;
}

export const JWT_SECRET = loadFromEnv('JWT_SECRET');

export const DB_HOST = loadFromEnv('DB_HOST');
