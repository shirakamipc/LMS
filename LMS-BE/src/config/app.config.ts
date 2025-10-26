export type AppConfig = {
  port: number;
  nodeEnv: string;
  logLevel: string;
};

export const loadAppConfig = (): AppConfig => {
  const port = Number(process.env.PORT ?? 3000);
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const logLevel = process.env.LOG_LEVEL ?? 'log';

  return { port, nodeEnv, logLevel };
};


