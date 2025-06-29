import React, { useState } from "react";
import axios from "axios";

const AddExpenseForm = ({ onAdd }) => {

    // Local state for form fields
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [title, settitle] = useState("");



    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default page reload

        try {
            console.log(amount);
            console.log(category);
            console.log(date);
            console.log(title);
            const response = await axios.post(
                "http://localhost:5000/api/expenses",
                {
                    amount,
                    category,
                    date,
                    title,
                },
                {
                    withCredentials: true, // Include the cookie-based JWT
                }
                
            );
            console.log(response.data.newExpense);
            const newExpense = response.data.newExpense;
            
            onAdd(newExpense); // Call the callback to update expenses in Dashboard

            // Clear form fields after successful submission
            setAmount("");
            setCategory("");
            setDate("");
            settitle("");
        } catch (error) {
            console.error("Error adding expense:", error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-expense-form">
            <h3>Add New Expense</h3>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Description"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Category (e.g., Food, Travel)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />

            

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;
