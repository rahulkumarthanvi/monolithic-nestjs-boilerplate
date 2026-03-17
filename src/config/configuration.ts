export const configuration = () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  },
  database: {
    uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest_boilerplate',
  },
  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET ?? 'access_secret',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh_secret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY ?? '15m',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY ?? '7d',
  },
});

