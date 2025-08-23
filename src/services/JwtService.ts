import * as jose from 'jose';

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export class JwtService {
  private static readonly SECRET_KEY = new TextEncoder().encode(
    process.env.REACT_APP_JWT_SECRET || 'your-secret-key-min-32-chars-long'
  );
  private static readonly ALGORITHM = 'HS256';

  static async generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: this.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(this.SECRET_KEY);
    
    return jwt;
  }

  static async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const { payload } = await jose.jwtVerify(token, this.SECRET_KEY);
      return payload as JwtPayload;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  static async decodeToken(token: string): Promise<JwtPayload | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.SECRET_KEY);
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jose.decodeJwt(token);
      if (!decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }
}
