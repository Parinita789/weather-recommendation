process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

import { expect, should } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { OpenWeatherService, IOpenWeatherService } from '../../src/services/openWeatherAPIService';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';

describe('Test Open Weather API Service', () => {
  let openWeatherService: IOpenWeatherService;
  let logger: ILoggerUtil;

  before(() => {
    const container = new Container();
    container.bind<IOpenWeatherService>(IDENTIFIER.OpenWeatherService).to(OpenWeatherService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();

    openWeatherService = container.get(IDENTIFIER.OpenWeatherService);
    logger = container.get(IDENTIFIER.Logger);
  });

  it('It should fetch data from the open weather API', async () => {
    const state = 'Delhi';

    const weatherData = await openWeatherService.getFiftenDaysWeatherForecast(state);
    // TO DO - compare the mocked respone with the response fetched from the weatherData
    const response = {
    };
    should.exist(openWeatherService);
    // should.exist(redisService);
    should.exist(logger);
    expect(weatherData).to.be.eql(response);
  });

});
