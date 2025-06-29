import '../styles/DashboardPage.css';

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom"; // For redirecting

import axios from "axios"; // For API requests
import AddExpenseForm from "../components/AddExpenseForm"; // Import the form component
import EditExpenseForm from "../components/EditExpenseForm";


const DashboardPage = () => {

	const { user, logout, loading } = useContext(AuthContext); // Access context values
	const navigate = useNavigate(); // For redirecting


	const [expenses, setExpenses] = useState([]); // State to store all expenses
	const [showForm, setShowForm] = useState(false); // Show/hide add expense form
	const [loadingExpenses, setLoadingExpenses] = useState(true); // To handle fetch loading state

	const [editingExpense, setEditingExpense] = useState(null);

	const [filterCategory, setFilterCategory] = useState("");
	const [filterStartDate, setFilterStartDate] = useState("");
	const [filterEndDate, setFilterEndDate] = useState("");



	// If loading, show a loading spinner or a message
	useEffect(() => {
		if (!loading && !user) {
			// Redirect to login if the user is not logged in
			navigate("/login");
		}
	}, [user, loading, navigate]); // Re-run the effect when user or loading changes




	// Fetch all expenses for the logged-in user
	useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const res = await axios({
					method: "GET", // Explicitly stating the method
					url: "http://localhost:5000/api/expenses",
					withCredentials: true, // Include cookies (for JWT)
				});
				//console.log(res.data);
				setExpenses(res.data); // Save expenses in state
			} catch (err) {
				console.error("Error fetching expenses:", err);
			} finally {
				setLoadingExpenses(false); // Stop loading
			}
		};

		if (user) {
			fetchExpenses();
		}
	}, [user]);





	// ✅ Update existing expense in list
	const handleEditSuccess = (updatedExpense) => {
		setExpenses((prev) =>
			prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
		);
		setEditingExpense(null); // Close edit form
	};


	// Cancel edit
	const handleCancelEdit = () => {
		setEditingExpense(null);
	};




	// Optimistically update UI and call backend to delete an expense
	const handleDeleteExpense = async (expenseId) => {
		try {
			await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
				withCredentials: true, // Ensure JWT is sent with request
			});

			// Remove deleted expense from UI
			setExpenses(expenses.filter((expense) => expense.id !== expenseId));
		} catch (err) {
			console.error("Error deleting expense:", err);
		}
	};



	// Logout handler
	const handleLogout = () => {
		try {
			logout();  // Call logout from context
			navigate("/login"); // Redirect to login page after logout
		} catch (err) {
			console.error("Logout failed:", err); // Handle logout errors gracefully
		}
	};


	// Function to update UI with new expense
	const handleAddExpense = (newExpense) => {
		setExpenses((prev) => [newExpense, ...prev]);
	};



	// Handler to toggle the form
	const toggleForm = () => setShowForm(prev => !prev);

	// If still loading or no user data, show a loading message
	if (loading) {
		return <p>Loading...</p>;
	}

	// If user data is not available (user is null), show an error or redirect
	if (!user) {
		return <p>You must be logged in to view the dashboard.</p>;
	}


	return (
		<div className="dashboard-container">
			<h2 className="welcome-message">Welcome to your Dashboard 🎉</h2>

			<p className='hello-user'>Hello, <strong>{user?.name || user?.email}</strong> 👋</p>

			<div className='btn-container'>
				{/* Toggle Add Expense Form */}

				<div className="left-btn">

					{/* View Insight Button */}
					<button className="view-insights-btn" onClick={() => navigate("/insights")}>📊 View Insights</button>


				</div>

				<div className="right-btn">
					{/* Logout Button */}
					<button onClick={handleLogout} className="logout-btn">
						Logout
					</button>
				</div>

			</div>
			<button onClick={toggleForm} className="add-expense-btn">
				{showForm ? "Close Form" : "➕ Add Expense"}
			</button>


			{/* Add Expense Form (conditionally shown) */}
			{showForm && (
				<AddExpenseForm onAdd={handleAddExpense} />
			)}

			{editingExpense && (
				<EditExpenseForm
					expense={editingExpense}
					onSuccess={handleEditSuccess}
					onCancel={handleCancelEdit}
				/>
			)}




			<hr />

			<h3>Your Expenses:</h3>

			<div className="filter-controls">
				<label>
					Category:
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
					>
						<option value="">All</option>
						<option value="Food">Food</option>
						<option value="Travel">Travel</option>
						<option value="Shopping">Shopping</option>
						<option value="Utilities">Utilities</option>
						<option value="Other">Other</option>
					</select>
				</label>

				<label>
					Start Date:
					<input
						type="date"
						value={filterStartDate}
						onChange={(e) => setFilterStartDate(e.target.value)}
					/>
				</label>

				<label>
					End Date:
					<input
						type="date"
						value={filterEndDate}
						onChange={(e) => setFilterEndDate(e.target.value)}
					/>
				</label>


				{/* 🧼 Clear Filters Button */}
				<button
					onClick={() => {
						setFilterCategory("");
						setFilterStartDate("");
						setFilterEndDate("");
					}}
					className="clear-filters-btn"
				>
					Clear Filters
				</button>
			</div>

			{/* Expenses Display */}
			{loadingExpenses ? (
				<p>Loading expenses...</p>
			) : expenses.length === 0 ? (
				<p>No expenses yet. Add one above!</p>
			) : (
				<ul className="expense-list">
					{expenses

						.filter((expense) => {

							const expenseDateStr = new Date(expense.date).toISOString().split("T")[0];


							// Filter by category
							if (filterCategory && expense.category !== filterCategory) return false;

							// Filter by start date
							if (filterStartDate && expenseDateStr < filterStartDate) return false;

							// Filter by end date
							if (filterEndDate && expenseDateStr > filterEndDate) return false;

							return true;
						})

						.map((expense) => (
							<li key={expense.id}>
								<strong>₹{expense.amount}</strong> • {expense.title} • {new Date(expense.date).toLocaleDateString()}

								<div className="list-btn">
									{/* 🟢 Add Edit Button */}
									<button
										onClick={() => setEditingExpense(expense)}
										className="edit-expense-btn"
									>
										✏️ Edit
									</button>


									{/* Delete button next to each expense */}
									<button
										onClick={() => handleDeleteExpense(expense.id)}
										className="delete-expense-btn"
									>
										❌ Delete
									</button>
								</div>

							</li>
						))}
				</ul>
			)}
		</div>
	);
};

export default DashboardPage;
