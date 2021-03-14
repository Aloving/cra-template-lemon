import { IHttpTransportOptions } from './IHttpTransportOptions';
import { ILoginRequestPayload } from './ILoginRequestPayload';
import { ITokensResponse } from './ITokenResponse';

type TDataRequest = Record<string, any>;

export interface IAuthTransport {
  login(payload: ILoginRequestPayload): Promise<ITokensResponse>;
  logout(): void;
  updateToken(refreshToken: string): Promise<ITokensResponse>;
  getToken(): Partial<ITokensResponse>;

  delete<R = any>(url: string, config?: IHttpTransportOptions): Promise<R>;

  get<R = any>(url: string, config?: IHttpTransportOptions): Promise<R>;

  post<R = any, D = TDataRequest>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;

  put<R = any, D = TDataRequest>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;

  patch<R = any, D = TDataRequest>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R>;
}
