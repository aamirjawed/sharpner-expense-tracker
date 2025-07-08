const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgot-password").value.trim();

  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/password/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert(data.message || "Reset link sent successfully!");
    form.reset(); 
  } catch (error) {
    alert("Network or server error: " + error.message);
  }
});
