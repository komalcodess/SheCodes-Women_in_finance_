
const API_URL = "http://127.0.0.1:8000/api";

export async function getExpenses() {
  const response = await fetch(`${API_URL}/expenses/`);

  if (!response.ok) {
    throw new Error("Could not load transactions.");
  }

  return response.json();
}

export async function addExpense(expense) {
  const response = await fetch(`${API_URL}/expenses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_URL}/expenses/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete transaction.");
  }
}
