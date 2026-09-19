import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ModuleSelection.css";
import pitechLogo from "../assets/pitech-logo.png";
import modulesHighwayBackground from "../assets/modules-highway-bg.png";
import truckShowcase from "../assets/truck-showcase-hd.png";

const modules = [
  { id: 1, title: "Vehicle Dashboard", icon: "dashboard", color: "blue", route: "/dashboard", available: true, position: "top-left" },
  { id: 2, title: "Driver & Vehicle Registration", icon: "registration", color: "green", route: "/driver-vehicle-registration", available: true, position: "top-right" },
  { id: 3, title: "Assign Vehicle Work", icon: "assignment", color: "cyan", route: "/assign-vehicle-work", available: true, position: "upper-left" },
  { id: 4, title: "Driver Management", icon: "driver", color: "purple", route: "/driver-management", available: false, position: "upper-right" },
  { id: 5, title: "Vehicle Management", icon: "vehicle", color: "orange", route: "/vehicle-management", available: false, position: "middle-left" },
  { id: 6, title: "Live Tracking", icon: "tracking", color: "cyan", route: "/live-tracking", available: false, position: "middle-right" },
  { id: 7, title: "Reports", icon: "reports", color: "violet", route: "/reports", available: false, position: "lower-left" },
  { id: 8, title: "Settings", icon: "settings", color: "silver", route: "/settings", available: false, position: "lower-right" },
];

const iconPaths = {
  dashboard: <><path d="M15 43a17 17 0 0 1 34 0"/><path d="m32 35 9-11"/><circle cx="32" cy="43" r="3"/><path d="M20 36h.01M44 36h.01M25 27h.01M39 27h.01"/></>,
  registration: <><circle cx="22" cy="19" r="8"/><path d="M8 45c0-9 6-15 14-15 5 0 9 2 12 6"/><path d="M38 30h17v18H38zM46.5 34v10M41.5 39h10"/></>,
  assignment: <><path d="M10 17h31v25H10zM41 24h9l7 8v10H41"/><circle cx="20" cy="45" r="5"/><circle cx="49" cy="45" r="5"/><path d="M22 10h22M37 5l7 5-7 5"/></>,
  driver: <><circle cx="32" cy="19" r="9"/><path d="M14 49c1-11 8-17 18-17s17 6 18 17"/><path d="M16 45h32"/></>,
  vehicle: <><path d="M7 24h31v21H7zM38 31h10l9 8v6H38z"/><circle cx="18" cy="47" r="5"/><circle cx="48" cy="47" r="5"/></>,
  tracking: <><path d="M32 55S49 39 49 23a17 17 0 1 0-34 0c0 16 17 32 17 32Z"/><circle cx="32" cy="23" r="6"/></>,
  reports: <><path d="M15 7h25l10 11v39H15zM40 7v12h10"/><path d="M24 46V35M32 46V26M40 46V31"/></>,
  settings: <><circle cx="32" cy="32" r="9"/><path d="M32 7v7M32 50v7M7 32h7M50 32h7M14 14l5 5M45 45l5 5M50 14l-5 5M19 45l-5 5"/></>,
};

function ModuleIcon({ type }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[type]}</svg>;
}

export default function ModuleSelection() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const liveData = {
    totalVehicles: 247,
    activeTrips: 189,
    onTime: 92,
    alerts: 5,
  };

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % 2);
    }, 10000);

    return () => {
      window.clearTimeout(timerRef.current);
      window.clearInterval(slideTimer);
    };
  }, []);

  const openModule = (item) => {
    if (item.available) {
      navigate(item.route);
      return;
    }
    window.clearTimeout(timerRef.current);
    setMessage(`${item.title} module is coming soon.`);
    timerRef.current = window.setTimeout(() => setMessage(""), 3000);
  };

  return (
    <main
      className="modules-page"
      style={{
        "--modules-background": `url(${modulesHighwayBackground})`,
      }}
    >
      <div className="modules-backdrop" aria-hidden="true" />
      <div className="road-speed-lines" aria-hidden="true"><i/><i/><i/><i/></div>

      <section className="modules-stage">
        <div className="module-orbit">
          <svg className="orbit-lines" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
            <g>
              <path d="M500 385 L310 95" />
              <path d="M500 385 L690 95" />
              <path d="M500 385 L205 245" />
              <path d="M500 385 L795 245" />
              <path d="M500 385 L180 435" />
              <path d="M500 385 L820 435" />
              <path d="M500 385 L335 650" />
              <path d="M500 385 L680 650" />
            </g>
          </svg>

          <div className="orbit-hub">
            <span className="hub-ring hub-ring-one"/><span className="hub-ring hub-ring-two"/>
            <img src={pitechLogo} alt="Pitech" />
            <strong>Vehicle Monitoring</strong><small>System</small>
          </div>

          {modules.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`module-card module-${item.color} position-${item.position} ${item.available ? "is-active" : "is-locked"}`}
              style={{ "--delay": `${index * 0.12}s` }}
              onClick={() => openModule(item)}
              aria-label={`${item.title}${item.available ? "" : ", coming soon"}`}
            >
              <span className="module-icon"><ModuleIcon type={item.icon}/></span>
              <strong>{item.title}</strong>
              <span className="module-status">{item.available ? "Active" : "Coming Soon"}</span>
            </button>
          ))}
        </div>

        <section className="right-showcase" aria-label="Live fleet information">
          <div className={`showcase-slide truck-slide ${activeSlide === 0 ? "slide-active" : ""}`}>
            <img src={truckShowcase} alt="Connected truck in motion" />
            <div className="truck-shine" aria-hidden="true" />
          </div>

          <div className={`showcase-slide dashboard-slide ${activeSlide === 1 ? "slide-active" : ""}`}>
            <div className="dashboard-head">
              <div><span className="live-pulse" /> <strong>Fleet Command Center</strong></div>
              <small>● Live Fleet Operations</small>
              <time>Tue, Apr 22, 2026&nbsp;&nbsp; | &nbsp;&nbsp;14:28:36</time>
            </div>

            <div className="live-kpis">
              <article className="live-kpi cyan"><div className="kpi-ring"><strong>{liveData.totalVehicles}</strong><span>Total Vehicles</span></div><small>▲ +12%</small></article>
              <article className="live-kpi green"><div className="kpi-ring"><strong>{liveData.activeTrips}</strong><span>Active Trips</span></div><small>▲ +8%</small></article>
              <article className="live-kpi amber"><div className="kpi-ring"><strong>{liveData.onTime}%</strong><span>On Time</span></div><small>▲ +3%</small></article>
              <article className="live-kpi violet"><div className="kpi-ring"><strong>{liveData.alerts}</strong><span>Alerts</span></div><small>▲ +67%</small></article>
            </div>

            <div className="dashboard-middle">
              <article className="chart-panel">
                <h3><span>⌁&nbsp; Trip Activity <small>(Last 24 Hours)</small></span><span className="chart-legend"><i className="cyan-dot"/> Trips <i className="green-dot"/> On Time</span></h3>
                <svg viewBox="0 0 520 190" preserveAspectRatio="none" aria-label="Trip activity chart">
                  <defs><linearGradient id="tripFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16c8ff" stopOpacity=".42"/><stop offset="1" stopColor="#16c8ff" stopOpacity="0"/></linearGradient></defs>
                  <g className="chart-grid"><path d="M0 35H520M0 75H520M0 115H520M0 155H520"/><path d="M65 0V190M130 0V190M195 0V190M260 0V190M325 0V190M390 0V190M455 0V190"/></g>
                  <path className="chart-area" d="M0 150 C45 145 60 112 100 124 S160 82 205 102 S270 45 310 68 S365 98 400 65 S465 48 520 72 L520 190 L0 190Z"/>
                  <path className="chart-line" d="M0 150 C45 145 60 112 100 124 S160 82 205 102 S270 45 310 68 S365 98 400 65 S465 48 520 72"/>
                  <path className="chart-line chart-line-green" d="M0 166 C45 160 68 139 102 143 S158 112 205 126 S265 80 310 101 S362 121 403 94 S468 79 520 105"/>
                  <g className="chart-labels"><text x="0" y="188">00:00</text><text x="82" y="188">04:00</text><text x="168" y="188">08:00</text><text x="252" y="188">12:00</text><text x="338" y="188">16:00</text><text x="424" y="188">20:00</text><text x="488" y="188">24:00</text><text x="2" y="25">200</text><text x="2" y="65">150</text><text x="2" y="105">100</text><text x="2" y="145">50</text><text x="2" y="175">0</text></g>
                </svg>
              </article>

              <article className="status-panel">
                <h3>Vehicle Status</h3>
                <div className="status-content"><div className="status-donut"><strong>{liveData.totalVehicles}</strong><span>Vehicles</span></div><ul><li><i className="green-dot"/>In Transit <b>76%</b></li><li><i className="cyan-dot"/>Idle <b>13%</b></li><li><i className="amber-dot"/>Maintenance <b>7%</b></li><li><i className="violet-dot"/>Offline <b>4%</b></li></ul></div>
              </article>
            </div>

            <div className="dashboard-bottom">
              <article><h3>Recent Alerts <small>View All ›</small></h3><p><b>BR-417</b><span>Speed Limit Exceeded</span><em>92 km/h</em></p><p><b>MH-12</b><span>Route Deviation</span><em>+12 km</em></p><p><b>KA-09</b><span>Geofence Alert</span><em>Warehouse Exit</em></p><p><b>TN-22</b><span>Low Fuel</span><em>12%</em></p><p><b>GJ-05</b><span>Device Offline</span><em>No Signal</em></p></article>
              <article><h3>Live Vehicles (5) <small>View All ›</small></h3><p><i className="green-dot"/><b>MH-12-AB-4586</b><span>Mumbai → Pune</span><em>68 km/h</em></p><p><i className="green-dot"/><b>KA-09-CD-7721</b><span>Bengaluru → Chennai</span><em>72 km/h</em></p><p><i className="green-dot"/><b>GJ-05-EF-3342</b><span>Ahmedabad → Surat</span><em>65 km/h</em></p><p><i className="green-dot"/><b>TN-22-GH-9931</b><span>Chennai → Coimbatore</span><em>58 km/h</em></p><p><i className="green-dot"/><b>DL-01-IJ-6678</b><span>Delhi → Jaipur</span><em>70 km/h</em></p></article>
            </div>
          </div>

          <div className="showcase-controls">
            <button type="button" className={activeSlide === 0 ? "active" : ""} onClick={() => setActiveSlide(0)} aria-label="Show truck" />
            <button type="button" className={activeSlide === 1 ? "active" : ""} onClick={() => setActiveSlide(1)} aria-label="Show dashboard" />
          </div>
          <span key={activeSlide} className="slide-timer" aria-hidden="true" />
        </section>

        {message && <div className="module-message" role="status">{message}</div>}
      </section>
    </main>
  );
}
