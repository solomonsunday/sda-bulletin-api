require('dotenv').config();

export const EnvironmentConfig = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  TABLE_NAME: process.env.TABLE_NAME,
  TOP_SECRET: process.env.TOP_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
} as const;
