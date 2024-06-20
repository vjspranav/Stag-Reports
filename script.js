// script.js
document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title");
  const descriptionTextarea = document.getElementById("description");
  const reportTypeSelect = document.getElementById("reportType");
  const deviceInput = document.getElementById("device");
  const submitBtn = document.getElementById("submitBtn");
  const similarReportsPopup = document.getElementById("similarReportsPopup");
  const similarReportsList = document.getElementById("similarReportsList");
  const submitAnywayBtn = document.getElementById("submitAnyway");
  const cancelSubmitBtn = document.getElementById("cancelSubmit");
  const formContainer = document.querySelector(".form-container");

  const titleHeading = document.getElementById("title-heading");

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

    if (title !== "" && description !== "" && device !== "") {
      // Make an API call to check for similar reports
      fetch("/api/reports/similar", {
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
              const listItem = document.createElement("li");
              listItem.textContent = report.title;
              similarReportsList.appendChild(listItem);
            });
            similarReportsPopup.style.display = "flex";
          } else {
            // Submit the report if no similar reports found
            submitReport(title, description, reportType, device);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
