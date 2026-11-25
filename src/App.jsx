
import { useState, useEffect } from 'react'
import './App.css'
import ExpenseChart from './ExpenseChart'

const initialTransactions = [
  { id: 1, title: 'Salary', category: 'Salary', amount: 25000, type: 'income' },
  { id: 2, title: 'Food', category: 'Personal', amount: 500, type: 'expense' },
  { id: 3, title: 'Shopping', category: 'Lifestyle', amount: 1200, type: 'expense' },
]

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('moneywise-transactions')

      if (saved !== null) {
        return JSON.parse(saved)
      }

      return initialTransactions
    } catch {
      return initialTransactions
    }
  })

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Personal')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(
      'moneywise-transactions',
      JSON.stringify(transactions)
    )
  }, [transactions])

  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + Number(item.amount), 0)

  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount), 0)

  const balance = income - expenses

  function addTransaction(e) {
    e.preventDefault()

    if (!title.trim() || !amount || Number(amount) <= 0) {
      return
    }

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      category,
      amount: Number(amount),
      type,
    }

    setTransactions((previous) => [...previous, newTransaction])

    setTitle('')
    setAmount('')
    setType('expense')
    setCategory('Personal')
  }

  function deleteTransaction(id) {
    setTransactions((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesFilter =
      filter === 'all' || item.type === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="app">
      <header className="header">
        <h1>MoneyWise</h1>
        <p>Personal Finance Dashboard</p>
      </header>

      <main className="dashboard">
        <h2>Overview</h2>

        <div className="cards">
          <div className="card">
            <p>Total Balance</p>
            <h2>₹{balance.toLocaleString('en-IN')}</h2>
          </div>

          <div className="card">
            <p>Total Income</p>
            <h2>₹{income.toLocaleString('en-IN')}</h2>
          </div>

          <div className="card">
            <p>Total Expenses</p>
            <h2>₹{expenses.toLocaleString('en-IN')}</h2>
          </div>
        </div>

        <ExpenseChart transactions={transactions} />

        <section className="add-section">
          <h2>Add Transaction</h2>

          <form onSubmit={addTransaction} className="transaction-form">
            <div className="form-group">
              <label>Transaction Name</label>
              <input
                type="text"
                placeholder="e.g. Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Personal">Personal</option>
                <option value="Food">Food</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="add-button">
              + Add Transaction
            </button>
          </form>
        </section>

        <section className="transactions">
          <h2>Transactions</h2>

          <div className="transaction-tools">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            filteredTransactions.map((item) => (
              <div className="transaction" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>

                <div className="transaction-actions">
                  <span className={item.type}>
                    {item.type === 'income' ? '+' : '-'}₹
                    {Number(item.amount).toLocaleString('en-IN')}
                  </span>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTransaction(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
