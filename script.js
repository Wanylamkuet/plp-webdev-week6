// =========================================
// 1. Application State (Arrays & Objects)
// =========================================
let monthlyBudget = 3000;

// Category limits used to calculate card progress bars
const categoryLimits = {
  Rent: 1200,
  Food: 550,
  Transport: 250,
  Utilities: 200,
  Entertainment: 200,
  Savings: 600
};

// Array storing multiple expense records
let expenses = [
  { id: 1, title: "Apartment Rent", category: "Rent", amount: 1200 },
  { id: 2, title: "Supermarket Groceries", category: "Food", amount: 245.5 },
  { id: 3, title: "Monthly Transit Pass", category: "Transport", amount: 85 },
  { id: 4, title: "Electricity & Fiber Internet", category: "Utilities", amount: 142 },
  { id: 5, title: "Cinema & Streaming", category: "Entertainment", amount: 55 },
  { id: 6, title: "Emergency Fund Transfer", category: "Savings", amount: 400 }
];

// =========================================
// 2. DOM Element Selections
// =========================================
const headerBudgetEl = document.getElementById("header-budget");
const headerSpentEl = document.getElementById("header-spent");
const headerRemainingEl = document.getElementById("header-remaining");
const budgetAlertEl = document.getElementById("budget-alert");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const expenseTitleInput = document.getElementById("expense-title");
const expenseCategoryInput = document.getElementById("expense-category");
const expenseAmountInput = document.getElementById("expense-amount");

const expenseListEl = document.getElementById("expense-list");
const clearExpensesBtn = document.getElementById("clear-expenses-btn");

// =========================================
// 3. Calculation & Decision Functions
// =========================================

/**
 * Uses a loop to calculate total spending across all expense records.
 */
function calculateTotalExpenses() {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }
  return total;
}

/**
 * Uses a loop to sum expenses belonging to a specific category.
 */
function calculateCategoryTotal(categoryName) {
  let categoryTotal = 0;
  for (const item of expenses) {
    if (item.category === categoryName) {
      categoryTotal += item.amount;
    }
  }
  return categoryTotal;
}

/**
 * Uses conditional statements to evaluate budget health and update the alert banner.
 */
function evaluateBudgetHealth(totalSpent, remaining) {
  const usageRatio = monthlyBudget > 0 ? totalSpent / monthlyBudget : 1;

  budgetAlertEl.classList.remove("alert-good", "alert-warning", "alert-danger");
  headerRemainingEl.classList.remove("negative");

  if (remaining < 0) {
    budgetAlertEl.classList.add("alert-danger");
    headerRemainingEl.classList.add("negative");
    budgetAlertEl.textContent = `Over Budget Alert: You have exceeded your monthly budget by $${Math.abs(remaining).toFixed(2)}.`;
  } else if (usageRatio >= 0.8) {
    budgetAlertEl.classList.add("alert-warning");
    budgetAlertEl.textContent = `Heads Up: You have used ${(usageRatio * 100).toFixed(1)}% of your budget. Only $${remaining.toFixed(2)} remains.`;
  } else {
    budgetAlertEl.classList.add("alert-good");
    budgetAlertEl.textContent = `On Track: You have used ${(usageRatio * 100).toFixed(1)}% of your budget with $${remaining.toFixed(2)} remaining.`;
  }
}

// =========================================
// 4. DOM Rendering Functions
// =========================================

/**
 * Updates each of the six category cards dynamically using loops and conditionals.
 */
function renderCategoryCards() {
  const categories = Object.keys(categoryLimits);

  for (const category of categories) {
    const spent = calculateCategoryTotal(category);
    const limit = categoryLimits[category];
    const percent = Math.round((spent / limit) * 100);
    const cappedWidth = Math.min(percent, 100);

    const amountEl = document.getElementById(`amount-${category}`);
    const badgeEl = document.getElementById(`badge-${category}`);
    const progressEl = document.getElementById(`progress-${category}`);

    amountEl.textContent = `$${spent.toFixed(2)}`;
    progressEl.style.width = `${cappedWidth}%`;

    if (category === "Savings") {
      badgeEl.textContent = `${percent}% Goal`;
      badgeEl.classList.remove("over-limit");
    } else if (spent > limit) {
      badgeEl.textContent = `Over Limit (${percent}%)`;
      badgeEl.classList.add("over-limit");
      progressEl.classList.add("danger-fill");
    } else {
      badgeEl.textContent = `${percent}% Used`;
      badgeEl.classList.remove("over-limit");
      progressEl.classList.remove("danger-fill");
    }
  }
}

/**
 * Loops through the expenses array and renders each item in the DOM.
 */
function renderExpenseList() {
  expenseListEl.innerHTML = "";

  if (expenses.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No expenses recorded yet. Use the form above to add one.";
    expenseListEl.appendChild(emptyItem);
    return;
  }

  for (let i = expenses.length - 1; i >= 0; i--) {
    const expense = expenses[i];

    const li = document.createElement("li");
    li.className = "expense-item";

    li.innerHTML = `
      <div class="expense-info">
        <span class="expense-title">${expense.title}</span>
        <span class="expense-category-tag">${expense.category}</span>
      </div>
      <div class="expense-actions">
        <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
        <button type="button" class="delete-btn" data-id="${expense.id}" aria-label="Delete ${expense.title}">
          Remove
        </button>
      </div>
    `;

    expenseListEl.appendChild(li);
  }
}

/**
 * Master refresh function connecting calculations, conditionals, and DOM updates.
 */
function updateDashboard() {
  const totalSpent = calculateTotalExpenses();
  const remainingBalance = monthlyBudget - totalSpent;

  headerBudgetEl.textContent = `$${monthlyBudget.toFixed(2)}`;
  headerSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
  headerRemainingEl.textContent = `$${remainingBalance.toFixed(2)}`;

  evaluateBudgetHealth(totalSpent, remainingBalance);
  renderCategoryCards();
  renderExpenseList();
}

// =========================================
// 5. Event Listeners (User Interactions)
// =========================================

// Update monthly budget on form submit
budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newBudget = Number(budgetInput.value);

  if (newBudget > 0) {
    monthlyBudget = newBudget;
    updateDashboard();
  }
});

// Add a new expense record to the array on form submit
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = expenseTitleInput.value.trim();
  const category = expenseCategoryInput.value;
  const amount = Number(expenseAmountInput.value);

  if (title === "" || isNaN(amount) || amount <= 0) {
    return;
  }

  const newExpense = {
    id: Date.now(),
    title: title,
    category: category,
    amount: amount
  };

  expenses.push(newExpense);
  expenseForm.reset();
  updateDashboard();
});

// Remove individual expense using event delegation
expenseListEl.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const idToDelete = Number(event.target.getAttribute("data-id"));
    expenses = expenses.filter(function (item) {
      return item.id !== idToDelete;
    });
    updateDashboard();
  }
});

// Clear all expenses on button click
clearExpensesBtn.addEventListener("click", function () {
  expenses = [];
  updateDashboard();
});

// =========================================
// 6. Initialize Dashboard on Load
// =========================================
updateDashboard();
