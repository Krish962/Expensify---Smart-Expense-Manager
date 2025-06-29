const express = require('express');
const router = express.Router();
const { 
    addExpense, 
    getExpenses, 
    updateExpense, 
    deleteExpense, 
    getInsights
} = require('../controllers/expenseController');
const verifyToken = require('../middleware/authMiddleware');

// Route: POST /api/expenses
// Purpose: Create new expense
router.post('/', verifyToken, addExpense);

// Route: GET /api/expenses 
// Purpose: Get all expenses
router.get('/', verifyToken, getExpenses);

// Route: PUT /api/expenses/:id 
// Purpose: Update expense
router.put('/:id', verifyToken, updateExpense);

// Rouute: DELETE /api/expenses/:id 
// Purpose: Delete expense
router.delete('/:id', verifyToken, deleteExpense);

// Rouute: GET /api/expenses/insights 
// Purpose: Delete expense
router.get('/insights', verifyToken, getInsights);

module.exports = router;
