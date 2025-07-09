const form = document.getElementById('reset-form'); // typo fixed from 'reset-from'

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      // Get reset token from URL
      const pathParts = window.location.pathname.split('/');
      const token = pathParts[pathParts.length - 1];

      const response = await fetch(`/user/password/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmPassword
        })
      });

      const data = await response.text();

      if (response.ok) {
        alert('Password reset successful');
        window.location.href = '/login'; // redirect if needed
      } else {
        alert(data || 'Failed to reset password');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while resetting your password');
    }
  });