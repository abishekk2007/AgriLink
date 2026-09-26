import cors, { CorsOptions } from 'cors';
import { ENV } from './env.js';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      ENV.CLIENT_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ];

    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev/demo prototype
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
