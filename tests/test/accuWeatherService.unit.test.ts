process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

import { expect, should } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { AccuWeatherService, IAccuWeatherData } from '../../src/services/accuWeatherService';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';

describe('Test Open Weather API Service', () => {
  let accuWeatherService: IAccuWeatherData;
  let logger: ILoggerUtil;

  before(() => {
    const container = new Container();
    container.bind<IAccuWeatherData>(IDENTIFIER.AccuWeatherService).to(AccuWeatherService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();

    accuWeatherService = container.get(IDENTIFIER.AccuWeatherService);
    logger = container.get(IDENTIFIER.Logger);
  });

  it('It should fetch data from the weather API service', async () => {
    const state = 'Delhi';
    const weatherData = await accuWeatherService.getFiftenDaysWeatherForecast(state);
    // TO DO - compare the mocked respone of accu weather api with the response fetched from the weatherData
    const response = {
    };
    should.exist(accuWeatherService);
    should.exist(logger);
    expect(weatherData).to.be.eql(response);
  });
});
