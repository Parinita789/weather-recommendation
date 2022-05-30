import { injectable } from 'inversify';
import { IParsedWeatherData } from './recommendCityService';
import { WEATHER_SCORE, WEATHER_CONDITION } from '../constants/weather'

export interface IWeatherPredictorService {
  getCityWeatherConditon(weatherData: IParsedWeatherData): ICityScore;
}

export interface ICityScore {
  city: string,
  score: number 
}

@injectable()
export class WeatherPredictorService implements IWeatherPredictorService {

  public getCityWeatherConditon(weatherData: IParsedWeatherData): ICityScore {
    const avgHumidity: number = this.getAverageHumidity(weatherData.forecasts);
    const avgSunshine: number = this.getAverageDaysOfSunshine(weatherData.forecasts);
    const avgRainfall: number = this.getAverageRainFall(weatherData.forecasts);
       
    const WEATHER_CONDITION: string = this.getWeatherCondition(avgSunshine, avgHumidity, avgRainfall);
    return {
      city: weatherData.city,
      score: WEATHER_SCORE[WEATHER_CONDITION]
    }
  }

  private getAverageDaysOfSunshine(forecasts) {
    let totalTemperature: number = 0;
    for (let forecast of forecasts) {
      totalTemperature += forecast.avgTemp;
    }
    return totalTemperature/forecasts.length;
  }

  private getAverageRainFall(forecasts) {
    let totalRainfall: number = 0
    for (let forecast of forecasts) {
      totalRainfall += forecast.avgRainfall;
    }
    return totalRainfall/forecasts.length;
  }

  private getAverageHumidity(forecasts): number {
    let totalHumidity = 0;
    for (let forecast of forecasts) {
      totalHumidity += forecast.avgHumidity;
    }
    return totalHumidity/forecasts.length;
  }

  private getWeatherCondition(temp: number, humidity: number, rainfall: number): WEATHER_CONDITION {
	  let condition: WEATHER_CONDITION;
    if (temp <= 5) {
      condition = WEATHER_CONDITION.SNOWY;
    } else if (temp > 5 && temp <= 15) {
      condition = WEATHER_CONDITION.COLD;
    } else if (temp >= 23 && humidity < 80) {
      condition = WEATHER_CONDITION.SUNNY;
    } else if ((temp > 15 && temp < 23) && (humidity >= 36 && humidity < 80)) {
      condition = WEATHER_CONDITION.MOSTLY_SUNNY;
    } else if (humidity > 85 || rainfall > 10) {
      condition = WEATHER_CONDITION.RAINY;
    } else if (humidity >= 80 && humidity < 85) {
      condition = WEATHER_CONDITION.CLOUDY;
    } else {
      condition = WEATHER_CONDITION.NOT_FOUND
    }
    return condition;
	}
}