import express from 'express';
import { inject, injectable } from 'inversify';
import { Server, createServer } from 'http';
import CONFIG from '../config/envConfig';
import { IDENTIFIER } from '../constants/identifier';
import { IBasicMiddleware } from '../middlewares/basicMiddleware';
import { ILoggerUtil } from '../utils/loggerUtil';
import { InternalServerError } from '../utils/errorUtils';
import router from '../routes'
 
export interface IHttpService {
  httpServer: Server;
  initializeServer(): Promise<void>;
}

@injectable()
export class HttpService implements IHttpService {
  private logger: ILoggerUtil;
  private basicMiddleware: IBasicMiddleware;
  public httpServer: Server;
  public app: express.Express;

  constructor(
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.BasicMiddleware) basicMiddleware: IBasicMiddleware,
  ) {
    this.logger = logger;
    this.basicMiddleware = basicMiddleware;
  }
  
  public async initializeServer(): Promise<void> {
    this.app = express();

    this.httpServer = createServer(this.app);
    this.basicMiddleware.initializeMiddlewares(this.app); // registering middlewares
    this.httpServer.setTimeout(CONFIG.SERVER_TIMEOUT);
    router(this.app);
    
    this.httpServer.keepAliveTimeout = CONFIG.KEEP_ALIVE_TIMEOUT; // ms
    try {
      this.httpServer.listen(CONFIG.PORT, () => {
        return this.logger.info(`server is listening on ${CONFIG.PORT}`)
      });
    } catch (err) {
      this.logger.error(`err in httpService initializeServer - ${err}`);
      throw new InternalServerError('err in initializeServer', err);
    }
  }
}
