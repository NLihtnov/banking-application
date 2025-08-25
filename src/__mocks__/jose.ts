// Mock para a biblioteca jose (JWT)
export class SignJWT {
  private _payload: any;
  setProtectedHeader = jest.fn(() => this);
  setIssuedAt = jest.fn(() => this);
  setExpirationTime = jest.fn(() => this);
  setIssuer = jest.fn(() => this);
  setAudience = jest.fn(() => this);
  setSubject = jest.fn(() => this);
  setJti = jest.fn(() => this);
  sign = jest.fn(async () => 'mock-jwt-token');

  constructor(payload: any) {
    this._payload = payload;
  }
}

// Mock para verificação de token
export const jwtVerify = jest.fn().mockResolvedValue({
  payload: {
    userId: 1,
    email: 'test@test.com',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  protectedHeader: {
    alg: 'HS256',
    typ: 'JWT',
  },
});

export const jwtDecrypt = jest.fn().mockResolvedValue({
  payload: {
    userId: 1,
    email: 'test@test.com',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  protectedHeader: {
    alg: 'HS256',
    typ: 'JWT',
  },
});

export const decodeJwt = jest.fn().mockReturnValue({
  userId: 1,
  email: 'test@test.com',
  name: 'Test User',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
});

export const decodeProtectedHeader = jest.fn().mockReturnValue({
  alg: 'HS256',
  typ: 'JWT',
});

export const importSecret = jest.fn().mockResolvedValue(new Uint8Array(32));

export const importX509 = jest.fn().mockResolvedValue({});

export const importPKCS8 = jest.fn().mockResolvedValue({});

export const importSPKI = jest.fn().mockResolvedValue({});

export const importJWK = jest.fn().mockResolvedValue({});

export const exportJWK = jest.fn().mockResolvedValue({
  kty: 'oct',
  k: 'mock-key',
});

export const exportSPKI = jest.fn().mockResolvedValue('mock-spki');

export const exportPKCS8 = jest.fn().mockResolvedValue('mock-pkcs8');

export const generateKeyPair = jest.fn().mockResolvedValue({
  privateKey: {},
  publicKey: {},
});

export const generateSecret = jest.fn().mockResolvedValue(new Uint8Array(32));

// Funções para JWE (JSON Web Encryption)
export const EncryptJWT = jest.fn().mockImplementation(() => ({
  setProtectedHeader: jest.fn().mockReturnThis(),
  setIssuedAt: jest.fn().mockReturnThis(),
  setExpirationTime: jest.fn().mockReturnThis(),
  setIssuer: jest.fn().mockReturnThis(),
  setAudience: jest.fn().mockReturnThis(),
  setSubject: jest.fn().mockReturnThis(),
  encrypt: jest.fn().mockResolvedValue('mock-encrypted-jwt'),
}));

export const jwtDecryptCompact = jest.fn().mockResolvedValue({
  payload: {
    userId: 1,
    email: 'test@test.com',
    name: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  protectedHeader: {
    alg: 'dir',
    enc: 'A256GCM',
  },
});

// Errors
export class JOSEError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JOSEError';
  }
}

export class JWTExpired extends JOSEError {
  constructor(message = 'JWT Expired') {
    super(message);
    this.name = 'JWTExpired';
  }
}

export class JWTInvalid extends JOSEError {
  constructor(message = 'JWT Invalid') {
    super(message);
    this.name = 'JWTInvalid';
  }
}

export class JWTClaimValidationFailed extends JOSEError {
  constructor(message = 'JWT Claim Validation Failed') {
    super(message);
    this.name = 'JWTClaimValidationFailed';
  }
}

// Mock para verificação de expiração
export const isJWTExpired = jest.fn().mockReturnValue(false);

// Mock default
const jose = {
  SignJWT,
  jwtVerify,
  jwtDecrypt,
  decodeJwt,
  decodeProtectedHeader,
  importSecret,
  importX509,
  importPKCS8,
  importSPKI,
  importJWK,
  exportJWK,
  exportSPKI,
  exportPKCS8,
  generateKeyPair,
  generateSecret,
  EncryptJWT,
  jwtDecryptCompact,
  JOSEError,
  JWTExpired,
  JWTInvalid,
  JWTClaimValidationFailed,
  isJWTExpired,
};

export default jose;
