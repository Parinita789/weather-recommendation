import { Router } from 'express';
import recommendedCitiRoutes from './recommendCityRoutes'
const router: Router = Router();

recommendedCitiRoutes(router);

/**
* Mounting respective paths.
* @param {object} app Express instance
*/
export default (app) => {
  app.use('/api/v1', router);
};
  