const form = document.getElementById('form');
const usernameSpan = document.getElementById('username');
const tableBody = document.getElementById('expense-table-body');
const membershipBtn = document.getElementById('buy_membership')

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    getProfile();
    getAllExpenses();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value.trim());
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        alert("All fields are required");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/expense/add-expense', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ amount, description, category })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Something went wrong, try again.");
            return;
        }

        alert("Expense has been added successfully");

        // ✅ Re-fetch all expenses
        getAllExpenses();

        // ✅ Reset form only after success
        form.reset();

    } catch (error) {
        console.log("Expense js frontend error:", error);
        alert("Something went wrong.");
    }
});

async function getProfile() {
    try {
        const response = await fetch('http://localhost:5000/user/me', {
            method: "GET",
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Something went wrong in getProfile. Try again.");
            return;
        }

        if (data.name && usernameSpan) {
            usernameSpan.textContent = data.name;
        }

    } catch (error) {
        console.log("Error fetching user profile:", error);
    }
}

async function getAllExpenses() {
    try {
        const response = await fetch('http://localhost:5000/expense/all-expenses', {
            method: "GET",
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Server error while fetching expenses");
            return;
        }

        // ✅ Clear table body before inserting
        tableBody.innerHTML = '';

        data.forEach((item) => {
            const row = document.createElement('tr');
            row.id = `expense-${item.id}`;
            row.innerHTML = `
                <td>${item.category}</td>
                <td>${item.amount}</td>
                <td>${item.description}</td>
                <td><button class="delete-btn">Delete</button></td>
            `;

            // Add delete functionality
            row.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(item.id));
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching user expenses:", error);
    }
}

async function deleteExpense(id) {
    try {
        const response = await fetch(`http://localhost:5000/expense/delete-expense/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Expense does not exist");
            return;
        }

        // ✅ Remove from DOM
        const row = document.getElementById(`expense-${id}`);
        if (row) {
            row.remove();
        }

        alert('Expense deleted successfully');

    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Something went wrong while deleting the expense.");
    }
}


membershipBtn.addEventListener('click', () => {
    window.location.href = '/payment';
});


