
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'

const COLORS = [
  '#8054bd',
  '#b69add',
  '#e5a4ca',
  '#f4c58a',
  '#8db9a5',
  '#86a9df',
  '#e58c8c',
  '#c4b5a5'
]

export default function SpendingChart({ entries = [] }) {
  const data = useMemo(() => {
    const totals = {}

    entries
      .filter(item => {
        const amount = Number(item.amount)
        return item.type === 'expense' && Number.isFinite(amount)
      })
      .forEach(item => {
        const category = item.category || 'Other'
        totals[category] =
          (totals[category] || 0) + Math.abs(Number(item.amount))
      })

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
  }, [entries])

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="budget-card spending-chart-card">
      <h2>Where your money goes</h2>
      <p>See how your expenses are distributed across categories.</p>

      {data.length === 0 ? (
        <p>Add an expense to see your spending breakdown.</p>
      ) : (
        <>
          <h2>₹{total.toLocaleString('en-IN')}</h2>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={value =>
                    `₹${Number(value).toLocaleString('en-IN')}`
                  }
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  )
}
