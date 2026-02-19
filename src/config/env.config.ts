export const envConfig = () => ({
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGODB,
  rateLimit: process.env.RATE_LIMIT || 15,
});
