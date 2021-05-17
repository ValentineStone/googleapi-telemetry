# googleapi-telemetry

An assortment of telemetry cli presets based on `@valentine-stone/googleapi-utils` adapters

### Setup
1. `git clone https://github.com/ValentineStone/googleapi-telemetry`
2. `cd googleapi-telemetry`
3. `npm i`
4. `cp .env.example .env` and change it according to your setup

### Usage
`node telem proxy` to connect Google IoT to GCS over udp  
`node telem device` to connect serialport device to Google IoT  
`node telem serial-udp` to connect udp to serial directly (does not use Google IoT)

Explore `telemetry.js` for more freaky legacy telemetry options like `proxy_c`, `device_c`, `proxy-iot` and `device-iot` and even more legacy unusable presets. A great war over packet loss and ping was waged there.

### To generate keys
```
openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
openssl ec -in ec_private.pem -pubout -out ec_public.pem
```

### keys zip file structure
Any amount of nested directories, within them the following files:
- `ec_private.pem` - pair private key
- `ec_private.pem` - pair public key
- `.env` - dotenv environment variables
- `credentials.json` - Google Cloud service account credentials
