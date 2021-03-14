import { HttpStatus } from '../enums/HttpStatus';
import {
  IAuthTransport,
  IHttpTransport,
  IHttpTransportOptions,
  ILoginRequestPayload,
  ITokensResponse,
} from './interfaces';

interface IAuthTransportOptions {
  httpTransport: IHttpTransport;
  window: Window;
  token?: string | null;
  refreshToken?: string | null;
}

const REFRESH_TOKEN_URL = '/auth/refreshToken';

export class AuthTransport implements IAuthTransport {
  private token: string | null;
  private refreshToken: string | null;
  private window: Window;
  private onLogoutSubscribers: { (...args: any): void }[] = [];
  private onLoginSubscribers: { (...args: any): void }[] = [];
  public client: IHttpTransport;

  constructor({
    httpTransport,
    refreshToken,
    token,
    window,
  }: IAuthTransportOptions) {
    this.client = httpTransport;
    this.window = window;

    this.token = token || null;
    this.refreshToken = refreshToken || null;

    this.onInit();
  }

  private getAuthorizationHeader(): string {
    return `Bearer ${this.token}`;
  }

  private onInit(): void {
    this.addAuthRequestMiddleware();
    this.addAuthResponseMiddleware();
  }

  private addAuthRequestMiddleware(): void {
    this.client.requestMiddleware(
      (config = {}) => {
        if (!this.token) {
          return config;
        }

        const newConfig: IHttpTransportOptions = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: this.getAuthorizationHeader(),
          },
        };

        return newConfig;
      },
      (e) => Promise.reject(e),
    );
  }

  private addAuthResponseMiddleware(): void {
    this.client.responseMiddleware(
      (r) => r,
      async (error) => {
        if (
          !this.refreshToken ||
          error.response.status !== HttpStatus.UNAUTHORIZED ||
          error.config.retry
        ) {
          throw error;
        }

        const { refreshToken, accessToken } = await this.updateToken(
          this.refreshToken,
        );

        this.setToken({ refreshToken, accessToken });

        const newRequest = {
          ...error.config,
          retry: true,
        };

        return this.client.makeRequest(newRequest);
      },
    );
  }

  private subscribeConfig(
    config?: IHttpTransportOptions,
  ): IHttpTransportOptions {
    const newConfig = config || { headers: {} };

    return {
      ...newConfig,
      headers: {
        ...newConfig.headers,
        Authorization: this.getAuthorizationHeader(),
      },
    };
  }

  private clearToken(): void {
    this.token = null;
    this.refreshToken = null;
  }

  private setToken({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): void {
    this.token = accessToken;
    this.refreshToken = refreshToken;
  }

  async login({
    login,
    password,
  }: ILoginRequestPayload): Promise<ITokensResponse> {
    const response = await this.client.post<ITokensResponse>('/auth/login', {
      login,
      password,
    });
    const { accessToken, refreshToken } = response;
    if (accessToken && refreshToken) {
      this.token = accessToken;
      this.refreshToken = refreshToken;
      this.onLoginSubscribers.forEach((subscriber) => subscriber());
    }

    return response;
  }

  logout = () => {
    this.clearToken();

    this.onLogoutSubscribers.forEach((subscriber) => subscriber());
  };

  getToken(): ITokensResponse {
    return {
      accessToken: this.token || '',
      refreshToken: this.refreshToken || '',
    };
  }
  updateToken(refreshToken: string): Promise<ITokensResponse> {
    return this.client.post<ITokensResponse, { refreshToken: string }>(
      REFRESH_TOKEN_URL,
      {
        refreshToken,
      },
    );
  }

  get<R = any>(url: string, config?: IHttpTransportOptions): Promise<R> {
    return this.client.get<R>(url, this.subscribeConfig(config));
  }

  post<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    return this.client.post<R, D>(url, data, this.subscribeConfig(config));
  }

  put<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    return this.client.put<R, D>(url, data, this.subscribeConfig(config));
  }

  patch<R = any, D = Record<string, any>>(
    url: string,
    data?: D,
    config?: IHttpTransportOptions,
  ): Promise<R> {
    return this.client.patch<R, D>(url, data, this.subscribeConfig(config));
  }

  delete<R = any>(url: string, config?: IHttpTransportOptions): Promise<R> {
    return this.client.delete(url, this.subscribeConfig(config));
  }
}
