import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (item) => item.type === 'expense'
  )

  const categoryTotals = {}

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount)
  })

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses (₹)',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#818cf8',
          '#34d399',
          '#fbbf24',
          '#fb7185',
          '#38bdf8',
          '#a78bfa',
          '#fb923c',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return '₹' + context.parsed.y.toLocaleString('en-IN')
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a1a1aa',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#a1a1aa',
          callback: function (value) {
            return '₹' + value.toLocaleString('en-IN')
          },
        },
        grid: {
          color: '#252b3a',
        },
      },
    },
  }

  return (
    <section className="chart-section">
      <h2>Expenses by Category</h2>

      <div className="chart-container">
        {expenses.length === 0 ? (
          <p className="chart-empty">
            Add some expenses to see your chart.
          </p>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  )
}

export default ExpenseChart