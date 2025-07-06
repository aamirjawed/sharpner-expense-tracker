const form = document.getElementById('form');
const membershipBtn = document.getElementById('buy_membership')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("All fields are required");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed. Try again!");
            return;
        }

        

        // Redirect after saving the token
        window.location.href = "/expense/add-expense"; // adjust path if needed

    } catch (err) {
        alert("Something went wrong");
        console.error("Login error:", err);
    }
});


// membershipBtn.addEventListener('click', () => {
//     window.location.href = '/payment/';
// });
