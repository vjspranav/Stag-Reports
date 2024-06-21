// reports-script.js
let reports = [];
let filteredReports = [];
let sortColumn = "";
let sortOrder = "asc";

document.addEventListener("DOMContentLoaded", () => {
  const reportsLink = document.getElementById("reportsLink");
  if (reportsLink) {
    reportsLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("home").style.display = "none";
      const reportsSection = document.getElementById("reports");
      reportsSection.style.display = "block";
      setTimeout(() => {
        reportsSection.classList.add("visible");
      }, 50);
      if (reports.length === 0) {
        fetchReports();
      }
    });
  }

  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
  document
    .getElementById("filterSelect")
    .addEventListener("change", handleFilter);
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => handleSort(th.dataset.sort));
  });
});

async function fetchReports() {
  try {
    const response = await fetch("https://api.stag-os.org/report/");
    reports = await response.json();
    filteredReports = [...reports];
    renderReports();
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
}

function renderReports() {
  const tbody = document.getElementById("reportsBody");
  tbody.innerHTML = "";
  filteredReports.forEach((report, index) => {
    const row = document.createElement("tr");
    row.style.animationDelay = `${index * 0.05}s`;
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap" data-label="Type">
                <span class="text-sm font-medium text-gray-900">
                    ${report.reportType === "bug" ? "🐛" : "✨"} ${
      report.reportType
    }
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap" data-label="Title">
                <span class="text-sm font-medium text-gray-900">${
                  report.title
                }</span>
            </td>
            <td class="px-6 py-4" data-label="Description">
                <span class="text-sm text-gray-500">${report.description}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap" data-label="Version">
                <span class="text-sm text-gray-500">${report.version}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap" data-label="Count">
                <span class="text-sm text-gray-500">${report.reportCount}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap" data-label="Status">
                <span class="status ${report.status}">${report.status}</span>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function handleSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm)
  );
  renderReports();
}

function handleFilter() {
  const filterType = document.getElementById("filterSelect").value;
  filteredReports =
    filterType === "all"
      ? reports
      : reports.filter((report) => report.reportType === filterType);
  renderReports();
}

function handleSort(column) {
  if (column === sortColumn) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortOrder = "asc";
  }

  filteredReports.sort((a, b) => {
    if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
    if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  renderReports();
  updateSortIcons();
}

function updateSortIcons() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.remove("sorted-asc", "sorted-desc");
    th.querySelector(".sort-icon").textContent = "↕";
  });
  const currentTh = document.querySelector(`th[data-sort="${sortColumn}"]`);
  if (currentTh) {
    currentTh.classList.add(sortOrder === "asc" ? "sorted-asc" : "sorted-desc");
    currentTh.querySelector(".sort-icon").textContent =
      sortOrder === "asc" ? "↑" : "↓";
  }
}
