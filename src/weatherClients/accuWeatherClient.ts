import { inject, injectable } from 'inversify';
import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import CONFIG from '../config/envConfig';
import { IAxiosUtil } from '../utils/axiosUtils';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IParsedWeatherData } from '../services/recommendCityService';
import { IWeatherForecast } from '../utils/weatherClientFactory';

export interface IAccuWeatherData {}

@injectable()
export class AccuWeatherClient implements IWeatherForecast {
  private logger;
  constructor(@inject(IDENTIFIER.Logger) logger: ILoggerUtil) {
    this.logger = logger;    
  }

  public async getFiftenDaysWeatherForecast(location: string): Promise<IParsedWeatherData> {
    try {
      const axios = container.get<IAxiosUtil>(IDENTIFIER.Axios);
      const url = `${CONFIG.BASE_ACCU_WEATHER_URL}/${location}?apikey=${CONFIG.ACCU_WEATHER_APP_ID}`;

      const weatherData: IAccuWeatherData = await axios.makeRequest<IAccuWeatherData>(url); 
      return this.parseResponse(weatherData);
    } catch (err) {
      this.logger.error(`err in AccuWeatherService - getFiftenDaysWeatherForecast - ${err}`);
      throw err;
    }
  }

  private parseResponse(weatherData: IAccuWeatherData): IParsedWeatherData {
    // Method to be implemented cannot get response due to invalid apiKey error
    const parsedResponse = {
      city: '',
      country: '',
      forecasts: []
    }
    return parsedResponse;
  }
}