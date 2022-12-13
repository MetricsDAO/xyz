function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export default {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  SESSION_SECRET: requireEnv("SESSION_SECRET"),
  ENVIRONMENT: requireEnv("ENVIRONMENT"),
};
