import { AxiosRequestConfig } from 'axios';

import { IHttpTransportOptions } from './IHttpTransportOptions';

export interface IHttpTransport {
  get<R = any>(url: string, config?: IHttpTransportOptions): Promise<R>;

  post<R = any, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;

  put<R = any, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;

  patch<R = any, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;

  delete<R = any>(url: string, config?: IHttpTransportOptions): Promise<R>;

  makeRequest<R>(config: AxiosRequestConfig): Promise<R>;

  requestMiddleware(
    onFulfilled?: (value: IHttpTransportOptions) => IHttpTransportOptions,
    onRejected?: (error: any) => any,
  ): void;

  responseMiddleware<R = any>(
    onFulfilled: (value: R) => Promise<R>,
    onRejected?: (error: any) => any,
  ): void;
}
