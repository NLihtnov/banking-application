import '@testing-library/jest-dom';
import '../jest.setup';
import { setupTestEnvironment } from './test-utils';

setupTestEnvironment();

beforeEach(() => {
  jest.clearAllMocks();
  
  if (global.fetch) {
    (global.fetch as jest.Mock).mockClear();
  }
});

afterEach(() => {
  jest.clearAllMocks();
});
