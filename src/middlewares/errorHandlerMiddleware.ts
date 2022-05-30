import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { BadRequestError,
  PageNotFound,
  InternalServerError
} from '../utils/errorUtils';

export interface IErrorHandlerMiddleware {
  handleError(err, req: Request, res: Response, next: NextFunction): void
}

@injectable()
export class ErrorHandlerMiddleware {

  private getHttpStatusCode (err) {
    let status;
    switch (err) {
      case err instanceof BadRequestError:
        status = HTTP_STATUS_CODES.BAD_REQUEST; 
        break;
      case err instanceof PageNotFound:
        status = HTTP_STATUS_CODES.NOT_FOUND; 
        break;
      case err instanceof InternalServerError:
        status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR; 
        break;  
      default:
        status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
    return status;
  }

  public handleError(err, req: Request, res: Response, next: NextFunction): void {
    console.log("\n\ncalled >>>>>> ", err)
    const status = this.getHttpStatusCode(err);
    res.status(status).json({
      message: err.message,
      name: err.name
    })
  }

}
