import { useState } from 'react'
import useLocalStorage from './utils/useLocalStorage'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  Calculator,
  GraduationCap,
  ShieldCheck,
  Settings,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import './App.css'

const transactions = [
  { title: 'Grocery shopping', category: 'Food & groceries', date: 'Today, 10:30 AM', amount: -850, icon: '🛍️' },
  { title: 'Home business income', category: 'Business', date: 'Today, 9:15 AM', amount: 2400, icon: '🧵' },
  { title: 'Electricity bill', category: 'Utilities', date: 'Yesterday', amount: -650, icon: '💡' },
  { title: 'Freelance payment', category: 'Income', date: 'Yesterday', amount: 3200, icon: '💻' },
]

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Transactions', icon: ArrowLeftRight },
  { name: 'My budget', icon: Wallet },
  { name: 'Savings goals', icon: Target },
  { name: 'SIP & EMI', icon: Calculator },
  { name: 'Learn finance', icon: GraduationCap },
  { name: 'Private vault', icon: ShieldCheck },
]
const initialTransactions = [
  {
    id: 1,
    title: 'Groceries',
    category: 'Food',
    amount: 1200,
    type: 'expense',
    date: '2026-10-18',
  },
  {
    id: 2,
    title: 'Salary',
    category: 'Income',
    amount: 15000,
    type: 'income',
    date: '2026-10-17',
  },
]
function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [entryType, setEntryType] = useState('Expense')
const [entries, setEntries] = useLocalStorage(
  'shecodes-transactions',
  initialTransactions
)  
const [monthlyBudget, setMonthlyBudget] = useLocalStorage(
  'shecodes-monthly-budget',
  15000
)
const [budgetInput, setBudgetInput] = useState(() =>
  String(monthlyBudget)
)
const [goals, setGoals] = useLocalStorage('shecodes-savings-goals', [
  { id: 1, name: 'Emergency fund', target: 10000, saved: 2500 },
  { id: 2, name: 'Learning & skills', target: 5000, saved: 1200 },
])
  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [contributionInputs, setContributionInputs] = useState({})

  const [form, setForm] = useState({ title: '', amount: '', category: 'Other' })

  const income = entries.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0)
  const expenses = entries.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0)
  const balance = income - expenses

  function addTransaction(event) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) return

    setEntries((current) => [
      {
        title: form.title.trim(),
        category: form.category,
        date: 'Just now',
        amount: entryType === 'Income' ? amount : -amount,
        icon: entryType === 'Income' ? '💰' : '🧾',
      },
      ...current,
    ])
    setForm({ title: '', amount: '', category: 'Other' })
    setShowForm(false)
  }
  function deleteTransaction(indexToDelete) {
  setEntries((currentEntries) =>
    currentEntries.filter((_, index) => index !== indexToDelete)
  )
}
  
  function saveBudget(event) {
    event.preventDefault()
    const amount = Number(budgetInput)

    if (!Number.isFinite(amount) || amount <= 0) return

    setMonthlyBudget(amount)
  }

  function addGoal(event) {
    event.preventDefault()
    const target = Number(goalTarget)

    if (!goalName.trim() || !Number.isFinite(target) || target <= 0) return

    setGoals((current) => [
      ...current,
      {
        id: Date.now(),
        name: goalName.trim(),
        target,
        saved: 0,
      },
    ])

    setGoalName('')
    setGoalTarget('')
  }

  function contributeToGoal(id) {
    const amount = Number(contributionInputs[id])

    if (!Number.isFinite(amount) || amount <= 0) return

    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              saved: Math.min(goal.target, goal.saved + amount),
            }
          : goal
      )
    )

    setContributionInputs((current) => ({
      ...current,
      [id]: '',
    }))
  }


  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22} /></div>
          <div><strong>shecodes</strong><span>YOUR MONEY, YOUR POWER</span></div>
          <button className="close-menu" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>

        <div className="profile">
          <div className="avatar">S</div>
          <div><strong>Namaste! 👋</strong><span>Your financial journey</span></div>
        </div>

        <span className="nav-label">YOUR SPACE</span>
        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button key={name} className={`nav-item ${activePage === name ? 'active' : ''}`} onClick={() => { setActivePage(name); setMenuOpen(false) }}>
              <Icon size={19} /><span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="encouragement"><Sparkles size={17} /><p>Small steps today.<br /><strong>Stronger finances tomorrow.</strong></p></div>
          <button className="nav-item" onClick={() => { setActivePage('Settings'); setMenuOpen(false) }}><Settings size={19} /><span>Settings</span></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="breadcrumb">My space <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <button className="language-button" onClick={() => alert('Hindi language support will be added in the next step.')}>हिंदी</button>
            <button className="icon-button" aria-label="Notifications"><Bell size={19} /></button>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div><span className="eyebrow">YOUR FINANCIAL WELLNESS SPACE</span><h1>Good morning, Sakhi <span>✿</span></h1><p>Every rupee you manage is a step towards your dreams.</p></div>
            <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Add transaction</button>
          </section>

          {activePage === 'Dashboard' ? (
            <>
              <section className="balance-banner">
                <div className="balance-copy"><span><IndianRupee size={15} /> YOUR TRACKED BALANCE</span><h2>{formatMoney(balance)}</h2><p>A simple snapshot of your recorded money.</p></div>
                <div className="balance-decoration"><div className="decor-circle circle-one" /><div className="decor-circle circle-two" /><Wallet size={56} strokeWidth={1.1} /></div>
              </section>

              <section className="summary-grid">
                <article className="summary-card"><div className="summary-heading"><span>Money in</span><span className="summary-icon income-icon"><TrendingUp size={19} /></span></div><h3>{formatMoney(income)}</h3><p>Recorded income</p></article>
                <article className="summary-card"><div className="summary-heading"><span>Money out</span><span className="summary-icon expense-icon"><TrendingDown size={19} /></span></div><h3>{formatMoney(expenses)}</h3><p>Recorded expenses</p></article>
                <article className="summary-card"><div className="summary-heading"><span>Left from entries</span><span className="summary-icon savings-icon"><Target size={19} /></span></div><h3>{formatMoney(balance)}</h3><p>Income minus expenses</p></article>
              </section>

              <section className="content-grid">
                <article className="panel transactions-panel">
                  <div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest money movements</p></div><button className="text-button" onClick={() => setActivePage('Transactions')}>View all →</button></div>
                  <div className="transaction-list">
                    {entries.slice(0, 5).map((item, index) => (
                      <div className="transaction-row" key={`${item.title}-${index}`}>
                        <div className="transaction-emoji">{item.icon}</div>
                        <div className="transaction-info"><strong>{item.title}</strong><span>{item.category} · {item.date}</span></div>
                        <strong className={`transaction-amount ${item.amount > 0 ? 'positive' : 'negative'}`}>{item.amount > 0 ? '+' : '−'}{formatMoney(Math.abs(item.amount))}</strong>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel goals-panel"><div className="panel-heading"><div><h2>Your savings dreams</h2><p>Little by little, you get there.</p></div><Target size={21} /></div>
                  <div className="goal-illustration">🌱</div>
                  <h3>Start with your first goal</h3>
                  <p className="goal-description">An emergency fund, a course, or your own business — every dream deserves a plan.</p>
                  <button className="secondary-button" onClick={() => setActivePage('Savings goals')}>Explore savings goals</button>
                </article>
              </section>

              <section className="learning-banner"><div className="learning-icon"><GraduationCap size={25} /></div><div><span>YOUR NEXT LITTLE LESSON</span><h3>Make your money work for your dreams</h3><p>Build confidence with one small lesson at a time.</p></div><button onClick={() => setActivePage('Learn finance')}>Start learning →</button></section>
            </>
          ) : activePage === 'Transactions' ? (
            <section className="panel full-panel"><div className="panel-heading"><div><h2>All transactions</h2><p>Your recorded income and expenses</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> Add new</button></div>
            <div className="transaction-list">
  {entries.map((item, index) => (
    <div
      className="transaction-row"
      key={`${item.title}-${index}`}
    >
      <div className="transaction-emoji">{item.icon}</div>

      <div className="transaction-info">
        <strong>{item.title}</strong>
        <span>{item.category} · {item.date}</span>
      </div>

      <strong
        className={`transaction-amount ${
          item.amount > 0 ? 'positive' : 'negative'
        }`}
      >
        {item.amount > 0 ? '+' : '−'}
        {formatMoney(Math.abs(item.amount))}
      </strong>

      <button
        type="button"
        className="delete-button"
        onClick={() => deleteTransaction(index)}
      >
        Delete
      </button>
    </div>
  ))}
</div>
            </section>
          ) : activePage === 'My budget' ? (
            <section className="budget-layout">
              <div className="panel budget-card">
                <span className="eyebrow">YOUR MONTHLY PLAN</span>
                <h2>Set your budget</h2>
                <p>Choose how much you plan to spend this month.</p>
                <form onSubmit={saveBudget} className="budget-form">
                  <label htmlFor="budgetInput">Monthly budget (₹)</label>
                  <input id="budgetInput" type="number" min="1" value={budgetInput} onChange={(event) => setBudgetInput(event.target.value)} required />
                  <button type="submit" className="primary-button">Save budget</button>
                </form>
              </div>

              <div className="panel budget-card">
                <span className="eyebrow">BUDGET OVERVIEW</span>
                <h2>{formatMoney(monthlyBudget)}</h2>
                <p>Monthly budget</p>
                <div className="budget-stat"><span>Recorded expenses</span><strong>{formatMoney(expenses)}</strong></div>
                <div className="budget-stat"><span>Remaining</span><strong className={monthlyBudget - expenses < 0 ? 'over-budget' : ''}>{formatMoney(monthlyBudget - expenses)}</strong></div>
                <div className="goal-progress"><div className="goal-progress-fill" style={{ width: `${Math.min((expenses / monthlyBudget) * 100, 100)}%` }} /></div>
                <p className="helper-text">This demo uses all recorded expenses, not only expenses from the current month.</p>
              </div>
            </section>
          ) : activePage === 'Savings goals' ? (
            <section className="goals-page">
              <div className="panel goal-form-panel">
                <span className="eyebrow">PLAN FOR YOUR FUTURE</span>
                <h2>Create a savings goal</h2>
                <form onSubmit={addGoal} className="goal-form">
                  <div>
                    <label htmlFor="goalName">Goal name</label>
                    <input id="goalName" type="text" placeholder="e.g. Emergency fund" value={goalName} onChange={(event) => setGoalName(event.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="goalTarget">Target amount (₹)</label>
                    <input id="goalTarget" type="number" min="1" placeholder="10000" value={goalTarget} onChange={(event) => setGoalTarget(event.target.value)} required />
                  </div>
                  <button type="submit" className="primary-button"><Plus size={18} /> Create goal</button>
                </form>
              </div>

              <div className="goals-grid">
                {goals.map((goal) => {
                  const progress = Math.min(Math.round((goal.saved / goal.target) * 100), 100)
                  return (
                    <div className="panel goal-card" key={goal.id}>
                      <div className="goal-card-heading">
                        <div className="goal-icon"><Target size={22} /></div>
                        <span className="goal-percent">{progress}%</span>
                      </div>
                      <h3>{goal.name}</h3>
                      <p className="goal-saved">{formatMoney(goal.saved)} saved</p>
                      <div className="goal-progress"><div className="goal-progress-fill" style={{ width: `${progress}%` }} /></div>
                      <p className="goal-target">Target: {formatMoney(goal.target)}</p>
                      {goal.saved < goal.target ? (
                        <form className="contribution-form" onSubmit={(event) => { event.preventDefault(); contributeToGoal(goal.id) }}>
                          <input aria-label={`Contribution for ${goal.name}`} type="number" min="1" placeholder="Amount to add (₹)" value={contributionInputs[goal.id] || ''} onChange={(event) => setContributionInputs((current) => ({ ...current, [goal.id]: event.target.value }))} required />
                          <button type="submit" className="primary-button">Add savings</button>
                        </form>
                      ) : (
                        <p className="goal-complete">Goal reached!</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ) : (
            <section className="panel feature-placeholder"><div className="placeholder-icon"><Sparkles size={30} /></div><span className="eyebrow">COMING TO YOUR SPACE</span><h2>{activePage}</h2><p>This section is part of the SheCodes roadmap. We'll build its real functionality in the next development steps.</p><button className="secondary-button" onClick={() => setActivePage('Dashboard')}>Back to dashboard</button></section>
          )}

          <footer className="app-footer">Made with care for every Sakhi. <span>♥</span> <small>SheCodes · Your money, your power.</small></footer>
        </div>
      </main>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-heading"><div><span className="eyebrow">YOUR MONEY, YOUR CHOICE</span><h2 id="transaction-title">Add a transaction</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setShowForm(false)}><X size={20} /></button></div>
        <div className="type-switch"><button className={entryType === 'Expense' ? 'selected expense-selected' : ''} onClick={() => setEntryType('Expense')}>Money out</button><button className={entryType === 'Income' ? 'selected income-selected' : ''} onClick={() => setEntryType('Income')}>Money in</button></div>
        <form onSubmit={addTransaction}><label>Description<input autoFocus required maxLength={80} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Vegetable sales" /></label><label>Amount (₹)<input required type="number" min="1" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="Enter amount" /></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Other</option><option>Food & groceries</option><option>Business</option><option>Transport</option><option>Utilities</option><option>Education</option><option>Healthcare</option><option>Household</option><option>Savings</option></select></label><button className="primary-button submit-button" type="submit">Save transaction</button></form>
      </section></div>}
    </div>
  )
}

export default App