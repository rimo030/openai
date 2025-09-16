import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import typia, { tags } from 'typia';
import { AIModelsProvider } from './providers/ai-models.provider';

export class GlobalConfig {
  /**
   * 서버의 아이디. 서버가 실행될때 고유한 아이디를 발급.
   */
  public static readonly serverId = randomUUID();

  /**
   * 프리즈마 클라이언트 객체
   */
  public static readonly prisma = new PrismaClient();

  /**
   * 환경 변수
   */
  public static get env(): GlobalConfig.IEnvironments {
    return environments;
  }

  /**
   * OpenAI
   */
  public static get OpenAI(): OpenAI {
    const apiKey = GlobalConfig.env.OPENAI_API_KEY;
    return new OpenAI({ apiKey });
  }

  /**
   * DB 시딩
   */
  public static async seeding() {
    const now = new Date().toISOString();
    await Promise.all([AIModelsProvider.seeding(now)]);
  }
}

export namespace GlobalConfig {
  /**
   * 환경 변수
   */
  export interface IEnvironments {
    // Configuration
    APP_ENV: 'local' | 'development' | 'production';
    PORT: `${number}`;

    // OpenAI
    OPENAI_API_KEY: string & tags.MinLength<1>;

    // JWT
    JWT_SECRET_USER: string & tags.MinLength<1>;
    JWT_EXPIRATION_TIME: string & tags.MinLength<1>;
    JWT_REFRESH_SECRET_USER: string & tags.MinLength<1>;
    JWT_REFRESH_EXPIRATION_TIME: string & tags.MinLength<1>;
  }
}

const map = new Map<string, unknown>();
function createSingleton<T extends (...args: any[]) => any>(key: string, func: T): ReturnType<T> {
  const cache = map.get(key) as ReturnType<T>;
  if (cache) {
    return cache;
  }

  const value = func();
  map.set(key, value);
  return value;
}

const environments = createSingleton('env', () => {
  dotenv.config();
  const env = typia.assert<GlobalConfig.IEnvironments>(process.env);
  return env;
});
