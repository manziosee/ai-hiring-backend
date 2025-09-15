export const SecurityConfig = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
    SKIP_SUCCESSFUL_REQUESTS: false,
    SKIP_FAILED_REQUESTS: false,
  },

  // JWT Configuration
  JWT: {
    EXPIRES_IN: '1h',
    REFRESH_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256',
  },

  // Password Policy
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
    SALT_ROUNDS: 12,
  },

  // File Upload Limits
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    MAX_FILES: 5,
  },

  // CORS Configuration
  CORS: {
    ORIGIN: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    CREDENTIALS: true,
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },

  // Security Headers
  HELMET: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  // API Limits
  API: {
    MAX_REQUEST_SIZE: '10mb',
    TIMEOUT: 30000, // 30 seconds
    MAX_CONCURRENT_REQUESTS: 100,
  },
};
