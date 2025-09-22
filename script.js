// Utility functions
function getStudents() {
  const data = localStorage.getItem("students");
  return JSON.parse(data) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// Global variables
let editIndex = null;

// Modal elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.querySelector(".modal .close");

// Form handling for registration
const form = document.getElementById("registrationForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const programme = document.getElementById("programme").value.trim();
    const year = document.getElementById("year").value.trim();
    const interests = document.getElementById("interests").value.trim();
    const photoFile = document.getElementById("photoFile").files[0];

    if (!name || !email || !programme || !year || !interests) {
      document.getElementById("formFeedback").textContent =
        "⚠️ Please fill out all required fields.";
      return;
    }

    const saveStudentData = (photoUrl) => {
      const students = getStudents();
      const studentData = { name, email, programme, year, interests, photoUrl: photoUrl || "" };
      students.push(studentData);
      saveStudents(students);
      document.getElementById("formFeedback").textContent = "✅ Registration successful!";
      form.reset();
      renderProfiles();
      renderSummary();
    };

    if (photoFile) {
      const reader = new FileReader();
      reader.onload = (e) => saveStudentData(e.target.result);
      reader.readAsDataURL(photoFile);
    } else {
      saveStudentData();
    }
  });
}


// Render profiles
function renderProfiles() {
  const cardsContainer = document.getElementById("cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";
  const students = getStudents();

  students.forEach((student, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${student.photoUrl ? `<img src="${student.photoUrl}" alt="${student.name}'s photo" class="card-photo">` : `<div class="card-photo placeholder">No Photo</div>`}
      <h3>${student.name}</h3>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Programme:</strong> ${student.programme}</p>
      <p><strong>Year:</strong> ${student.year}</p>
      <p><strong>Interests:</strong> ${student.interests}</p>
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cardsContainer.appendChild(card);
  });
}

// Render summary table
function renderSummary() {
  const tableBody = document.getElementById("summaryTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  const students = getStudents();

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.programme}</td>
      <td>${student.year}</td>
      <td>${student.interests}</td>
      <td>${student.photoUrl ? `<img src="${student.photoUrl}" alt="photo" class="thumb">` : "—"}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


// Event delegation for Edit & Remove
document.addEventListener("click", function (e) {
  const target = e.target;
  const index = parseInt(target.getAttribute("data-index"));
  const students = getStudents();

  // Remove
  if (target.classList.contains("remove-btn")) {
    students.splice(index, 1);
    saveStudents(students);
    renderProfiles();
    renderSummary();
  }

  // Edit - open modal
  if (target.classList.contains("edit-btn")) {
    const student = students[index];
    if (!student || !editModal) return;

    editIndex = index;
    editModal.style.display = "block";

    document.getElementById("editName").value = student.name;
    document.getElementById("editEmail").value = student.email;
    document.getElementById("editProgramme").value = student.programme;
    document.getElementById("editYear").value = student.year;
    document.getElementById("editInterests").value = student.interests;
    document.getElementById("editPhotoFile").value = "";
  }
});

// Modal functionality
closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
  editIndex = null;
});

window.addEventListener("click", function(e) {
  if (e.target === editModal) {
    editModal.style.display = "none";
    editIndex = null;
  }
});

// Handle modal edit form submit
if (editForm) {
  editForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (editIndex === null) return;

    const students = getStudents();
    const name = document.getElementById("editName").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const programme = document.getElementById("editProgramme").value.trim();
    const year = document.getElementById("editYear").value.trim();
    const interests = document.getElementById("editInterests").value.trim();
    const photoFile = document.getElementById("editPhotoFile").files[0];

    const saveStudentData = (photoUrl) => {
      students[editIndex] = {
        name,
        email,
        programme,
        year,
        interests,
        photoUrl: photoUrl || students[editIndex].photoUrl
      };
      saveStudents(students);
      editModal.style.display = "none";
      renderProfiles();
      renderSummary();
      editIndex = null;
    };

    if (photoFile) {
      const reader = new FileReader();
      reader.onload = e => saveStudentData(e.target.result);
      reader.readAsDataURL(photoFile);
    } else {
      saveStudentData();
    }
  });
}

// Auto-render on page load
if (document.getElementById("cards")) renderProfiles();
if (document.getElementById("summaryTableBody")) renderSummary();
