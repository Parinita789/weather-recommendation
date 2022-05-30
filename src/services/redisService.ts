import { injectable, inject } from 'inversify';
import { ClientOpts, createClient, RedisClient } from 'redis';
import CONFIG from '../config/envConfig';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IDENTIFIER } from '../constants/identifier';

export interface IRedisService {
  initializeClient(): Promise<void>;
  shutdownClient(): Promise<void>;
  setKey(key: string, value: string, expires?: number): Promise<void>;
  getKey(key: string): Promise<string>
  expireKeyAt(key: string, unixTimestamp: number): Promise<void>;
}

@injectable()
export class RedisService implements IRedisService {
  private logger;
  private redisClient: RedisClient;
  private redisCONFIG: any;

  constructor(
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil
  ) {
    this.logger = logger;
    this.redisCONFIG = CONFIG.REDIS;
  }

  /**
  * @publc @async
  * @description Creates redis client connection
  */
  public async initializeClient(): Promise<void> {
    const connectionOptions: ClientOpts = {
      retry_strategy: this.retryStrategy,
      socket_keepalive: true,
    };

    this.redisClient = createClient(this.redisCONFIG.PORT, this.redisCONFIG.HOST, connectionOptions);

    this.redisClient.on('connect', () => {
      this.logger.info('Redis connected.');
    });
    this.redisClient.on('ready', () => {
      this.logger.info('Redis connection established.');
    });
    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis Error ${err.message}`);
    });
    this.redisClient.on('reconnecting', () => {
      this.logger.info('Redis client reconnecting to redis server');
    });
    this.redisClient.on('end', () => {
      this.logger.info('Redis disconnected');
    });
  }

  public async shutdownClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.quit((err, obj) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async setKey(key: string, value: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (err, result) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async getKey(key: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, result) => {
        if (err) reject(err);
        resolve(JSON.parse(result));
      });
    });
  }

  public async expireKeyAt(key: string, unixTimestamp: number): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.redisClient.expireat(key, unixTimestamp, (err, obj) => {
        if (err) reject(err);
        return resolve();
      });
    });
  }

  private retryStrategy(options): any {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
}