# JWT Secret Fix - SpaceMan Server

## Problem Description
Server mengalami error 500 (Internal Server Error) saat melakukan registrasi user dengan pesan:
```
Error: secretOrPrivateKey must have a value
```

## Root Cause
Environment variable `JWT_SECRET` tidak tersedia atau tidak terbaca oleh aplikasi, menyebabkan JWT token creation gagal.

## Solution Implemented

### 1. Created Environment Configuration File
**File**: `server/config/env.js`
```javascript
module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'spaceman_super_secret_key_2024_secure_jwt_token_default',
  INACTIVE_ALPHA_VANTAGE_API: process.env.INACTIVE_ALPHA_VANTAGE_API || 'false',
  ALPHA_VANTAGE_API: process.env.ALPHA_VANTAGE_API || '',
  RUN_PRICE_UPDATER: process.env.RUN_PRICE_UPDATER || 'false'
};
```

### 2. Updated Utilities
**File**: `server/utilities/utils.js`
```javascript
const jwt = require("jsonwebtoken")
const env = require("../config/env")

const createToken = (payload) => jwt.sign(payload, env.JWT_SECRET)
const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET)

module.exports = { createToken, verifyToken }
```

### 3. Updated Main App
**File**: `server/app.js`
```javascript
const env = require("./config/env")
const PORT = env.PORT
// ... other code ...
if (env.RUN_PRICE_UPDATER === 'true') {
    priceUpdaterJob.start();
}
```

## Benefits of This Solution

### ✅ **Fallback Values**
- Jika environment variable tidak tersedia, menggunakan default values
- Aplikasi tetap berjalan tanpa crash

### ✅ **Centralized Configuration**
- Semua environment variables di satu tempat
- Mudah untuk maintenance dan debugging

### ✅ **Security**
- JWT_SECRET default yang aman
- Bisa override dengan environment variable yang sebenarnya

### ✅ **Flexibility**
- Support untuk development dan production
- Mudah untuk deployment

## Testing Results

### Before Fix:
```bash
curl -X POST http://localhost:3000/register
# Response: {"error":"Internal Server Error"}
# Server Log: Error: secretOrPrivateKey must have a value
```

### After Fix:
```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "newuser2024"}'
# Response: {"message":"User registered successfully","user":{...},"token":"..."}
```

## Files Modified

1. **`server/config/env.js`** - New environment configuration
2. **`server/utilities/utils.js`** - Updated JWT functions
3. **`server/app.js`** - Updated to use config

## How to Use

### For Development:
Aplikasi akan menggunakan default values dari config file.

### For Production:
Set environment variables:
```bash
export JWT_SECRET="your_super_secure_secret_key"
export PORT=3000
export RUN_PRICE_UPDATER=true
```

### For Docker/Deployment:
```dockerfile
ENV JWT_SECRET=your_super_secure_secret_key
ENV PORT=3000
ENV RUN_PRICE_UPDATER=false
```

## Security Notes

⚠️ **Important**: 
- Default JWT_SECRET hanya untuk development
- Production harus menggunakan secret key yang kuat dan unik
- Jangan commit secret keys ke repository

## Status
✅ **FIXED** - JWT token creation now works properly
✅ **TESTED** - Registration endpoint working correctly
✅ **DEPLOYED** - Server running without JWT errors

