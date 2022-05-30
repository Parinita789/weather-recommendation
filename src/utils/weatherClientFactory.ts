import { injectable } from 'inversify';
import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import { WEATHER_CLIENT } from '../constants/weatherClient';
import { IParsedWeatherData } from '../services/recommendCityService';

export interface IWeatherForecast {
  getFiftenDaysWeatherForecast(city: string): Promise<IParsedWeatherData>
}

export interface IWeatherClient {
  getWeatherClient(clientType: WEATHER_CLIENT)
}

@injectable()
export class WeatherClient implements IWeatherClient {

  public getWeatherClient(clientType: WEATHER_CLIENT) {
    switch(clientType) {
      case WEATHER_CLIENT.ACCU_WEATHER:
        return container.get<IWeatherForecast>(IDENTIFIER.AccuWeatherClient);
      case  WEATHER_CLIENT.OPEN_WEATHER_MAP:
        return container.get<IWeatherForecast>(IDENTIFIER.OpenWeatherClient);;
      case WEATHER_CLIENT.WEATHER_API:
        return container.get<IWeatherForecast>(IDENTIFIER.WeatherClient);;
    }
  }
}