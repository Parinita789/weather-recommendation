process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

import { expect, should } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { RecommendCityService, IRecommendCityService } from '../../src/services/recommendCityService';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';
import { AxiosUtil,IAxiosUtil } from '../../src/utils/axiosUtils';
import { RedisService, IRedisService } from '../../src/services/redisService';

describe('Test Recommend City Service', () => {
  let recommendCityService: IRecommendCityService;
  let logger: ILoggerUtil;
  let axios: IAxiosUtil;
  let redisService: IRedisService;

  before(() => {
    const container = new Container();
    container.bind<IRecommendCityService>(IDENTIFIER.RecommendCityService).to(RecommendCityService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();
    container.bind<IAxiosUtil>(IDENTIFIER.Axios).to(AxiosUtil).inSingletonScope();
    container.bind<IRedisService>(IDENTIFIER.RedisService).to(RedisService).inSingletonScope();

    recommendCityService = container.get(IDENTIFIER.RecommendCityService);
    logger = container.get(IDENTIFIER.Logger);
    axios = container.get(IDENTIFIER.Axios);
    redisService = container.get(IDENTIFIER.RedisService);
  });

  it('It should show recommended city data', async () => {
    const country = 'IN';

    const cities = await recommendCityService.getRecommendedCities(country);
    // TO DO - recommended cities should be equal to mocked recommneded cities
    const response = {
    };

    should.exist(recommendCityService);
    should.exist(logger);
    should.exist(axios);
    should.exist(redisService);
    expect(cities).to.be.eql(response);
  });

});
