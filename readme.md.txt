# MMM-SolaxPV2

A MagicMirror² module to display real-time data from your SolaX inverter using the SolaxCloud API v2.

This module is a modernised fork of MMM-SolaxPV, rewritten to use the secure and extensible v2 API.

---

## Features

- Connects to the official SolaxCloud v2 API
- Shows PV generation, battery status, inverter state, grid exchange and more
- Toggle each metric independently
- Maps `inverterStatus` codes to human-readable labels
- Clean, resizable interface styled to match other MagicMirror modules

---

## Installation

```bash
git clone https://github.com/your-username/MMM-SolaxPV2.git
cd MMM-SolaxPV2
npm install
```

---

## Configuration

Add this to your `config.js`:

```js
{
  module: "MMM-SolaxPV2",
  position: "top_center",
  config: {
    apiToken: "YOUR_API_TOKEN",
    wifiSn: "YOUR_WIFI_SN",
    updateInterval: 60 * 1000,

    // Core data options
    showPV2Generation: true,
    showPV2BatteryStatus: true,
    showPV2GridExchange: true,
    showPV2Temperature: true,
    showPV2PowerFactor: true,
    showPV2ReactivePower: false,

    // Battery metrics
    showPV2BatteryVoltage: true,
    showPV2BatteryCurrent: true,
    showPV2BatteryTemp: false,
    showPV2SurplusEnergy: false,
    showPV2ChargeEnergy: false,
    showPV2DischargeEnergy: false,

    // Energy yield
    showPV2YieldToday: true,
    showPV2YieldTotal: true,
    showPV2FeedInEnergy: true,
    showPV2ConsumeEnergy: true,

    // System status
    showPV2InverterStatus: true,
    showPV2InternalTemp: false,
    showPV2LastUpdated: true,

    // Electrical output
    showPV2ACCurrent: false,
    showPV2ACVoltage: false,
    showPV2ACFrequency: false,

    // Generator and PV totals
    showPV2TotalPVEnergy: false,
    showPV2SolarInvEnergy: false,
    showPV2GeneratorPower: false,
    showPV2GeneratorEnergy: false
  }
}
```

---

## API Access

1. Log into [https://www.solaxcloud.com](https://www.solaxcloud.com)
2. Navigate to `Account Center > API Management`
3. Generate your API key (token)
4. Locate your device's `WiFi SN` (e.g., SNGRSQD3JT)

---

## Appearance

This module uses a clean, styled layout that aligns with default MagicMirror modules. You can override styles in `MMM-SolaxPV.css`.

---

## Dependencies

- Node.js (https module)
- A valid SolaxCloud account with v2 API access

---

## License

MIT License

This project is based on work by others but rewritten for API v2 support.

