



// DOM Elements
const form = document.getElementById('form');
const usernameSpan = document.getElementById('username');
const tableBody = document.getElementById('expense-table-body');
const membershipBtn = document.getElementById('buy_membership');
const downloadExpenseBtn = document.getElementById('download-expenses');
const viewReportBtn = document.getElementById('view-report-btn');
const premiumTag = document.getElementById('premium-tag');
const leaderBoardBtn = document.querySelector('.leaderboard-btn');
const leaderBoardFloating = document.getElementById('leaderboard-floating');
const leaderBoardBody = document.getElementById('leaderboard-body');

// Entry Point
window.addEventListener('DOMContentLoaded', () => {
  loadUserDashboard();
});

//  Main dashboard loading logic
async function loadUserDashboard() {
  await getProfile();
  await getAllExpenses();
  await handlePremiumFeatures();
}

// Reusable function to check premium status and perform actions
async function isUserPremium(callbackIfYes, callbackIfNo) {
  try {
    const response = await fetch("http://localhost:5000/user/check-premium", {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok && data.message === "yes") {
      callbackIfYes && callbackIfYes();
    } else {
      callbackIfNo && callbackIfNo();
    }

  } catch (error) {
    console.error("Premium check failed:", error);
    callbackIfNo && callbackIfNo();
  }
}

//  Fetch user profile and display username
async function getProfile() {
  try {
    const response = await fetch('http://localhost:5000/user/me', {
      method: "GET",
      credentials: 'include'
    });

    const data = await response.json();
    if (response.ok && data.name) {
      usernameSpan.textContent = data.name;
    }

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

// Add expense
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value.trim());
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;

  if (!amount || !description || !category) {
    return showToast("All fields are required");
  }

  try {
    const response = await fetch('http://localhost:5000/expense/add-expense', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount, description, category })
    });

    const data = await response.json();

    if (!response.ok) {
      return showToast(data.message || "Failed to add expense.");
    }

    showToast("Expense added successfully");
    form.reset();
    getAllExpenses();

  } catch (error) {
    console.error("Error adding expense:", error);
    showToast("Error occurred while adding expense.");
  }
});

//  Fetch and render all expenses
async function getAllExpenses() {
  try {
    const response = await fetch('http://localhost:5000/expense/all-expenses', {
      method: "GET",
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return showToast(data.message || "Error fetching expenses.");
    }

    tableBody.innerHTML = ''; // Clear current rows

    data.forEach((item) => {
      const row = document.createElement('tr');
      row.id = `expense-${item.id}`;
      row.innerHTML = `
        <td>${item.category}</td>
        <td>${item.amount}</td>
        <td>${item.description}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      row.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(item.id));
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading expenses:", error);
  }
}

//  Delete expense
async function deleteExpense(id) {
  try {
    const response = await fetch(`http://localhost:5000/expense/delete-expense/${id}`, {
      method: "DELETE",
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return showToast(data.message || "Expense not found.");
    }

    document.getElementById(`expense-${id}`)?.remove();
    showToast("Expense deleted");

  } catch (error) {
    console.error("Delete error:", error);
    showToast("Something went wrong while deleting.");
  }
}

//  Redirect to membership payment
membershipBtn.addEventListener('click', () => {
  window.location.href = '/payment';
});

//  Download expenses (only for premium)
downloadExpenseBtn.addEventListener('click', async () => {
  try {
    const response = await fetch("http://localhost:5000/expense/download", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errData = await response.json();
      return showToast(errData.error || "Failed to download.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Download error:", error);
    showToast("Error downloading file.");
  }
});

//  Redirect to report page
viewReportBtn.addEventListener('click', () => {
  window.location.href = '/expense/report';
});

// Load leaderboard data
async function loadLeaderBoard() {
  try {
    const response = await fetch('http://localhost:5000/user/all-users', {
      method: "GET",
      credentials: 'include'
    });

    if (!response.ok) {
      const err = await response.json();
      return showToast(err.message || "Leaderboard fetch failed");
    }

    const data = await response.json();
    leaderBoardBody.innerHTML = '';

    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.total_expense}</td>
      `;
      leaderBoardBody.appendChild(row);
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
  }
}

// Toggle leaderboard visibility
leaderBoardBtn.addEventListener('click', async () => {
  const hidden = leaderBoardFloating.classList.toggle('hidden');
  leaderBoardBtn.textContent = hidden ? 'Show Leaderboard' : 'Hide Leaderboard';
  if (!hidden) await loadLeaderBoard();
});

//  Show/hide buttons for premium features
async function handlePremiumFeatures() {
  isUserPremium(
    () => {
      premiumTag.textContent = "Premium Member";
      membershipBtn.style.display = 'none';
      downloadExpenseBtn.style.display = 'block';
      viewReportBtn.style.display = 'block';
      leaderBoardBtn.style.display = 'inline-block';
    },
    () => {
      premiumTag.textContent = "";
      premiumTag.style.display = 'none';
      downloadExpenseBtn.style.display = 'none';
      viewReportBtn.style.display = 'none';
      leaderBoardBtn.style.display = 'none';
    }
  );
}



function showToast(message, type = "info") {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
