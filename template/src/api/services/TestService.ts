import { ITestService, IAuthTransport } from '../interfaces';

export class TestService implements ITestService {
  private _httpTransport: IAuthTransport;

  constructor(httpTransport: IAuthTransport) {
    this._httpTransport = httpTransport;
  }

  test = () => {
    return Promise.resolve({});
  };
}
