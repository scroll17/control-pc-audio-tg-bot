export default () => {
  const PORT = parseInt(process.env.PORT, 10);

  const telegram = {
    webhook: process.env.TELEGRAM_WEBHOOK,
    token: process.env.TELEGRAM_TOKEN,
    botName: process.env.TELEGRAM_BOT_NAME,
  };

  return {
    port: PORT,
    host: `http://localhost:${PORT}`,
    env: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    telegram,
  };
};
