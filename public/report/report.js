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
      alert('Failed to load data');
      return;
    }

    // Clear old rows
    tableBody.innerHTML = '';

    let total = 0;

    // Insert rows
    result.data.forEach(expense => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${expense.amount}</td>
      `;
      tableBody.appendChild(row);

      total += parseFloat(expense.amount);
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3" style="font-weight: bold; text-align: right;">Total:</td>
      <td style="font-weight: bold;">${total.toFixed(2)}</td>
    `;
    tableBody.appendChild(totalRow);

  } catch (error) {
    console.error('Error loading expenses:', error.message || error);
    alert('An error occurred while loading the report.');
  }
}
