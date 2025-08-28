module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'spaceman_super_secret_key_2024_secure_jwt_token_default',
  INACTIVE_ALPHA_VANTAGE_API: process.env.INACTIVE_ALPHA_VANTAGE_API || 'false',
  ALPHA_VANTAGE_API: process.env.ALPHA_VANTAGE_API || '',
  RUN_PRICE_UPDATER: process.env.RUN_PRICE_UPDATER || 'false'
};

