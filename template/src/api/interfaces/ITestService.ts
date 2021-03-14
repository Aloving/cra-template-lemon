import { ITestRequest } from '../dto';

export interface ITestService {
  test(payload: ITestRequest): Promise<any>;
}
