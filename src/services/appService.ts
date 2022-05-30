import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IHttpService } from '../services/httpService';
import { IRedisService } from '../services/redisService';
import { IReadLineService } from './readLineService';

export interface IApplication {
  initializeApplication(): Promise<void>;
}

@injectable()
export class Application implements IApplication { 
  private logger;
  private httpService;
  private redisService;
  private readLineService;

  constructor(
    @inject(IDENTIFIER.RedisService) redisService: IRedisService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.HttpService) httpService: IHttpService,
    @inject(IDENTIFIER.ReadLineService) readLineService: IReadLineService,
  ) {
    this.redisService = redisService;
    this.logger = logger;
    this.httpService = httpService;
    this.readLineService = readLineService;
  }

  public async initializeApplication(): Promise<void> {
    try {  
      await this.redisService.initializeClient();
      await this.httpService.initializeServer();
      setTimeout(()=> {
        this.readLineService.takeInput();
      }, 2000)
      this.logger.info('Application Started');
    } catch (error) {
      this.logger.error(`error in applicationService initializeApplication - ${error}`);
      this.gracefulShutdown();
    }
  }

  public gracefulShutdown(): void {
    this.httpService.httpServer.close(() => {
      this.redisService.shutdownClient();
      process.exit(1);
    })
  }
}