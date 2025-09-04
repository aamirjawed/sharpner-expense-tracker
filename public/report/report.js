async function loadExpenses() {
  const groupBy = document.getElementById('groupBy').value;
  const tableBody = document.querySelector('#expenseTable tbody');

  try {
    const response = await fetch(`http://localhost:5000/expense/view-report?groupBy=${groupBy}`, {
      method: "GET",
      credentials: 'include'
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || 'Failed to load data');
      return;
    }

    // Clear old rows
    tableBody.innerHTML = '';

    if (!result.data || result.data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No expenses found</td></tr>`;
      return;
    }

    // Insert rows
    result.data.forEach(expense => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${Number(expense.amount).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });

    // ✅ Add total expense row at bottom
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
      <td style="font-weight: bold;">${Number(result.totalAmount).toLocaleString()}</td>
    `;
    tableBody.appendChild(totalRow);

  } catch (error) {
    console.error('Error loading expenses:', error.message || error);
    alert('An error occurred while loading the report.');
  }
}
