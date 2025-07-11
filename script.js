const form = document.getElementById("jobForm");
const tableBody = document.querySelector("#jobTable tbody");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const submitBtn = document.getElementById("submitBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");

let applications = JSON.parse(localStorage.getItem("applications")) || [];
let editIndex = -1;

function renderApplications(filter = "") {
  tableBody.innerHTML = "";

  applications
    .filter(app => app.company.toLowerCase().includes(filter.toLowerCase()))
    .forEach((app, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.position}</td>
        <td>${app.date}</td>
        <td>${app.status}</td>
        <td>
          <button class="edit" onclick="editApplication(${index})">Edit</button>
          <button class="delete" onclick="deleteApplication(${index})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const company = document.getElementById("company").value.trim();
  const position = document.getElementById("position").value.trim();
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;

  if (!company || !position || !date || !status) {
    alert("Please fill in all fields.");
    return;
  }

  const newApp = { company, position, date, status };

  if (editIndex === -1) {
    applications.push(newApp);
  } else {
    applications[editIndex] = newApp;
    editIndex = -1;
    submitBtn.textContent = "Add Application";
  }

  localStorage.setItem("applications", JSON.stringify(applications));
  renderApplications(searchInput.value);
  form.reset();
});

function deleteApplication(index) {
  applications.splice(index, 1);
  localStorage.setItem("applications", JSON.stringify(applications));
  renderApplications(searchInput.value);
}

function editApplication(index) {
  const app = applications[index];
  document.getElementById("company").value = app.company;
  document.getElementById("position").value = app.position;
  document.getElementById("date").value = app.date;
  document.getElementById("status").value = app.status;
  editIndex = index;
  submitBtn.textContent = "Update Application";
}

searchInput.addEventListener("input", () => {
  renderApplications(searchInput.value);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ✅ CSV Export Feature
downloadCsvBtn.addEventListener("click", () => {
  if (applications.length === 0) {
    alert("No applications to export!");
    return;
  }

  const csvHeaders = ["Company", "Position", "Date", "Status"];
  const csvRows = [
    csvHeaders.join(","), // header row
    ...applications.map(app =>
      [app.company, app.position, app.date, app.status].map(field => `"${field}"`).join(",")
    )
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "job_applications.csv";
  a.click();

  URL.revokeObjectURL(url);
});

// Initial render
renderApplications();
