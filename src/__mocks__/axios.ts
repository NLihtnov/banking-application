const mockAxios: any = {
  create: jest.fn(() => mockAxios),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    baseURL: '',
    headers: {},
  },
};

export const AxiosInstance = jest.fn(() => mockAxios);

export const AxiosRequestConfig = {};

export const AxiosResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const AxiosError = class AxiosError extends Error {
  constructor(
    message: string,
    code?: string,
    config?: any,
    request?: any,
    response?: any
  ) {
    super(message);
    this.name = 'AxiosError';
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
  }
  
  code?: string;
  config?: any;
  request?: any;
  response?: any;
};

export const isAxiosError = jest.fn((error: any) => error instanceof AxiosError);

const axios = mockAxios;
axios.create = jest.fn(() => mockAxios);
axios.get = jest.fn();
axios.post = jest.fn();
axios.put = jest.fn();
axios.delete = jest.fn();
axios.patch = jest.fn();
axios.request = jest.fn();
axios.interceptors = mockAxios.interceptors;
axios.defaults = mockAxios.defaults;

export default axios;
export { mockAxios };
