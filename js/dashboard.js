if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "index.html";
}

let usersData = [];
let editingId = null;

// LOAD USERS
function loadUsers() {
  const data = localStorage.getItem("usersData");
  if (data) {
    usersData = JSON.parse(data);
    showUsers();
  } else {
    fetch("data/users.json")
      .then(res => res.json())
      .then(data => {
        usersData = data;
        save();
        showUsers();
      });
  }
}
loadUsers();

function save() {
  localStorage.setItem("usersData", JSON.stringify(usersData));
}

// SHOW USERS
function showUsers() {
  document.getElementById("pageTitle").innerText = "Users";
  document.getElementById("totalUsers").innerText = usersData.length;

  displayUsers(usersData);
}

function displayUsers(data) {
  let html = `
  <table>
    <tr>
      <th>ID</th><th>Name</th><th>Role</th>
      <th>Status</th><th>Actions</th>
    </tr>`;

  data.forEach(u => {
    html += `
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.role}</td>
      <td><button onclick="toggleStatus(${u.id})">${u.status}</button></td>
      <td>
        <button onclick="editUser(${u.id})">Edit</button>
        <button onclick="deleteUser(${u.id})">Delete</button>
      </td>
    </tr>`;
  });

  html += `</table>`;
  document.getElementById("contentArea").innerHTML = html;
}

// SEARCH
function searchUser() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = usersData.filter(u => u.name.toLowerCase().includes(q));
  displayUsers(filtered);
}

// ADD USER
function showAddUserForm() {
  document.getElementById("contentArea").innerHTML = `
    <h3>Add User</h3>
    <input id="newName" placeholder="Name"><br>
    <input id="newRole" placeholder="Role"><br>
    <select id="newStatus">
      <option>Active</option>
      <option>Inactive</option>
    </select><br><br>
    <button onclick="addUser()">Add</button>
    <button onclick="showUsers()">Cancel</button>
  `;
}

function addUser() {
  const name = newName.value;
  const role = newRole.value;
  const status = newStatus.value;

  if (!name || !role) return alert("Fill all fields");

  const id = usersData.length ? Math.max(...usersData.map(u => u.id)) + 1 : 1;
  usersData.push({ id, name, role, status });
  save();
  showUsers();
}

// EDIT
function editUser(id) {
  const u = usersData.find(x => x.id === id);
  editingId = id;

  document.getElementById("contentArea").innerHTML = `
    <h3>Edit User</h3>
    <input id="editName" value="${u.name}"><br>
    <input id="editRole" value="${u.role}"><br><br>
    <button onclick="saveEdit()">Save</button>
    <button onclick="showUsers()">Cancel</button>
  `;
}

function saveEdit() {
  const name = editName.value;
  const role = editRole.value;

  usersData.forEach(u => {
    if (u.id === editingId) {
      u.name = name;
      u.role = role;
    }
  });

  save();
  showUsers();
}

// DELETE
function deleteUser(id) {
  usersData = usersData.filter(u => u.id !== id);
  save();
  showUsers();
}

// TOGGLE STATUS
function toggleStatus(id) {
  usersData.forEach(u => {
    if (u.id === id)
      u.status = u.status === "Active" ? "Inactive" : "Active";
  });
  save();
  showUsers();
}

// REPORTS
function showReports() {
  const active = usersData.filter(u => u.status === "Active").length;
  const inactive = usersData.length - active;
  const max = usersData.length || 1;

  document.getElementById("pageTitle").innerText = "Reports";
  document.getElementById("contentArea").innerHTML = `
    <div class="stats">
      <div class="card">Active: ${active}</div>
      <div class="card">Inactive: ${inactive}</div>
      <div class="card">Total: ${usersData.length}</div>
    </div>

    <button onclick="downloadReport()">Download</button>
    <button onclick="showUsers()">Back</button>

    <div class="chart">
      <div class="bar" style="height:${(active/max)*150}px;background:green"></div>
      <div class="bar" style="height:${(inactive/max)*150}px;background:red"></div>
    </div>
  `;
}

// DOWNLOAD
function downloadReport() {
  const blob = new Blob(
    [`Total Users: ${usersData.length}`],
    { type: "text/plain" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "report.txt";
  a.click();
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
