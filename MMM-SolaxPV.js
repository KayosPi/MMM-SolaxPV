/* MMM-SolaxPV.js — Single Inverter Monitor with Optional Graphical Display
 * Displays live data from a Solax inverter using the installer-level API.
 * Configurable metrics and graphical/text layouts.
 */

Module.register("MMM-SolaxPV", {
  defaults: {
    updateInterval: 60 * 1000, // How often to fetch data from Solax API (in ms)
    apiToken: "YOUR_API_TOKEN_HERE", // Installer-level API token
    serialNumber: "YOUR_SERIAL_NUMBER_HERE", // Inverter serial number

    showGraphicalDisplay: false, // Show SVG flow-style layout instead of text

    // Optional display metrics (disabled by default)
    showPVGeneration: false,        // Display PV generation (W)
    showBatteryStatus: false,       // Display battery charge/discharge and SOC
    showLoadConsumption: false,     // Display household load (W), if available
    showGridExchange: false,        // Display import/export to grid (W)
    showTemperature: false,         // Display inverter temperature (°C)
    showPowerFactor: false,         // Display power factor
    showReactivePower: false,       // Display reactive power (VAR)
    showBatteryVoltage: false,      // Display battery voltage (V)
    showBatteryCurrent: false,      // Display battery current (A)
    showYieldToday: false,          // Display solar yield today (kWh)
    showYieldTotal: false,          // Display lifetime solar yield (kWh)
    showFeedInEnergy: false,        // Display total exported energy (kWh)
    showConsumeEnergy: false,       // Display total imported energy (kWh)
    showInverterStatus: false,      // Display inverter operating status
    showLastUpdated: false          // Display timestamp of last update
  },

  start() {
    this.dataLoaded = false;
    this.solarData = {};
    this.updateTime = null;
    this.inverterStatus = null;
    this.getSolarData();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getSolarData();
    }, this.config.updateInterval);
  },

  getSolarData() {
    this.sendSocketNotification("GET_SOLAX_DATA", {
      token: this.config.apiToken,
      sn: this.config.serialNumber
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "SOLAX_DATA") {
      this.solarData = payload;
      this.dataLoaded = true;
      this.updateTime = payload.uploadTime || null;
      this.inverterStatus = this.getInverterStatusText(payload.inverterStatus);
      this.updateDom();
    }
  },

  getInverterStatusText(code) {
    const statuses = {
      0: "Waiting",
      1: "Checking",
      3: "Normal",
      4: "Fault",
      5: "Permanent Fault",
      6: "Update",
      107: "Running (Grid-Connected)",
      200: "Off-Grid",
      201: "Charging",
      202: "Discharging"
    };
    return statuses[code] || `Code ${code}`;
  },

  getDom() {
    return this.config.showGraphicalDisplay ? this.getGraphDom() : this.getTextDom();
  },

  getTextDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "solax-card";

    if (!this.dataLoaded) {
      wrapper.innerHTML = "Loading Solax data...";
      return wrapper;
    }

    const d = this.solarData;

    wrapper.innerHTML = `
      <div class="solax-title">Solax PV Monitor</div>
      ${this.config.showInverterStatus ? `<div class="solax-metric"><strong>Status:</strong> ${this.inverterStatus}</div>` : ""}
      ${this.config.showPVGeneration ? `<div class="solax-metric"><strong>☀️ PV:</strong> ${d.inverterPower} W</div>` : ""}
      ${this.config.showBatteryStatus ? `<div class="solax-metric"><strong>🔋 Battery:</strong> ${d.batteryPower} W (${d.soc}%)</div>` : ""}
      ${this.config.showLoadConsumption ? `<div class="solax-metric"><strong>🏠 Load:</strong> ${d.loadPower ?? "N/A"} W</div>` : ""}
      ${this.config.showGridExchange ? `<div class="solax-metric"><strong>⚡ Grid:</strong> ${d.gridPower} W</div>` : ""}
      ${this.config.showTemperature ? `<div class="solax-metric"><strong>🌡️ Temp:</strong> ${d.temperature} °C</div>` : ""}
      ${this.config.showPowerFactor ? `<div class="solax-metric"><strong>PF:</strong> ${d.powerFactor}</div>` : ""}
      ${this.config.showReactivePower ? `<div class="solax-metric"><strong>Reactive Power:</strong> ${d.wreactivePower ?? "N/A"} VAR</div>` : ""}
      ${this.config.showBatteryVoltage ? `<div class="solax-metric"><strong>Battery Voltage:</strong> ${d.batVoltage} V</div>` : ""}
      ${this.config.showBatteryCurrent ? `<div class="solax-metric"><strong>Battery Current:</strong> ${d.batCurrent} A</div>` : ""}
      ${this.config.showYieldToday ? `<div class="solax-metric"><strong>Yield Today:</strong> ${d.yieldtoday} kWh</div>` : ""}
      ${this.config.showYieldTotal ? `<div class="solax-metric"><strong>Yield Total:</strong> ${d.yieldtotal} kWh</div>` : ""}
      ${this.config.showFeedInEnergy ? `<div class="solax-metric"><strong>Exported:</strong> ${d.feedinenergy} kWh</div>` : ""}
      ${this.config.showConsumeEnergy ? `<div class="solax-metric"><strong>Imported:</strong> ${d.consumeenergy} kWh</div>` : ""}
      ${this.config.showLastUpdated && this.updateTime ? `<div class="solax-metric"><em>Updated:</em> ${this.updateTime}</div>` : ""}
    `;

    return wrapper;
  },

  getGraphDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "solax-graph";

    if (!this.dataLoaded) {
      wrapper.innerHTML = "Loading graphical data...";
      return wrapper;
    }

    const d = this.solarData;

    wrapper.innerHTML = `
      <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <text x="140" y="20" font-size="14" fill="white">☀️ ${d.inverterPower}W</text>
        <text x="140" y="280" font-size="14" fill="white">🔋 ${d.batteryPower}W (${d.soc}%)</text>
        <text x="250" y="150" font-size="14" fill="white">🏠 Load</text>
        <text x="10" y="150" font-size="14" fill="white">⚡ ${d.gridPower}W</text>
        <circle cx="150" cy="150" r="25" fill="#333" stroke="#FFD700" stroke-width="2" />
        <text x="150" y="155" text-anchor="middle" fill="#fff" font-size="12">Inverter</text>
        <line x1="150" y1="40" x2="150" y2="125" stroke="#0f0" stroke-width="2" marker-end="url(#arrow)" />
        <line x1="150" y1="175" x2="150" y2="260" stroke="#0f0" stroke-width="2" marker-end="url(#arrow)" />
        <line x1="40" y1="150" x2="125" y2="150" stroke="#0f0" stroke-width="2" marker-end="url(#arrow)" />
        <line x1="175" y1="150" x2="260" y2="150" stroke="#0f0" stroke-width="2" marker-end="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#0f0" />
          </marker>
        </defs>
      </svg>
    `;

    return wrapper;
  },

  getStyles() {
    return ["MMM-SolaxPV.css"];
  }
});
