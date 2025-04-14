
# MMM-SolaxPV

MagicMirror² module to display real-time solar data from a single **Solax inverter** using the API.

---

##  Features

- Text or Graphical display layout
- Configurable metrics (enable only what you want)
- Battery, PV, grid, load, temperature, yield, and more
- Installer-level access supports real-time data

---

##  Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/YOUR_USERNAME/MMM-SolaxPV.git
```

---

##  Configuration

Add this to your `config.js`:

```js
{
  module: "MMM-SolaxPV",
  position: "top_center",
  config: {
    apiToken: "YOUR_API_TOKEN_HERE",
    serialNumber: "YOUR_SERIAL_NUMBER_HERE",

    showGraphicalDisplay: false,

    // Metrics — enable what you want

    showPVGeneration: true,
    showBatteryStatus: true,
    showLoadConsumption: true,
    showGridExchange: true,

    showTemperature: false,
    showPowerFactor: false,
    showReactivePower: false,
    showBatteryVoltage: false,
    showBatteryCurrent: false,
    showYieldToday: false,
    showYieldTotal: false,
    showFeedInEnergy: false,
    showConsumeEnergy: false,
    showInverterStatus: false,
    showLastUpdated: false,

    updateInterval: 60000
  }
}
```

---

##  Config Option Details

| Option               | Description |
|----------------------|-------------|
| `apiToken`           | Your installer-level Solax API token |
| `serialNumber`       | Inverter SN (from SolaxCloud) |
| `showGraphicalDisplay` | Show graphical flowchart instead of text |
| `showPVGeneration`   | Current solar generation (W) |
| `showBatteryStatus`  | Battery charge/discharge + SOC (%) |
| `showLoadConsumption`| Household load (W), if available |
| `showGridExchange`   | Import/export to grid (W) |
| `showTemperature`    | Inverter temperature (°C) |
| `showPowerFactor`    | Power factor (unitless) |
| `showReactivePower`  | Reactive power (VAR) |
| `showBatteryVoltage` | Battery voltage (V) |
| `showBatteryCurrent` | Battery current (A) |
| `showYieldToday`     | Daily solar yield (kWh) |
| `showYieldTotal`     | Lifetime solar yield (kWh) |
| `showFeedInEnergy`   | Exported energy (kWh) |
| `showConsumeEnergy`  | Imported energy (kWh) |
| `showInverterStatus` | Inverter state text |
| `showLastUpdated`    | Last successful update time |

---

##  Example Layouts

This module supports both a **text list** and a **simple SVG diagram** layout.

Use:

```js
showGraphicalDisplay: true
```

To enable the graphic mode.

---

##  Requirements

- SolaxCloud account
- Installer API token (with access to desired inverter SN)

---

##  Credits

Created for solar users by Stuart Burrows (KayosPi).

---
