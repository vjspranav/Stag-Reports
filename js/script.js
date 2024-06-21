// script.js
document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "https://api.stag-os.org";
  const titleInput = document.getElementById("title");
  const descriptionTextarea = document.getElementById("description");
  const reportTypeSelect = document.getElementById("reportType");
  const deviceInput = document.getElementById("device");
  const contactInfoInput = document.getElementById("contactInfo");
  const logTextarea = document.getElementById("log");
  const submitBtn = document.getElementById("submitBtn");
  const similarReportsPopup = document.getElementById("similarReportsPopup");
  const similarReportsList = document.getElementById("similarReportsList");
  const submitAnywayBtn = document.getElementById("submitAnyway");
  const cancelSubmitBtn = document.getElementById("cancelSubmit");
  const formContainer = document.querySelector(".form-container");
  const titleHeading = document.getElementById("title-heading");

  const homeSection = document.getElementById("home");
  const reportsSection = document.getElementById("reports");
  const homeLink = document.getElementById("homeLink");
  const reportsLink = document.getElementById("reportsLink");
  const reportsList = document.getElementById("reportsList");

  const bugFields = document.getElementById("bugFields");

  // We have 7 shapes, randomly initialize the shape and position
  const shapes = document.querySelectorAll(".shape");
  shapes.forEach((shape) => {
    const randomX = Math.floor(Math.random() * 100) + 1;
    const randomY = Math.floor(Math.random() * 100) + 1;
    shape.style.left = `${randomX}%`;
    shape.style.top = `${randomY}%`;
    shape.style.animation =
      Math.random() > 0.5
        ? "moveShape 30s linear infinite"
        : "moveShapeReverse 30s linear infinite";
  });

  // Navigation
  homeLink.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(homeSection);
  });

  reportsLink.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(reportsSection);
  });

  // Toggle bug-specific fields
  reportTypeSelect.addEventListener("change", function () {
    if (this.value === "bug") {
      bugFields.style.display = "block";
    } else {
      bugFields.style.display = "none";
    }
  });

  // Initialize bug fields visibility
  bugFields.style.display = reportTypeSelect.value === "bug" ? "block" : "none";

  function showSection(section) {
    homeSection.style.display = "none";
    reportsSection.style.display = "none";
    // remove none from the section do not add display block
    section.style.display = "";
  }

  titleInput.addEventListener("input", function () {
    if (titleInput.value.trim() !== "") {
      formContainer.classList.add("show");
      titleHeading.classList.add("moved");
    } else {
      formContainer.classList.remove("show");
      titleHeading.classList.remove("moved");
    }
  });

  titleInput.addEventListener("input", function () {
    if (titleInput.value.trim() !== "") {
      formContainer.classList.add("show");
    } else {
      formContainer.classList.remove("show");
    }
  });

  submitBtn.addEventListener("click", function () {
    const title = titleInput.value.trim();
    const description = descriptionTextarea.value.trim();
    const reportType = reportTypeSelect.value;
    const device = deviceInput.value.trim();
    const contactInfo = contactInfoInput.value.trim();
    const log = logTextarea.value.trim();

    if (title !== "" && description !== "" && device !== "") {
      // Make an API call to check for similar reports
      fetch(`${BASE_URL}/report/similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, reportType }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            // Display similar reports in the popup
            similarReportsList.innerHTML = "";
            data.forEach((report) => {
              const reportCell = document.createElement("div");
              reportCell.classList.add(
                "border",
                "border-gray-300",
                "rounded-lg",
                "p-4",
                "cursor-pointer",
                "hover:bg-gray-100"
              );
              reportCell.innerHTML = `
                        <h3 class="text-lg font-bold mb-2">${report.title}</h3>
                        <p class="text-gray-600">${report.description}</p>
                    `;
              reportCell.addEventListener("click", function () {
                // Handle the selection of a similar report
                console.log("Selected report:", report);
                // You can perform further actions here, such as populating the form fields with the selected report data
              });
              similarReportsList.appendChild(reportCell);
            });
            similarReportsPopup.style.display = "flex";
          } else {
            // Submit the report if no similar reports found
            // submitReport(title, description, reportType, device);
            alert("No similar reports found. Submitting the report.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Please fill in all the fields");
    }
  });

  submitAnywayBtn.addEventListener("click", function () {
    const title = titleInput.value.trim();
    const description = descriptionTextarea.value.trim();
    const reportType = reportTypeSelect.value;
    const device = deviceInput.value.trim();
    submitReport(title, description, reportType, device);
    similarReportsPopup.style.display = "none";
  });

  cancelSubmitBtn.addEventListener("click", function () {
    similarReportsPopup.style.display = "none";
  });

  function submitReport(title, description, reportType, device) {
    // Make an API call to submit the report
    fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, reportType, device }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Report submitted:", data);
        // Clear the form fields after successful submission
        titleInput.value = "";
        descriptionTextarea.value = "";
        deviceInput.value = "";
        formContainer.classList.remove("show");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
