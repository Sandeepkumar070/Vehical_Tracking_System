import { useEffect, useRef, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import "../styles/AssignVehicleWork.css";

const API_BASE_URL = API_ENDPOINTS.vehicleAssignment;
const REGISTERED_VEHICLES_URL = API_ENDPOINTS.registeredVehicles;

const EMPTY_FORM = {
  vehicleNo: "",
  driverName: "",
  mobileNo: "",
  driverArrivalTime: "",
  targetCompany: "",
};

const readErrorMessage = async (response, fallback) => {
  try {
    const body = await response.json();
    if (body?.message) return body.message;
    if (body?.title) return body.title;
    if (body?.errors) {
      const firstError = Object.values(body.errors).flat()[0];
      if (firstError) return firstError;
    }
  } catch {
    // Response did not contain JSON.
  }
  return fallback;
};

const fetchRegisteredVehicles = async (signal) => {
  const response = await fetch(REGISTERED_VEHICLES_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Unable to load vehicles. Status: ${response.status}`
      )
    );
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Registered vehicle API returned an invalid response.");
  }

  return data
    .map((item) => ({
      vehicleNo: item.vehicleNo ?? item.VehicleNo ?? "",
      driverName: item.driverName ?? item.DriverName ?? "",
      mobileNo: item.mobileNo ?? item.MobileNo ?? "",
    }))
    .filter((item) => item.vehicleNo);
};

export default function AssignVehicleWork() {
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState("manual");
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  const loadRegisteredVehicles = async () => {
    setIsLoadingVehicles(true);
    setMessage("");
    setMessageType("");

    try {
      const cleanVehicles = await fetchRegisteredVehicles();

      setVehicles(cleanVehicles);
      if (cleanVehicles.length === 0) {
        showMessage("error", "No registered vehicles were found.");
      }
    } catch (error) {
      console.error("Registered vehicle API error:", error);
      setVehicles([]);
      showMessage(
        "error",
        error.message || "Unable to connect to the registered vehicle API."
      );
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchRegisteredVehicles(controller.signal)
      .then((cleanVehicles) => {
        if (controller.signal.aborted) return;

        setVehicles(cleanVehicles);
        setIsLoadingVehicles(false);

        if (cleanVehicles.length === 0) {
          setMessageType("error");
          setMessage("No registered vehicles were found.");
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") return;

        console.error("Registered vehicle API error:", error);
        setVehicles([]);
        setMessageType("error");
        setMessage(
          error.message ||
            "Unable to connect to the registered vehicle API."
        );
        setIsLoadingVehicles(false);
      });

    return () => controller.abort();
  }, []);

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setForm(EMPTY_FORM);
    setFileName("");
    setMessage("");
    setMessageType("");
    setIsExtracting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectVehicle = (event) => {
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.vehicleNo === event.target.value
    );

    if (!selectedVehicle) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      vehicleNo: selectedVehicle.vehicleNo,
      driverName: selectedVehicle.driverName,
      mobileNo: selectedVehicle.mobileNo,
      driverArrivalTime: "",
      targetCompany: "",
    });
    setMessage("");
    setMessageType("");
  };

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "xlsx", "xls", "csv"].includes(extension)) {
      event.target.value = "";
      setFileName("");
      showMessage("error", "Please select a PDF, Excel or CSV file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      setFileName("");
      showMessage("error", "File size must not exceed 10 MB.");
      return;
    }

    setFileName(file.name);
    setMessage("");
    setMessageType("");
  };

  const extractFile = () => {
    if (!fileName) {
      showMessage("error", "Please select a file first.");
      return;
    }
    if (vehicles.length === 0) {
      showMessage("error", "No registered vehicle is available for extraction preview.");
      return;
    }

    setIsExtracting(true);
    window.setTimeout(() => {
      const vehicle = vehicles[0];
      setForm({
        vehicleNo: vehicle.vehicleNo,
        driverName: vehicle.driverName,
        mobileNo: vehicle.mobileNo,
        driverArrivalTime: "",
        targetCompany: "",
      });
      setIsExtracting(false);
      showMessage(
        "success",
        "Vehicle information loaded. Enter Arrival Date & Time and Target Company."
      );
    }, 700);
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setFileName("");
    setMessage("");
    setMessageType("");
    setIsSaving(false);
    setIsExtracting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const save = async (event) => {
    event.preventDefault();

    if (!form.vehicleNo) return showMessage("error", "Please select a Vehicle No.");
    if (!form.driverName || !form.mobileNo) {
      return showMessage("error", "Driver information is unavailable for this vehicle.");
    }
    if (!form.driverArrivalTime) {
      return showMessage("error", "Please enter Driver Arrival Date and Time.");
    }
    if (!form.targetCompany.trim()) {
      return showMessage("error", "Please enter the Target Company name.");
    }

    setIsSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleNo: form.vehicleNo,
          driverArrivalTime: form.driverArrivalTime,
          targetCompany: form.targetCompany.trim(),
        }),
      });

      if (!response.ok) {
        const fallback = response.status === 409
          ? "This vehicle already has an active assignment."
          : `Unable to save assignment. Status: ${response.status}`;
        throw new Error(await readErrorMessage(response, fallback));
      }

      const savedVehicleNo = form.vehicleNo;
      setForm(EMPTY_FORM);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      showMessage("success", `Work assigned successfully to ${savedVehicleNo}.`);
    } catch (error) {
      console.error("Vehicle assignment API error:", error);
      showMessage("error", error.message || "Unable to connect to the assignment API.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="assign-page">
      <div className="assign-overlay" aria-hidden="true" />
      <section className="assign-content">
        <div className="assign-title">
          <h1>ASSIGN VEHICLE <span>WORK</span></h1><i />
          <p>CHOOSE A METHOD TO ASSIGN WORK TO A VEHICLE</p>
        </div>

        <div className="method-grid">
          <button type="button" className={`method-card upload ${mode === "upload" ? "active" : ""}`} onClick={() => selectMode("upload")}>
            <span className="method-icon">PDF</span><span className="method-divider" />
            <span className="method-copy"><strong>UPLOAD FILE / PDF</strong><small>Upload an assignment file or PDF to extract vehicle details.</small><em>Supports PDF, Excel (XLS/XLSX), CSV</em></span><b>›</b>
          </button>
          <button type="button" className={`method-card manual ${mode === "manual" ? "active" : ""}`} onClick={() => selectMode("manual")}>
            <span className="method-icon">🚚</span><span className="method-divider" />
            <span className="method-copy"><strong>SELECT VEHICLE NO.</strong><small>Choose a registered vehicle to assign work manually.</small><em>Vehicle data loaded from API</em></span><b>›</b>
          </button>
        </div>

        {mode === "upload" && (
          <div className="file-strip">
            <input ref={fileInputRef} type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={chooseFile} />
            <span className="selected-file-name">{fileName || "No assignment file selected"}</span>
            <button type="button" onClick={() => fileInputRef.current?.click()}>Browse File</button>
            <button type="button" disabled={!fileName || isExtracting} onClick={extractFile}>{isExtracting ? "Extracting..." : "Extract Information"}</button>
          </div>
        )}

        <form className="details-card" onSubmit={save}>
          <header className="details-heading">
            <span className="document-icon">▤</span>
            <div><h2>VEHICLE ASSIGNMENT DETAILS</h2><p>Driver details are loaded automatically. Enter Arrival Date & Time and Target Company manually.</p></div>
            <small>ASSIGN&nbsp; | &nbsp;DISPATCH&nbsp; | &nbsp;DELIVER&nbsp; | &nbsp;GROW</small>
          </header>

          <div className="fields-row">
            <label><span>Vehicle No. *</span>{mode === "manual" ? (
              <select value={form.vehicleNo} onChange={selectVehicle} disabled={isLoadingVehicles || isSaving} required>
                <option value="">{isLoadingVehicles ? "Loading vehicles..." : "Select Vehicle No."}</option>
                {vehicles.map((vehicle) => <option key={vehicle.vehicleNo} value={vehicle.vehicleNo}>{vehicle.vehicleNo}</option>)}
              </select>
            ) : <input value={form.vehicleNo} placeholder="Extracted from file" readOnly />}</label>
            <label><span>Driver Name</span><input value={form.driverName} placeholder="Auto-filled from API" readOnly /></label>
            <label><span>Mobile No.</span><input value={form.mobileNo} placeholder="Auto-filled from API" readOnly /></label>
            <label><span>Driver Arrival Date & Time *</span><input type="datetime-local" value={form.driverArrivalTime} onChange={(event) => setForm((current) => ({ ...current, driverArrivalTime: event.target.value }))} disabled={!form.vehicleNo || isSaving} required /></label>
            <label><span>Target Company *</span><input value={form.targetCompany} onChange={(event) => setForm((current) => ({ ...current, targetCompany: event.target.value }))} placeholder="Enter target company" disabled={!form.vehicleNo || isSaving} maxLength={150} required /></label>
          </div>

          <div className="details-bottom">
            <p className={messageType === "error" ? "assignment-error" : "assignment-success"} role="status">{message}</p>
            <div>
              {vehicles.length === 0 && !isLoadingVehicles && <button className="retry-btn" type="button" onClick={() => loadRegisteredVehicles()}>Retry API</button>}
              <button className="reset-btn" type="button" onClick={reset} disabled={isSaving}>↻&nbsp; Reset</button>
              <button className="save-btn" type="submit" disabled={isSaving || isLoadingVehicles}>{isSaving ? "Saving..." : "▣  Save Assignment"}</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
