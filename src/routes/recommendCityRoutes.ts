import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import { RecommendCityContoller, IRecommendCityController } from '../controllers/recommendCityController';

// const weatherController = container.get<IWeatherController>(IDENTIFIER.WeatherController);
const weatherController = new RecommendCityContoller();

export default (router) => {
  router.get('/recommended/cities', weatherController.getRecommendedCities);
};

