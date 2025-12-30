const config = {
  development: {
    API_BASE_URL: 'http://localhost:4000/api',
    ENABLE_LOGGING: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  },
  production: {
    API_BASE_URL: '/api',
    ENABLE_LOGGING: false,
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  },
  test: {
    API_BASE_URL: 'http://localhost:4000/api',
    ENABLE_LOGGING: false,
    CACHE_DURATION: 0,
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
