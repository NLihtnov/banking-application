export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export class JwtService {
  static generateToken = jest.fn().mockResolvedValue('mock-generated-token');
  
  static verifyToken = jest.fn().mockResolvedValue({
    userId: 1,
    email: 'test@example.com',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  
  static decodeToken = jest.fn().mockResolvedValue({
    userId: 1,
    email: 'test@example.com',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  
  static isTokenExpired = jest.fn().mockReturnValue(false);
}
