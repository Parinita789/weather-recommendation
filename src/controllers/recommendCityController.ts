import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import { IRecommendCityService } from '../services/recommendCityService';
import { BadRequestError } from '../utils/errorUtils';
import { COUNTRY_CODE_MAP } from '../constants/countryCodeMap';

import { ERROR_CONSTANTS, ERROR_NAMES } from '../constants/error';
import { RESPONSE_CONSTANTS, RESPONSE_MESSAGE } from '../constants/response'

export interface IRecommendCityController {
  getRecommendedCities(req: Request, res: Response, next: NextFunction): Promise<any>
}

@injectable()
export class RecommendCityContoller implements IRecommendCityController {

  async getRecommendedCities(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const recommendedCityService = container.get<IRecommendCityService>(IDENTIFIER.RecommendCityService);
      const country: string = (req.query as any)?.country;
      
      if (!country) {
        throw new BadRequestError(ERROR_NAMES.VALIDATION_ERROR, ERROR_CONSTANTS.COUNTRY_NAME_REQUIRED);
      }
      
      const countryCode: string = COUNTRY_CODE_MAP[country.toUpperCase()];

      if (!countryCode) {
        throw new BadRequestError(ERROR_NAMES.VALIDATION_ERROR, ERROR_CONSTANTS.COUNTRY_NOT_FOUND);
      }
      
      const cities = await recommendedCityService.getRecommendedCities(countryCode);
            
      res.send({ 
        status: RESPONSE_CONSTANTS.SUCCESS,
        message: RESPONSE_MESSAGE.RECOMMENDED_CITIES_FETCHED_SUCCESSFULLY, 
        data: cities
      });
    } catch (err) {
      next(err)
    }
  }
    
}