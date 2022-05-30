import { inject, injectable } from 'inversify';
import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import CONFIG from '../config/envConfig';
import { IAxiosUtil } from '../utils/axiosUtils';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IParsedWeatherData } from '../services/recommendCityService';
import { IWeatherForecast } from '../utils/weatherClientFactory';

type GenericObject = { [key: string]: any };

interface IWeatherData {
  city: GenericObject;
  cnt: number;
  list: GenericObject[]
}

@injectable()
export class OpenWeatherClient implements IWeatherForecast {
  private logger;

  constructor(@inject(IDENTIFIER.Logger) logger: ILoggerUtil) {
    this.logger = logger;    
  }

  async getFiftenDaysWeatherForecast(city: string): Promise<IParsedWeatherData> {
    try {
      const axios = container.get<IAxiosUtil>(IDENTIFIER.Axios);
      const url = `${CONFIG.BASE_OPEN_WEATHER_URL}?q=${city}&cnt=15&appid=${CONFIG.OPEN_WEATHER_MAP_APP_ID}`;

      const weatherData: IWeatherData = await axios.makeRequest<IWeatherData>(url); 
      return this.parseResponse(weatherData);
    } catch (err) {
      this.logger.error(`err in OpenweatherAPIService - getFiftenDaysWeatherForecast - ${err}`);
      throw err;
    }
  }

  private parseResponse(weatherData: IWeatherData): IParsedWeatherData {
    let parsedResponse = {
      city: weatherData.city.name,
      country: weatherData.city.country,
      forecasts: []
    };

    weatherData.list.forEach(data => {
      const forecast = {
        avgTemp: (data.temp.max + data.temp.min) / 2,
        avgHumidity: data.humidity,
        avgRainfall: data.clouds
      }
      parsedResponse.forecasts.push(forecast);
    })

    return parsedResponse;
  }
}