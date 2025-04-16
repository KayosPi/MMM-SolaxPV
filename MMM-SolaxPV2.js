// MMM-SolaxPV2.js — Solax API v2 version
// Forked and updated to use /api/v2/dataAccess/realtimeInfo/get

Module.register("MMM-SolaxPV2", {
  defaults: {
    updateInterval: 60 * 1000,
    apiToken: "YOUR_API_TOKEN_HERE",     // <-- Replace with your SolaxCloud token
    wifiSn: "YOUR_WIFI_SERIAL_HERE",     // <-- Replace with your device's WiFi SN

    showGraphicalDisplay: false,

    showPV2Generation: true,
    showPV2BatteryStatus: true,
    showPV2GridExchange: true,
    showPV2Temperature: true,
    showPV2PowerFactor: true,
    showPV2ReactivePower: false,
    showPV2BatteryVoltage: true,
    showPV2BatteryCurrent: true,
    showPV2YieldToday: true,
    showPV2YieldTotal: true,
    showPV2FeedInEnergy: true,
    showPV2ConsumeEnergy: true,
    showPV2InverterStatus: true,
    showPV2LastUpdated: true,

    showPV2ACCurrent: false,
    showPV2ACVoltage: false,
    showPV2ACFrequency: false,
    showPV2InternalTemp: false,
    showPV2SurplusEnergy: false,
    showPV2ChargeEnergy: false,
    showPV2DischargeEnergy: false,
    showPV2TotalPVEnergy: false,
    showPV2BatteryTemp: false,
    showPV2SolarInvEnergy: false,
    showPV2GeneratorPower: false,
    showPV2GeneratorEnergy: false
  },

  start() {
    this.dataLoaded = false;
    this.solarData = {};
    this.updateTime = null;
    this.getSolarData();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getSolarData();
    }, this.config.updateInterval);
  },

  getSolarData() {
    this.sendSocketNotification("GET_SOLAX_DATA_V2", {
      token: this.config.apiToken,
      wifiSn: this.config.wifiSn
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "SOLAX_DATA_V2") {
      this.solarData = payload;
      this.dataLoaded = true;
      this.updateTime = payload.uploadTime || null;
      this.inverterStatus = payload.inverterStatus;
      this.updateDom();
    }
  },

  getDom() {
    const d = this.solarData;
    const c = this.config;
    const wrapper = document.createElement("div");
    wrapper.className = "solax-card";

    if (!this.dataLoaded) {
      wrapper.innerHTML = "Loading Solax v2 data...";
      return wrapper;
    }

    const INVERTER_STATUS_MAP = {
      "100": "Waiting for operation",
      "101": "Self-test",
      "102": "Normal",
      "103": "Recoverable fault",
      "104": "Permanent fault",
      "105": "Firmware upgrade",
      "106": "EPS detection",
      "107": "Off-grid",
      "108": "Self-test mode",
      "109": "Sleep mode",
      "110": "Standby mode",
      "111": "PV wake (battery)",
      "112": "Generator detection",
      "113": "Generator mode",
      "114": "Shutdown standby",
      "130": "VPP mode",
      "131": "TOU - Self Use",
      "132": "TOU - Charging",
      "133": "TOU - Discharging",
      "134": "TOU - Battery Off",
      "135": "TOU - Peak Shaving",
      "136": "Normal generator",
      "137": "Battery expansion",
      "138": "On-grid battery heating",
      "139": "EPS battery heating"
    };

    const inverterStatusText = INVERTER_STATUS_MAP[d.inverterStatus] || `Unknown (${d.inverterStatus})`;

    wrapper.innerHTML = `
      <div class="solax-title">Solax PV Monitor v2</div>
      ${c.showPV2InverterStatus ? `<div class="solax-metric"><strong>Status:</strong> ${inverterStatusText}</div>` : ""}
      ${c.showPV2Generation ? `<div class="solax-metric"><strong>PV Generation:</strong> ${d.acpower} W</div>` : ""}
      ${c.showPV2BatteryStatus ? `<div class="solax-metric"><strong>Battery:</strong> ${d.batPower} W (${d.soc}%)</div>` : ""}
      ${c.showPV2GridExchange ? `<div class="solax-metric"><strong>Grid Exchange:</strong> ${d.feedinpower} W</div>` : ""}
      ${c.showPV2Temperature ? `<div class="solax-metric"><strong>Temperature:</strong> ${d.temperature} °C</div>` : ""}
      ${c.showPV2PowerFactor ? `<div class="solax-metric"><strong>Power Factor:</strong> ${d.powerFactor}</div>` : ""}
      ${c.showPV2ReactivePower ? `<div class="solax-metric"><strong>Reactive Power:</strong> ${d.wreactivePower} VAR</div>` : ""}
      ${c.showPV2BatteryVoltage ? `<div class="solax-metric"><strong>Battery Voltage:</strong> ${d.batVoltage} V</div>` : ""}
      ${c.showPV2BatteryCurrent ? `<div class="solax-metric"><strong>Battery Current:</strong> ${d.batCurrent} A</div>` : ""}
      ${c.showPV2YieldToday ? `<div class="solax-metric"><strong>Yield Today:</strong> ${d.yieldtoday} kWh</div>` : ""}
      ${c.showPV2YieldTotal ? `<div class="solax-metric"><strong>Yield Total:</strong> ${d.yieldtotal} kWh</div>` : ""}
      ${c.showPV2FeedInEnergy ? `<div class="solax-metric"><strong>Exported Energy:</strong> ${d.feedinenergy} kWh</div>` : ""}
      ${c.showPV2ConsumeEnergy ? `<div class="solax-metric"><strong>Imported Energy:</strong> ${d.consumeenergy} kWh</div>` : ""}
      ${c.showPV2ACCurrent ? `<div class="solax-metric"><strong>AC Current:</strong> ${d.iac1} A</div>` : ""}
      ${c.showPV2ACVoltage ? `<div class="solax-metric"><strong>AC Voltage:</strong> ${d.vac1} V</div>` : ""}
      ${c.showPV2ACFrequency ? `<div class="solax-metric"><strong>AC Frequency:</strong> ${d.fac1} Hz</div>` : ""}
      ${c.showPV2InternalTemp ? `<div class="solax-metric"><strong>Internal Temp:</strong> ${d.temperBoard} °C</div>` : ""}
      ${c.showPV2SurplusEnergy ? `<div class="solax-metric"><strong>Surplus Energy:</strong> ${d.surplusEnergy} kWh</div>` : ""}
      ${c.showPV2ChargeEnergy ? `<div class="solax-metric"><strong>Charge Energy:</strong> ${d.chargeEnergy} kWh</div>` : ""}
      ${c.showPV2DischargeEnergy ? `<div class="solax-metric"><strong>Discharge Energy:</strong> ${d.dischargeEnergy} kWh</div>` : ""}
      ${c.showPV2TotalPVEnergy ? `<div class="solax-metric"><strong>PV Energy Total:</strong> ${d.pvenergy} kWh</div>` : ""}
      ${c.showPV2BatteryTemp ? `<div class="solax-metric"><strong>Battery Temp:</strong> ${d.battemper} °C</div>` : ""}
      ${c.showPV2SolarInvEnergy ? `<div class="solax-metric"><strong>Solar Inverter Energy:</strong> ${d.solarInvEnergy} kWh</div>` : ""}
      ${c.showPV2GeneratorPower ? `<div class="solax-metric"><strong>Generator Power:</strong> ${d.genPower} W</div>` : ""}
      ${c.showPV2GeneratorEnergy ? `<div class="solax-metric"><strong>Generator Energy:</strong> ${d.genEnergy} kWh</div>` : ""}
      ${c.showPV2LastUpdated && this.updateTime ? `<div class="solax-metric"><em>Last Updated:</em> ${this.updateTime}</div>` : ""}
    `;

    return wrapper;
  },

  getStyles() {
    return ["MMM-SolaxPV.css"];
  }
});