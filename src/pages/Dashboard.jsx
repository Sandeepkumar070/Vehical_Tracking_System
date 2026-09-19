import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { API_ENDPOINTS } from "../config/api";
import "../styles/Dashboard.css";

const API_URL = API_ENDPOINTS.vehicleMonitoring;
const DRIVER_IMAGE_API_URL = API_ENDPOINTS.driverImage;

const RECORDS_PER_PAGE = 10;
const PAGE_CHANGE_TIME = 10000;
const API_REFRESH_TIME = 30000;

function DriverPhoto({
  vehicleNo,
  driverName,
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const driverInitial =
    driverName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "D";

  if (!vehicleNo || imageFailed) {
    return (
      <span
        className="driver-avatar"
        title="Driver image not available"
      >
        {driverInitial}
      </span>
    );
  }

  const imageUrl =
    `${DRIVER_IMAGE_API_URL}/${encodeURIComponent(
      vehicleNo.trim()
    )}`;

  return (
    <span
      className="driver-photo-frame"
      title={driverName || "Driver"}
    >
      <img
        className="driver-photo"
        src={imageUrl}
        alt={`${driverName || "Driver"} photo`}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    </span>
  );
}

function Dashboard() {
  const [vehicleData, setVehicleData] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const totalPages = Math.ceil(
    vehicleData.length / RECORDS_PER_PAGE
  );

  const firstRecordIndex =
    (currentPage - 1) *
    RECORDS_PER_PAGE;

  const lastRecordIndex =
    firstRecordIndex +
    RECORDS_PER_PAGE;

  const currentRecords =
    vehicleData.slice(
      firstRecordIndex,
      lastRecordIndex
    );

  const fetchVehicleData =
    useCallback(async () => {
      try {
        const response = await fetch(
          API_URL,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `API request failed. Status: ${response.status}`
          );
        }

        const result =
          await response.json();

        if (!Array.isArray(result)) {
          throw new Error(
            "The API response is not an array."
          );
        }

        setVehicleData(result);
        setError("");
        setLastUpdated(new Date());

        const newTotalPages =
          Math.ceil(
            result.length /
              RECORDS_PER_PAGE
          );

        setCurrentPage(
          (previousPage) => {
            if (newTotalPages === 0) {
              return 1;
            }

            return previousPage >
              newTotalPages
              ? newTotalPages
              : previousPage;
          }
        );
      } catch (requestError) {
        console.error(
          "Vehicle API error:",
          requestError
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load vehicle data."
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    const initialRequestTimeout =
      window.setTimeout(() => {
        fetchVehicleData();
      }, 0);

    const refreshInterval =
      window.setInterval(() => {
        fetchVehicleData();
      }, API_REFRESH_TIME);

    return () => {
      window.clearTimeout(
        initialRequestTimeout
      );

      window.clearInterval(
        refreshInterval
      );
    };
  }, [fetchVehicleData]);

  useEffect(() => {
    if (totalPages <= 1) {
      return undefined;
    }

    const pageInterval =
      window.setInterval(() => {
        setCurrentPage(
          (previousPage) =>
            previousPage >= totalPages
              ? 1
              : previousPage + 1
        );
      }, PAGE_CHANGE_TIME);

    return () => {
      window.clearInterval(
        pageInterval
      );
    };
  }, [totalPages]);

  const changePage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const goToPreviousPage = () => {
    if (totalPages <= 1) {
      return;
    }

    setCurrentPage(
      (previousPage) =>
        previousPage === 1
          ? totalPages
          : previousPage - 1
    );
  };

  const goToNextPage = () => {
    if (totalPages <= 1) {
      return;
    }

    setCurrentPage(
      (previousPage) =>
        previousPage === totalPages
          ? 1
          : previousPage + 1
    );
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError("");
    fetchVehicleData();
  };

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    const parsedDate =
      new Date(dateValue);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "--";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "not-available";
    }

    return status
      .trim()
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const getFeedbackClass = (
    feedback
  ) => {
    if (
      feedback === "Vehicle Damaged" ||
      feedback === "Emergency"
    ) {
      return "feedback-danger";
    }

    if (
      feedback === "In Traffic" ||
      feedback === "Customer Delay" ||
      feedback ===
        "Waiting for Loading"
    ) {
      return "feedback-warning";
    }

    return "feedback-success";
  };

  return (
    <main className="main-content">
      <section className="vehicle-section">
        <div className="table-wrapper">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Vehicle No.</th>
                <th>Driver Name</th>
                <th>Mobile No.</th>
                <th>Arrival Time</th>
                <th>Dispatch Time</th>
                <th>Target Company</th>
                <th>Status</th>
                <th>
                  Driver Feedback
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr className="message-row">
                  <td colSpan="9">
                    <div className="dashboard-message">
                      <span className="loading-spinner"></span>

                      Loading vehicle data...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                error && (
                  <tr className="message-row">
                    <td colSpan="9">
                      <div className="dashboard-error">
                        <span>
                          {error}
                        </span>

                        <button
                          type="button"
                          onClick={
                            handleRetry
                          }
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

              {!isLoading &&
                !error &&
                vehicleData.length ===
                  0 && (
                  <tr className="message-row">
                    <td colSpan="9">
                      <div className="dashboard-message">
                        No vehicle is
                        currently waiting
                        for dispatch.
                      </div>
                    </td>
                  </tr>
                )}

              {!isLoading &&
                !error &&
                currentRecords.map(
                  (
                    vehicle,
                    index
                  ) => {
                    const status =
                      vehicle.vehicleStatus ||
                      "Not Available";

                    const feedback =
                      vehicle.driverFeedback ||
                      "--";

                    return (
                      <tr
                        key={`${
                          vehicle.id ||
                          vehicle.vehicleNo
                        }-${
                          firstRecordIndex +
                          index
                        }`}
                      >
                        <td data-label="S.No.">
                          {firstRecordIndex +
                            index +
                            1}
                        </td>

                        <td data-label="Vehicle No.">
                          <strong className="vehicle-number">
                            {vehicle.vehicleNo ||
                              "--"}
                          </strong>
                        </td>

                        <td data-label="Driver Name">
                          <div className="driver-cell">
                            <DriverPhoto
                              key={vehicle.vehicleNo}
                              vehicleNo={vehicle.vehicleNo}
                              driverName={vehicle.driverName}
                            />

                            <span>
                              {vehicle.driverName ||
                                "--"}
                            </span>
                          </div>
                        </td>

                        <td data-label="Mobile No.">
                          {vehicle.mobileNo ? (
                            <a
                              className="mobile-number"
                              href={`tel:${vehicle.mobileNo}`}
                            >
                              {
                                vehicle.mobileNo
                              }
                            </a>
                          ) : (
                            "--"
                          )}
                        </td>

                        <td data-label="Arrival Time">
                          {formatTime(
                            vehicle.driverArrivalTime
                          )}
                        </td>

                        <td data-label="Dispatch Time">
                          {formatTime(
                            vehicle.dispatchTime
                          )}
                        </td>

                        <td data-label="Target Company">
                          <span className="target-company">
                            {vehicle.targetCompany ||
                              "--"}
                          </span>
                        </td>

                        <td data-label="Status">
                          <span
                            className={`status-badge ${getStatusClass(
                              status
                            )}`}
                          >
                            <span className="status-dot"></span>

                            {status}
                          </span>
                        </td>

                        <td data-label="Driver Feedback">
                          <span
                            className={`feedback-badge ${getFeedbackClass(
                              feedback
                            )}`}
                          >
                            {feedback}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>

        <div className="pagination-area">
          <div className="record-information">
            {vehicleData.length > 0 ? (
              <>
                Showing{" "}
                <strong>
                  {firstRecordIndex +
                    1}
                </strong>
                –
                <strong>
                  {Math.min(
                    lastRecordIndex,
                    vehicleData.length
                  )}
                </strong>{" "}
                of{" "}
                <strong>
                  {vehicleData.length}
                </strong>
              </>
            ) : (
              "No records"
            )}
          </div>

          <div className="auto-switch-information">
            <span className="auto-dot"></span>

            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }
                )}`
              : "Connecting to API..."}
          </div>

          {totalPages > 0 && (
            <div className="pagination">
              <button
                type="button"
                className="navigation-button"
                onClick={
                  goToPreviousPage
                }
                disabled={
                  totalPages <= 1
                }
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={`page-button ${
                    currentPage ===
                    pageNumber
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() =>
                    changePage(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                className="navigation-button"
                onClick={goToNextPage}
                disabled={
                  totalPages <= 1
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
