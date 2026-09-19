import {
  useEffect,
  useRef,
  useState,
} from "react";

import heroOne from
  "../assets/registration-hero-1.png";

import heroTwo from
  "../assets/registration-hero-2.png";

import heroThree from
  "../assets/registration-hero-3.png";

import registrationBackground from
  "../assets/registration-background.png";

import { API_ENDPOINTS } from "../config/api";
import "../styles/DriverVehicleRegistration.css";

const HERO_CHANGE_TIME = 5000;

const DRIVER_VEHICLE_API = API_ENDPOINTS.driverVehicle;

const heroImages = [
  heroOne,
  heroTwo,
  heroThree,
];

const initialFormData = {
  driverName: "",
  mobileNumber: "",
  licenceNumber: "",
  licenceType: "",
  licenceExpiry: "",
  vehicleNumber: "",
  vehicleType: "",
  vehicleModel: "",
  vehicleCapacity: "",

  driverStatus: true,
  vehicleStatus: true,
};

function DriverVehicleRegistration() {
  const photoInputReference =
    useRef(null);

  const licenceInputReference =
    useRef(null);

  const [
    currentHeroImage,
    setCurrentHeroImage,
  ] = useState(0);

  const [formData, setFormData] =
    useState(initialFormData);

  const [
    driverPhotoPreview,
    setDriverPhotoPreview,
  ] = useState("");

  const [
    licenceDocument,
    setLicenceDocument,
  ] = useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
    Changes the vehicle banner
    every five seconds.
  */
  useEffect(() => {
    const heroInterval =
      window.setInterval(() => {
        setCurrentHeroImage(
          (previousImage) =>
            (
              previousImage + 1
            ) %
            heroImages.length
        );
      }, HERO_CHANGE_TIME);

    return () => {
      window.clearInterval(
        heroInterval
      );
    };
  }, []);

  const handleInputChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    setMessage("");
  };

  const handleDriverPhoto = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !validTypes.includes(
        selectedFile.type
      )
    ) {
      setMessage(
        "Driver photo must be JPG or PNG."
      );

      setMessageType("error");

      event.target.value = "";

      return;
    }

    if (
      selectedFile.size >
      2 * 1024 * 1024
    ) {
      setMessage(
        "Driver photo must be 2 MB or less."
      );

      setMessageType("error");

      event.target.value = "";

      return;
    }

    if (driverPhotoPreview) {
      URL.revokeObjectURL(
        driverPhotoPreview
      );
    }

    setDriverPhotoPreview(
      URL.createObjectURL(
        selectedFile
      )
    );

    setMessage("");
  };

  const handleLicenceDocument = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !validTypes.includes(
        selectedFile.type
      )
    ) {
      setMessage(
        "DL document must be PDF, JPG or PNG."
      );

      setMessageType("error");

      event.target.value = "";

      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setMessage(
        "DL document must be 5 MB or less."
      );

      setMessageType("error");

      event.target.value = "";

      return;
    }

    setLicenceDocument(
      selectedFile
    );

    setMessage("");
  };

  const validateForm = () => {
    if (
      !formData.driverName.trim()
    ) {
      return "Please enter driver name.";
    }

    if (
      !formData.mobileNumber.trim()
    ) {
      return "Please enter mobile number.";
    }

    const mobileDigits =
      formData.mobileNumber.replace(/\D/g, "");

    if (
      mobileDigits.length < 10 ||
      mobileDigits.length > 15
    ) {
      return "Please enter a valid 10 to 15 digit mobile number.";
    }

    if (
      !formData.licenceNumber.trim()
    ) {
      return "Please enter licence number.";
    }

    if (
      !formData.licenceType
    ) {
      return "Please select licence type.";
    }

    if (
      !formData.licenceExpiry
    ) {
      return "Please select licence expiry date.";
    }

    const expiryDate = new Date(
      `${formData.licenceExpiry}T23:59:59`
    );

    if (
      Number.isNaN(expiryDate.getTime()) ||
      expiryDate < new Date()
    ) {
      return "Licence expiry date cannot be in the past.";
    }

    if (!licenceDocument) {
      return "Please upload the DL document.";
    }

    if (
      !formData.vehicleNumber.trim()
    ) {
      return "Please enter vehicle number.";
    }

    if (
      !formData.vehicleType
    ) {
      return "Please select vehicle type.";
    }

    if (
      !formData.vehicleModel.trim()
    ) {
      return "Please enter vehicle model.";
    }

    if (
      !formData.vehicleCapacity.trim()
    ) {
      return "Please enter vehicle capacity.";
    }

    if (
      !Number.isFinite(Number(formData.vehicleCapacity)) ||
      Number(formData.vehicleCapacity) <= 0
    ) {
      return "Vehicle capacity must be greater than zero.";
    }

    return "";
  };

  const clearForm = () => {
    setFormData({ ...initialFormData });

    if (driverPhotoPreview) {
      URL.revokeObjectURL(driverPhotoPreview);
    }

    setDriverPhotoPreview("");
    setLicenceDocument(null);

    if (photoInputReference.current) {
      photoInputReference.current.value = "";
    }

    if (licenceInputReference.current) {
      licenceInputReference.current.value = "";
    }
  };

  const readApiResponse = async (response) => {
    const responseText = await response.text();

    if (!responseText) {
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  };

  const getApiMessage = (responseData, fallbackMessage) => {
    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData?.errors) {
      const validationErrors = Object.values(responseData.errors)
        .flat()
        .filter(Boolean)
        .join(" ");

      if (validationErrors) {
        return validationErrors;
      }
    }

    return (
      responseData?.message ||
      responseData?.title ||
      responseData?.detail ||
      fallbackMessage
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationMessage =
      validateForm();

    if (validationMessage) {
      setMessage(
        validationMessage
      );

      setMessageType("error");

      return;
    }

    const requestData = new FormData();
    const driverPhoto =
      photoInputReference.current?.files?.[0];

    requestData.append("Driver_Name", formData.driverName.trim());
    requestData.append("Driver_Mob_no", formData.mobileNumber.trim());

    if (driverPhoto) {
      requestData.append("Driver_Image", driverPhoto, driverPhoto.name);
    }

    requestData.append("Driver_Status", String(formData.driverStatus));
    requestData.append("Licence_no", formData.licenceNumber.trim());
    requestData.append("Licence_Type", formData.licenceType);
    requestData.append(
      "Licence_Exp",
      new Date(`${formData.licenceExpiry}T00:00:00`).toISOString()
    );

    if (licenceDocument) {
      requestData.append(
        "Licence_Document",
        licenceDocument,
        licenceDocument.name
      );
    }

    requestData.append(
      "Vehical_No",
      formData.vehicleNumber.trim().toUpperCase()
    );
    requestData.append("Vehical_Type", formData.vehicleType);
    requestData.append("Vehical_model", formData.vehicleModel.trim());
    requestData.append(
      "Vehical_capicity",
      String(Number(formData.vehicleCapacity))
    );
    requestData.append("Vehical_Status", String(formData.vehicleStatus));

    setIsSubmitting(true);
    setMessage("Saving registration...");
    setMessageType("loading");

    try {
      const response = await fetch(DRIVER_VEHICLE_API, {
        method: "POST",
        body: requestData,
      });

      const responseData = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          getApiMessage(
            responseData,
            `Unable to save registration (HTTP ${response.status}).`
          )
        );
      }

      clearForm();
      setMessage(
        getApiMessage(
          responseData,
          "Driver and vehicle registration saved successfully."
        )
      );
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "Cannot connect to the cloud API at https://vehicleapis.runasp.net. Check internet access and make sure the API CORS policy allows this website."
          : error.message || "Unable to save registration."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    clearForm();
    setMessage("");
    setMessageType("");
  };

  return (
    <main
      className="registration-page"
      style={{
        "--registration-background":
          `url(${registrationBackground})`,
      }}
    >
      <div className="registration-overlay">
      </div>

      <form
        className="registration-form"
        onSubmit={handleSubmit}
      >
        <div className="registration-grid">
          {/* DRIVER PANEL */}
          <section className="registration-panel driver-panel">
            <div className="panel-heading">
              <div className="panel-heading-title">
                <span className="panel-heading-icon">
                  ●
                </span>

                <h2>
                  Driver Information
                </h2>
              </div>

              <p>
                Capture driver and licence
                details.
              </p>
            </div>

            <div className="driver-profile">
              <div className="driver-photo-column">
                <div className="driver-photo">
                  {driverPhotoPreview ? (
                    <img
                      src={
                        driverPhotoPreview
                      }
                      alt="Selected driver"
                    />
                  ) : (
                    <div className="driver-placeholder">
                      <div className="placeholder-head">
                      </div>

                      <div className="placeholder-body">
                      </div>

                      <span>RS</span>
                    </div>
                  )}
                </div>

                <input
                  ref={
                    photoInputReference
                  }
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={
                    handleDriverPhoto
                  }
                  hidden
                />

                <button
                  type="button"
                  className="upload-photo-button"
                  onClick={() => {
                    photoInputReference
                      .current
                      ?.click();
                  }}
                >
                  <span>▣</span>
                  Upload Photo
                </button>

                <small>
                  JPG, PNG (Max 2 MB)
                </small>

                <label className="status-toggle">
                  <input
                    type="checkbox"
                    checked={
                      formData
                        .driverStatus
                    }
                    onChange={(
                      event
                    ) => {
                      setFormData(
                        (
                          previousData
                        ) => ({
                          ...previousData,

                          driverStatus:
                            event.target
                              .checked,
                        })
                      );
                    }}
                  />

                  <span className="toggle-slider">
                  </span>

                  <span className="toggle-text">
                    {formData.driverStatus
                      ? "Active"
                      : "Inactive"}
                  </span>
                </label>
              </div>

              <div className="driver-fields">
                <div className="registration-field">
                  <label htmlFor="driverName">
                    Driver Name
                    <span>*</span>
                  </label>

                  <div className="field-input">
                    <span className="field-icon">
                      ●
                    </span>

                    <input
                      id="driverName"
                      name="driverName"
                      type="text"
                      value={
                        formData
                          .driverName
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter driver name"
                    />
                  </div>
                </div>

                <div className="registration-field">
                  <label htmlFor="mobileNumber">
                    Mobile Number
                    <span>*</span>
                  </label>

                  <div className="field-input">
                    <span className="field-icon">
                      ◧
                    </span>

                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      value={
                        formData
                          .mobileNumber
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter mobile number"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="licence-section">
              <div className="subsection-heading">
                <span>▤</span>

                <h3>
                  Driver Licence Details
                </h3>
              </div>

              <div className="licence-fields">
                <div className="registration-field">
                  <label htmlFor="licenceNumber">
                    Licence Number
                    <span>*</span>
                  </label>

                  <div className="field-input">
                    <span className="field-icon">
                      ▣
                    </span>

                    <input
                      id="licenceNumber"
                      name="licenceNumber"
                      type="text"
                      value={
                        formData
                          .licenceNumber
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter licence number"
                      autoCapitalize="characters"
                    />
                  </div>
                </div>

                <div className="registration-field">
                  <label htmlFor="licenceType">
                    Licence Type
                    <span>*</span>
                  </label>

                  <div className="field-input">
                    <span className="field-icon">
                      ▤
                    </span>

                    <select
                      id="licenceType"
                      name="licenceType"
                      value={
                        formData
                          .licenceType
                      }
                      onChange={
                        handleInputChange
                      }
                    >
                      <option value="">
                        Select licence type
                      </option>

                      <option value="LMV (Light Motor Vehicle)">
                        LMV (Light Motor
                        Vehicle)
                      </option>

                      <option value="HMV (Heavy Motor Vehicle)">
                        HMV (Heavy Motor
                        Vehicle)
                      </option>

                      <option value="MCWG (Motorcycle With Gear)">
                        MCWG (Motorcycle
                        With Gear)
                      </option>

                      <option value="Transport Vehicle">
                        Transport Vehicle
                      </option>

                      <option value="Commercial Vehicle">
                        Commercial Vehicle
                      </option>
                    </select>
                  </div>
                </div>

                <div className="registration-field">
                  <label htmlFor="licenceExpiry">
                    Licence Expiry
                    <span>*</span>
                  </label>

                  <div className="field-input date-field">
                    <input
                      id="licenceExpiry"
                      name="licenceExpiry"
                      type="date"
                      value={
                        formData
                          .licenceExpiry
                      }
                      onChange={
                        handleInputChange
                      }
                      min={new Date()
                        .toISOString()
                        .slice(0, 10)}
                    />
                  </div>
                </div>

                <div className="registration-field">
                  <label htmlFor="licenceDocument">
                    Upload DL Document
                    <span>*</span>
                  </label>

                  <input
                    ref={
                      licenceInputReference
                    }
                    id="licenceDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={
                      handleLicenceDocument
                    }
                    hidden
                  />

                  <button
                    type="button"
                    className="licence-upload-box"
                    onClick={() => {
                      licenceInputReference
                        .current
                        ?.click();
                    }}
                  >
                    <span className="document-icon">
                      ▤
                    </span>

                    <span className="document-information">
                      <strong>
                        {licenceDocument
                          ? licenceDocument
                              .name
                          : "Upload DL Document"}
                      </strong>

                      <small>
                        PDF, JPG, PNG
                        (Max 5 MB)
                      </small>
                    </span>

                    <span className="choose-file-button">
                      Choose File
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* VEHICLE PANEL */}
          <section className="registration-panel vehicle-panel">
            <div className="panel-heading">
              <div className="panel-heading-title">
                <span className="panel-heading-icon">
                  ▰
                </span>

                <h2>
                  Vehicle Information
                </h2>
              </div>

              <p>
                Register vehicle details
                and current status.
              </p>
            </div>

            <div className="vehicle-banner">
              <div
                className="vehicle-banner-images"
                aria-hidden="true"
              >
                {heroImages.map(
                  (
                    heroImage,
                    index
                  ) => (
                    <div
                      key={
                        heroImage
                      }
                      className={`vehicle-banner-image ${
                        currentHeroImage ===
                        index
                          ? "hero-active"
                          : ""
                      }`}
                      style={{
                        backgroundImage:
                          `url(${heroImage})`,
                      }}
                    />
                  )
                )}
              </div>

              <div className="vehicle-banner-overlay">
              </div>

              <div className="banner-content">
                <h3>
                  Keep Your Fleet
                  <br />
                  On The Move
                </h3>

                <p>
                  Safe vehicles. Efficient
                  operations.
                  <br />
                  Greater tomorrows.
                </p>

                <span className="banner-line">
                </span>
              </div>

              <div className="hero-indicators">
                {heroImages.map(
                  (_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        currentHeroImage ===
                        index
                          ? "hero-indicator-active"
                          : ""
                      }
                      onClick={() => {
                        setCurrentHeroImage(
                          index
                        );
                      }}
                      aria-label={`Show vehicle image ${
                        index + 1
                      }`}
                    />
                  )
                )}
              </div>
            </div>

            <div className="vehicle-fields">
              <div className="registration-field">
                <label htmlFor="vehicleNumber">
                  Vehicle Number
                  <span>*</span>
                </label>

                <div className="field-input">
                  <span className="field-icon">
                    ▣
                  </span>

                  <input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    type="text"
                    value={
                      formData
                        .vehicleNumber
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter vehicle number"
                    autoCapitalize="characters"
                  />
                </div>
              </div>

              <div className="registration-field">
                <label htmlFor="vehicleType">
                  Vehicle Type
                  <span>*</span>
                </label>

                <div className="field-input">
                  <span className="field-icon">
                    ▰
                  </span>

                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={
                      formData
                        .vehicleType
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="">
                      Select vehicle type
                    </option>

                    <option value="Truck (Goods Carrier)">
                      Truck (Goods Carrier)
                    </option>

                    <option value="Container Truck">
                      Container Truck
                    </option>

                    <option value="Pickup Vehicle">
                      Pickup Vehicle
                    </option>

                    <option value="Trailer">
                      Trailer
                    </option>

                    <option value="Tanker">
                      Tanker
                    </option>

                    <option value="Mini Truck">
                      Mini Truck
                    </option>

                    <option value="Van">
                      Van
                    </option>
                  </select>
                </div>
              </div>

              <div className="registration-field">
                <label htmlFor="vehicleModel">
                  Model
                  <span>*</span>
                </label>

                <div className="field-input">
                  <span className="field-icon">
                    ⚙
                  </span>

                  <input
                    id="vehicleModel"
                    name="vehicleModel"
                    type="text"
                    value={
                      formData
                        .vehicleModel
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter vehicle model"
                  />
                </div>
              </div>

              <div className="registration-field">
                <label htmlFor="vehicleCapacity">
                  Capacity (Ton)
                  <span>*</span>
                </label>

                <div className="field-input capacity-input">
                  <span className="field-icon">
                    ◉
                  </span>

                  <input
                    id="vehicleCapacity"
                    name="vehicleCapacity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      formData
                        .vehicleCapacity
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter capacity"
                  />

                  <span className="capacity-unit">
                    Ton
                  </span>
                </div>
              </div>

              <div className="registration-field vehicle-status-field">
                <label>
                  Vehicle Status
                  <span>*</span>
                </label>

                <label className="status-toggle">
                  <input
                    type="checkbox"
                    checked={
                      formData
                        .vehicleStatus
                    }
                    onChange={(
                      event
                    ) => {
                      setFormData(
                        (
                          previousData
                        ) => ({
                          ...previousData,

                          vehicleStatus:
                            event.target
                              .checked,
                        })
                      );
                    }}
                  />

                  <span className="toggle-slider">
                  </span>

                  <span className="toggle-text">
                    {formData.vehicleStatus
                      ? "Active"
                      : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="registration-bottom">
          {message && (
            <div
              className={`registration-message ${messageType}`}
            >
              {message}
            </div>
          )}

          <div className="registration-actions">
            <button
              type="submit"
              className="save-registration-button"
              disabled={isSubmitting}
            >
              <span>▣</span>
              {isSubmitting
                ? "Saving..."
                : "Save Registration"}
            </button>

            <button
              type="button"
              className="reset-registration-button"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <span>↻</span>
              Reset
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default DriverVehicleRegistration;
