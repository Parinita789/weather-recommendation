import { injectable } from 'inversify';

export interface IWeatherUtils {
    dateToString(date: Date): string;
}

@injectable()
export class WeatherUtils implements IWeatherUtils {

  public static dateToString(date: Date): string {
    return (new Date(date)).toString();
  }
}
 