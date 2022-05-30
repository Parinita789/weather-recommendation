process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

import { expect, should } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { WeatherAPIService, IWeatherAPIService } from '../../src/services/weatherApiService';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';

describe('Test Open Weather API Service', () => {
  let weatherApiService: IWeatherAPIService;
  let logger: ILoggerUtil;

  before(() => {
    const container = new Container();
    container.bind<IWeatherAPIService>(IDENTIFIER.WeatherApiService).to(WeatherAPIService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();

    weatherApiService = container.get(IDENTIFIER.OpenWeatherService);
    logger = container.get(IDENTIFIER.Logger);
  });

  it('It should fetch data from the weather API service', async () => {
    const state = 'Delhi';
    const weatherData = await weatherApiService.getFiftenDaysWeatherForecast(state);
    // TO DO - compare the mocked respone of weather api with the response fetched from the weatherData
    const response = {
    };
    should.exist(weatherApiService);
    should.exist(logger);
    expect(weatherData).to.be.eql(response);
  });
});
