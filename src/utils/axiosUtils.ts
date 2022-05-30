import axios, { AxiosResponse, } from 'axios';
import { injectable } from 'inversify';

export interface IAxiosUtil {
  makeRequest<T>(url: string): Promise<T>;
}

@injectable()
export class AxiosUtil {
  
  public makeRequest<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        axios.get<T>(url)
        .then((response: AxiosResponse<T>) => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
      });
    })
  }
}