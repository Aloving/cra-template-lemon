import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { IHttpTransport, IHttpTransportOptions } from './interfaces';

export class HttpTransport implements IHttpTransport {
  private readonly _client: AxiosInstance = axios.create();

  async makeRequest<R>(config: AxiosRequestConfig): Promise<R> {
    const { data: responseData } = await this._client(config);

    return responseData;
  }

  async delete<R = any>(
    url: string,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    const { data: responseData } = await this._client.delete(url, config);

    return responseData;
  }

  async get<R = any>(url: string, config?: IHttpTransportOptions): Promise<R> {
    const { data: responseData } = await this._client.get(url, config);

    return responseData;
  }

  async post<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    const { data: responseData } = await this._client.post(url, data, config);

    return responseData;
  }

  async put<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    const { data: responseData } = await this._client.put(url, data, config);

    return responseData;
  }

  async patch<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    const { data: responseData } = await this._client.patch(url, data, config);

    return responseData;
  }

  requestMiddleware(
    onFulfilled?: (value: IHttpTransportOptions) => IHttpTransportOptions,
    onRejected?: (error: any) => any,
  ): void {
    this._client.interceptors.request.use(onFulfilled, onRejected);
  }

  responseMiddleware<R = any>(
    onFulfilled: (value: R) => Promise<R>,
    onRejected: (error: any, retry?: boolean) => any,
  ): void {
    this._client.interceptors.response.use((resp) => {
      return {
        ...resp,
        data: onFulfilled(resp.data),
      };
    }, onRejected);
  }
}
