import { Express } from 'express';
import bodyParser from 'body-parser';
import { injectable, inject } from 'inversify';
import { CONSTANTS } from '../constants/common';
import { IDENTIFIER } from '../constants/identifier';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IErrorHandlerMiddleware } from './errorHandlerMiddleware';

export interface IBasicMiddleware {
  initializeMiddlewares(app: Express): Promise<void>;
}

@injectable()
export class BasicMiddleware { 
  private logger;
  private errorHandler
  constructor (
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.ErrorHandlerMiddleware) errorHandler: IErrorHandlerMiddleware
  ) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  public async initializeMiddlewares(app: Express): Promise<void> {
    try {  
      app.use(bodyParser.json({
        limit : CONSTANTS.BODY_LIMIT
      }));      
      app.use(this.errorHandler.handleError) //handling erorrs
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}