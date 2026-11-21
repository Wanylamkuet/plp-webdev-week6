# SpendWise — Interactive Personal Finance Dashboard

SpendWise is a responsive personal finance dashboard that enables users to set a monthly budget, log categorized expenses, track spending progress against category limits, and receive real-time visual feedback directly on the page.

## Improvements Made This Week
- Upgraded SpendWise from browser `prompt()` and `console.log()` interactions to an interactive web interface with live forms, buttons, dynamic category cards, and a scrollable transaction log.
- Replaced isolated single-expense variables with a structured array of expense objects that can be added, removed, or cleared dynamically.
- Added a live budget status banner that changes color and messaging automatically based on current spending ratios.

## How JavaScript Concepts Are Implemented

### 1. Conditionals (`if / else if / else`)
- **`evaluateBudgetHealth()`** checks whether the user is over budget (`remaining < 0`), nearing their limit (`usageRatio >= 0.8`), or safely on track, dynamically switching CSS alert classes (`alert-danger`, `alert-warning`, `alert-good`) and warning messages.
- **`renderCategoryCards()`** checks if spending in any expense category exceeds its target limit (`spent > limit`) to flag the card badge and progress bar in red, while treating the `Savings` category as a positive goal.

### 2. Arrays (`expenses`)
- All expense records are stored in an `expenses` array of objects (`{ id, title, category, amount }`).
- Adding an expense pushes a new object onto `expenses`, while removing an item filters the array by `id` and triggers a full UI recalculation.

### 3. Loops (`for` and `for...of`)
- **`calculateTotalExpenses()`** uses a `for` loop to iterate through `expenses` and sum total spending.
- **`calculateCategoryTotal()`** uses a `for...of` loop to sum amounts matching a specific category.
- **`renderCategoryCards()`** loops over `Object.keys(categoryLimits)` to update every card's amount, percentage badge, and progress bar width.
- **`renderExpenseList()`** loops backward through `expenses` so the newest transactions appear first in the list.

### 4. DOM Manipulation
- Elements are selected via `document.getElementById()` and updated dynamically using `.textContent`, `.style.width`, `.classList`, and `document.createElement()` so all financial metrics render directly in the UI.

### 5. Event Handling (`addEventListener`)
- **`submit` events** on `#budget-form` and `#expense-form` call `event.preventDefault()`, validate inputs, update application state, and refresh the dashboard.
- **`click` events** on `#expense-list` (via event delegation) and `#clear-expenses-btn` allow users to delete individual entries or reset all records.

## Challenges & Resolutions
- **Keeping Header Totals, Category Cards, and Expense History in Sync:** Updating individual DOM elements inside separate event handlers risked leaving parts of the UI out of date. This was resolved by centralizing all rendering logic inside a single `updateDashboard()` function called after every state change.
- **Handling Dynamic Delete Buttons:** Because expense list items are created dynamically after page load, attaching listeners directly to each button was inefficient. Using event delegation on the parent `<ul>` (`#expense-list`) and reading `data-id` cleanly handles deletions for any newly added item.
