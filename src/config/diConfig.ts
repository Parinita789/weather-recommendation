import { Container } from 'inversify';
import 'reflect-metadata';
import { IDENTIFIER } from '../constants/identifier';
import { RedisService, IRedisService } from '../services/redisService';
import { HttpService, IHttpService } from '../services/httpService';
import { Application, IApplication } from '../services/appService';
import { BasicMiddleware, IBasicMiddleware } from '../middlewares/basicMiddleware';
import { ErrorHandlerMiddleware, IErrorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware';
import { LoggerUtil, ILoggerUtil } from '../utils/loggerUtil';
import { ReadLineService,  IReadLineService } from '../services/readLineService';
import { AxiosUtil, IAxiosUtil } from '../utils/axiosUtils';
import { RecommendCityContoller, IRecommendCityController } from '../controllers/recommendCityController';
import { RecommendCityService, IRecommendCityService } from '../services/recommendCityService';
import { OpenWeatherClient } from '../weatherClients/openWeatherAPIClient';
import { AccuWeatherClient } from '../weatherClients/accuWeatherClient';
import { WeatherAPIClient  } from '../weatherClients/weatherApiClient';
import { IWeatherForecast } from '../utils/weatherClientFactory';
import { WeatherPredictorService, IWeatherPredictorService } from '../services/weatherPredictorService';

const container = new Container({ defaultScope: 'Singleton' });
/**
* service binding
*/
container.bind<IRedisService>(IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
container.bind<IHttpService>(IDENTIFIER.HttpService).to(HttpService).inSingletonScope();
container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();
container.bind<IAxiosUtil>(IDENTIFIER.Axios).to(AxiosUtil).inSingletonScope();
container.bind<IReadLineService>(IDENTIFIER.ReadLineService).to(ReadLineService).inSingletonScope();
container.bind<IRecommendCityService>(IDENTIFIER.RecommendCityService).to(RecommendCityService).inSingletonScope();
container.bind<IWeatherForecast>(IDENTIFIER.OpenWeatherClient).to(OpenWeatherClient).inSingletonScope();
container.bind<IWeatherForecast>(IDENTIFIER.AccuWeatherClient).to(AccuWeatherClient).inSingletonScope();
container.bind<IWeatherForecast>(IDENTIFIER.WeatherAPIClient).to(WeatherAPIClient).inSingletonScope();
container.bind<IWeatherPredictorService>(IDENTIFIER.WeatherPredictorService).to(WeatherPredictorService).inSingletonScope();

/**
* middleware binding
*/ 
container.bind<IBasicMiddleware>(IDENTIFIER.BasicMiddleware).to(BasicMiddleware);
container.bind<IErrorHandlerMiddleware>(IDENTIFIER.ErrorHandlerMiddleware).to(ErrorHandlerMiddleware)
 
container.bind<IApplication>(IDENTIFIER.Application).to(Application).inSingletonScope();
container.bind<IRecommendCityController>(IDENTIFIER.RecommendCityController).to(RecommendCityContoller).inSingletonScope();
// container.bind<IWeatherClientFactory>(IDENTIFIER.WeatherClient).to(WeatherClientFactory).inSingletonScope();

export default container;