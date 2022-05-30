import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { State } from 'country-state-city';
import { ERROR_CONSTANTS, ERROR_NAMES } from '../constants/error';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IWeatherClientFactory } from '../utils/weatherClientFactory';
import { InternalServerError } from '../utils/errorUtils';
import { WEATHER_CLIENT } from '../constants/weatherClient';
import { IWeatherPredictorService, ICityScore } from './weatherPredictorService';
import CONFIG from '../config/envConfig';

export interface IRecommendCityService {
  getRecommendedCities(countryCode: string): Promise<any>;
}

export interface IParsedWeatherData {
  city: string;
  country: string;
  forecasts: IForecasts[];
}

export interface IForecasts {
  avgTemp: number,
  avgHumidity: number,
  avgRainfall: number
}

@injectable()
export class RecommendCityService {
  private logger;
  private weatherClientFactory;
  private WeatherPredictorService;

  constructor (
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.WeatherClient) weatherClientFactory: IWeatherClientFactory,
    @inject(IDENTIFIER.WeatherPredictorService) WeatherPredictorService: IWeatherPredictorService
    ) {
    this.logger = logger;
    this.weatherClientFactory = weatherClientFactory;
    this.WeatherPredictorService = WeatherPredictorService;
  }

  /**
  * Returns a list of recommended city of a country.
  * @publc @async
  * @param {string} countryCode
  * @return {String[]]} list of recommneded cities.
  */
  public async getRecommendedCities(countryCode: string): Promise<any> {
    try {
      const states = State.getStatesOfCountry(countryCode);
      const weatherClient = this.weatherClientFactory.getWeatherClient(CONFIG.WEATHER_CLIENT);
      /**
       * TO DO - check the recommended cities for the for the country in the redis
       * if found return the data
       * else calculate recommended city and save it in redis in country-city key value pair with TTL 1 hr
       **/
      let citiesWithScore: ICityScore[] = [];
      for (let state of states) {
        const weatherData: IParsedWeatherData = await weatherClient.getFiftenDaysWeatherForecast(state.name);
        const cityWeatherScore = this.WeatherPredictorService.getCityWeatherConditon(weatherData);
        citiesWithScore.push(cityWeatherScore);
      }
      const recommendedCities = this.sortCityByScore(citiesWithScore);
      return recommendedCities;
    } catch (err) {
      this.logger.error(`err in recommendCityService - getRecommendedCities - ${err}`);
      throw new InternalServerError(ERROR_NAMES.SERVER_ERROR, ERROR_CONSTANTS.INTERNAL_SERVER_ERROR);
    }
  }

  private sortCityByScore(citiesWithScore: ICityScore[]): ICityScore[] {
    citiesWithScore.sort((a: ICityScore, b: ICityScore) => {
      return a.score - b.score;
    });
    // returning top 5 ciites to visit
    return citiesWithScore.splice(5);
  }

}

