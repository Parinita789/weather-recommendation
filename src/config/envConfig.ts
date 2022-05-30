import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV : process.env.NODE_ENV,
  PORT : Number(process.env.PORT),
  KEEP_ALIVE_TIMEOUT : Number(process.env.KEEP_ALIVE_TIMEOUT),
  SERVER_TIMEOUT: Number(process.env.SERVER_TIMEOUT),
  REDIS:  {
    HOST: Number(process.env.REDIS_HOST),
    PORT: Number(process.env.REDIS_PORT)
  },
  BASE_OPEN_WEATHER_URL: process.env.BASE_OPEN_WEATHER_URL,
  BASE_ACCU_WEATHER_URL: process.env.BASE_ACCU_WEATHER_URL,
  BASE_WEATHER_API_URL: process.env.BASE_WEATHER_API_URL,
  OPEN_WEATHER_MAP_APP_ID: process.env.OPEN_WEATHER_MAP_APP_ID,
  ACCU_WEATHER_APP_ID: process.env.ACCU_WEATHER_APP_ID,
  WEATHER_API_APP_ID: process.env.WEATHER_API_APP_ID,
  WEATHER_CLIENT: process.env.WEATHER_CLIENT
}