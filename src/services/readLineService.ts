import readline from "readline";
import { stdin as input, stdout as output } from 'process';
import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { COUNTRY_CODE_MAP } from '../constants/countryCodeMap';
import { IRecommendCityService } from "./recommendCityService";

export interface IReadLineService {
  takeInput(): Promise<void>;
}

@injectable()
export class ReadLineService {
  private recommendCityService;

  constructor(@inject(IDENTIFIER.RecommendCityService) recommendCityService: IRecommendCityService) {
    this.recommendCityService = recommendCityService;
  }

  public async takeInput(): Promise<void> {
    const rl = readline.createInterface({ input, output });
    let country;

    const WaigPromise = new Promise(( resolve , reject) => {
      rl.question('\nEnter the country which you want to visit in next 15 days, will show you the top 5 recommneded cities of that country: ', input => {
        country = input;
        rl.close();
      })

      rl.on('close', () => {
        resolve(country);
      });
    });
    await WaigPromise;
    const countryCode: string = COUNTRY_CODE_MAP[country.toUpperCase()];
    const cities = await this.recommendCityService.getRecommendedCities(countryCode);
    console.log(`\nrecommeded cities - ${cities}`);
  }  
}

