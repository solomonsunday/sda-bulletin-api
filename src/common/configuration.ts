require('dotenv').config();

export const EnvironmentConfig = {
  APP_ACCESS_KEY_ID: process.env.APP_ACCESS_KEY_ID,
  APP_SECRET_ACCESS_KEY: process.env.APP_SECRET_ACCESS_KEY,
  APP_JWT_SECRET: process.env.APP_JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // TOP_SECRET: process.env.TOP_SECRET,
} as const;
