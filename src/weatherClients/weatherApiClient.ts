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
  location: GenericObject;
  current: GenericObject;
  forecast: GenericObject;
}

@injectable()
export class WeatherAPIClient implements IWeatherForecast {
  private logger;

  constructor(@inject(IDENTIFIER.Logger) logger: ILoggerUtil) {
    this.logger = logger;    
  }

  async getFiftenDaysWeatherForecast(city: string): Promise<IParsedWeatherData> {
    try {
      const axios = container.get<IAxiosUtil>(IDENTIFIER.Axios);
      // can get upto 3 days data in the free plan
      const url = `${CONFIG.BASE_WEATHER_API_URL}?key=${CONFIG.WEATHER_API_APP_ID}&&q=${city}&days=3&aqi=no&alerts=no`;
      
      const weatherData: IWeatherData = await axios.makeRequest<IWeatherData>(url); 
      return this.parseResponse(weatherData);
    } catch (err) {
      this.logger.error(`err in WeatherAPIService - getFiftenDaysWeatherForecast - ${err}`);
      throw err;
    }
  }

  private parseResponse(weatherData: IWeatherData): IParsedWeatherData {
    let transformedResponse = {
      city: weatherData.location.name,
      country: weatherData.location.country,
      forecasts: []
    }
    weatherData?.forecast?.forecastday?.forEach(day => {
      let forecast = {
        avgTemp: day.day.avgtemp_c,
        avgHumidity: day.day.avghumidity,
        avgRainfall: day.day.daily_chance_of_rain
      }
      transformedResponse.forecasts.push(forecast);
    });
    
    transformedResponse.forecasts.push({
      avgTemp: weatherData.current.temp_c,
      avgHumidity: weatherData.current.humidity,
      avgRainfall: weatherData.current.cloud
    })

    return transformedResponse;
  }
}