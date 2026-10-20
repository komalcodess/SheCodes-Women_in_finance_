import React, { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Calculator,
  BookOpen,
  Lock,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/expenses/'

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)

  const [transactionForm, setTransactionForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    type: 'expense',
  })

  const [budget, setBudget] = useState({
    income: 30000,
    needs: 15000,
    wants: 8000,
    savings: 7000,
  })

  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 50000,
      saved: 18000,
    },
    {
      id: 2,
      name: 'Dream Trip',
      target: 80000,
      saved: 25000,
    },
  ])

  const [goalForm, setGoalForm] = useState({
    name: '',
    target: '',
  })

  const [calculator, setCalculator] = useState('sip')

  const [sip, setSip] = useState({
    monthly: 5000,
    rate: 12,
    years: 10,
  })

  const [emi, setEmi] = useState({
    amount: 500000,
    rate: 8,
    years: 5,
  })

  const [sipResult, setSipResult] = useState(null)
  const [emiResult, setEmiResult] = useState(null)

  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [vaultPin, setVaultPin] = useState('')

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Transactions', icon: Receipt },
    { name: 'My budget', icon: Wallet },
    { name: 'Savings goals', icon: Target },
    { name: 'SIP & EMI', icon: Calculator },
    { name: 'Learn finance', icon: BookOpen },
    { name: 'Private vault', icon: Lock },
  ]

  const lessons = [
    {
      number: '01',
      title: 'Budgeting Basics',
      text: 'Learn how to divide your income between needs, wants and savings.',
    },
    {
      number: '02',
      title: 'What is SIP?',
      text: 'Understand how investing a fixed amount regularly can build wealth.',
    },
    {
      number: '03',
      title: 'Emergency Fund',
      text: 'Learn why keeping money aside for unexpected expenses matters.',
    },
    {
      number: '04',
      title: 'Understanding EMI',
      text: 'Understand how loan interest affects the amount you repay.',
    },
    {
      number: '05',
      title: 'Track Your Expenses',
      text: 'Small expenses add up. Tracking them helps you stay in control.',
    },
    {
      number: '06',
      title: 'Saving Smartly',
      text: 'Make saving a habit instead of waiting for money to be left over.',
    },
  ]

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load transactions')
      }

      const data = await response.json()

      setTransactions(
        Array.isArray(data)
          ? data
          : data.results || []
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleTransactionSubmit(e) {
    e.preventDefault()

    if (
      !transactionForm.title ||
      !transactionForm.amount
    ) {
      alert('Please enter a title and amount.')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: transactionForm.title,
          amount: Number(transactionForm.amount),
          category: transactionForm.category,
          type: transactionForm.type,
        }),
      })

      if (!response.ok) {
        throw new Error('Could not save transaction')
      }

      const saved = await response.json()

      setTransactions((prev) => [saved, ...prev])

      setTransactionForm({
        title: '',
        amount: '',
        category: 'Food',
        type: 'expense',
      })

      setShowModal(false)
    } catch (error) {
      console.error(error)

      alert(
        'Could not save the transaction. Make sure Django is running.'
      )
    }
  }

  async function deleteTransaction(id) {
    if (!id) return

    const confirmed = window.confirm(
      'Delete this transaction?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `${API_URL}${id}/`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setTransactions((prev) =>
        prev.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.error(error)
      alert('Could not delete this transaction.')
    }
  }

  const expenses = useMemo(
    () =>
      transactions
        .filter(
          (item) =>
            item.type !== 'income' &&
            item.transaction_type !== 'income'
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.amount || 0),
          0
        ),
    [transactions]
  )

  const income = useMemo(
    () =>
      transactions
        .filter(
          (item) =>
            item.type === 'income' ||
            item.transaction_type === 'income'
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.amount || 0),
          0
        ),
    [transactions]
  )

  const balance =
    income > 0
      ? income - expenses
      : budget.income - expenses

  function calculateSIP() {
    const P = Number(sip.monthly)
    const annualRate = Number(sip.rate)
    const years = Number(sip.years)

    if (!P || !years) {
      alert('Please enter valid SIP details.')
      return
    }

    const r = annualRate / 12 / 100
    const n = years * 12
    const invested = P * n

    const total =
      r === 0
        ? invested
        : P *
          (((1 + r) ** n - 1) / r) *
          (1 + r)

    setSipResult({
      invested,
      returns: total - invested,
      total,
    })
  }

  function calculateEMI() {
    const P = Number(emi.amount)
    const annualRate = Number(emi.rate)
    const years = Number(emi.years)

    if (!P || !years) {
      alert('Please enter valid EMI details.')
      return
    }

    const r = annualRate / 12 / 100
    const n = years * 12

    const monthly =
      r === 0
        ? P / n
        : (P * r * (1 + r) ** n) /
          ((1 + r) ** n - 1)

    const total = monthly * n

    setEmiResult({
      monthly,
      interest: total - P,
      total,
    })
  }

  function addGoal() {
    if (!goalForm.name || !goalForm.target) {
      alert('Please enter a goal name and target.')
      return
    }

    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: goalForm.name,
        target: Number(goalForm.target),
        saved: 0,
      },
    ])

    setGoalForm({
      name: '',
      target: '',
    })
  }

  function addContribution(id) {
    const amount = window.prompt(
      'How much did you save towards this goal?'
    )

    if (!amount || Number(amount) <= 0) return

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              saved:
                goal.saved + Number(amount),
            }
          : goal
      )
    )
  }

  function unlockVault() {
    if (vaultPin === '1234') {
      setVaultUnlocked(true)
    } else {
      alert('Incorrect PIN. Demo PIN is 1234.')
    }
  }

  function navigate(page) {
    setActivePage(page)
    setSidebarOpen(false)
  }

  function titleOf(item) {
    return (
      item.title ||
      item.description ||
      item.name ||
      'Expense'
    )
  }

  function categoryOf(item) {
    return item.category || 'General'
  }

  function dateOf(item) {
    const date =
      item.date ||
      item.created_at ||
      item.createdAt

    if (!date) return ''

    return String(date).slice(0, 10)
  }

  return (
    <div className="app-shell">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="brand">
          <div className="brand-mark">S</div>

          <div>
            <strong>SheCodes</strong>
            <span>WOMEN IN FINANCE</span>
          </div>

          <button
            className="close-menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={17} />
          </button>
        </div>

        <div className="profile">
          <div className="avatar">S</div>

          <div>
            <strong>Sakhi</strong>
            <span>My financial space</span>
          </div>
        </div>

        <nav className="navigation">
          <span className="nav-label">MENU</span>

          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  navigate(item.name)
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="encouragement">
            <ShieldCheck size={16} />

            <p>
              <strong>Your money, your space.</strong>
              <br />
              Keep learning. Keep growing.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="breadcrumb">
            <button
              className="menu-toggle"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={19} />
            </button>

            SheCodes
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">

            <button className="language-button">
              EN / HI
            </button>

            <div className="top-avatar">
              S
            </div>
          </div>
        </header>

        {/* ================= DASHBOARD ================= */}

        {activePage === 'Dashboard' && (
          <div className="page-content">

            <div className="welcome-row">

              <div>
                <span className="eyebrow">
                  OVERVIEW
                </span>

                <h1>
                  Good morning, Sakhi
                </h1>

                <p>
                  Here's a quick look at your money.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setShowModal(true)}
              >
                <Plus size={15} />
                Add transaction
              </button>

            </div>

            {/* BALANCE */}

            <div className="balance-banner">

              <div className="balance-copy">

                <span>
                  <IndianRupee size={12} />
                  AVAILABLE BALANCE
                </span>

                <h2>
                  {formatMoney(balance)}
                </h2>

                <p>
                  Manage today. Build tomorrow.
                </p>

              </div>

              <div className="balance-decoration">
                <TrendingUp size={80} />
              </div>

            </div>

            {/* SUMMARY */}

            <div className="summary-grid">

              <div className="summary-card">

                <div className="summary-heading">
                  <span>Income</span>

                  <div className="summary-icon income-icon">
                    <ArrowUpRight size={15} />
                  </div>
                </div>

                <h3>
                  {formatMoney(
                    income || budget.income
                  )}
                </h3>

                <p>
                  Monthly income
                </p>

              </div>

              <div className="summary-card">

                <div className="summary-heading">
                  <span>Expenses</span>

                  <div className="summary-icon expense-icon">
                    <ArrowDownRight size={15} />
                  </div>
                </div>

                <h3>
                  {formatMoney(expenses)}
                </h3>

                <p>
                  Tracked expenses
                </p>

              </div>

              <div className="summary-card">

                <div className="summary-heading">
                  <span>Savings plan</span>

                  <div className="summary-icon savings-icon">
                    <PiggyBank size={15} />
                  </div>
                </div>

                <h3>
                  {formatMoney(
                    budget.savings
                  )}
                </h3>

                <p>
                  Planned this month
                </p>

              </div>

            </div>

            {/* CONTENT GRID */}

            <div className="content-grid">

              {/* TRANSACTIONS */}

              <div className="panel">

                <div className="panel-heading">

                  <div>
                    <span className="eyebrow">
                      ACTIVITY
                    </span>

                    <h2>
                      Recent transactions
                    </h2>

                    <p>
                      Your latest money activity.
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      navigate('Transactions')
                    }
                  >
                    View all
                    <ChevronRight size={13} />
                  </button>

                </div>

                {loading ? (
                  <p className="helper-text">
                    Loading transactions...
                  </p>
                ) : transactions.length === 0 ? (
                  <div className="empty-state">
                    <Receipt size={24} />

                    <p>
                      No transactions yet.
                    </p>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        setShowModal(true)
                      }
                    >
                      Add your first one
                    </button>
                  </div>
                ) : (
                  <div className="transaction-list">

                    {transactions
                      .slice(0, 5)
                      .map((item, index) => {

                        const isIncome =
                          item.type === 'income' ||
                          item.transaction_type ===
                            'income'

                        return (
                          <div
                            className="transaction-row"
                            key={
                              item.id || index
                            }
                          >

                            <div className="transaction-emoji">
                              <Receipt size={14} />
                            </div>

                            <div className="transaction-info">

                              <strong>
                                {titleOf(item)}
                              </strong>

                              <span>
                                {categoryOf(item)}
                                {dateOf(item)
                                  ? ` · ${dateOf(
                                      item
                                    )}`
                                  : ''}
                              </span>

                            </div>

                            <strong
                              className={`transaction-amount ${
                                isIncome
                                  ? 'positive'
                                  : 'negative'
                              }`}
                            >
                              {isIncome
                                ? '+'
                                : '-'}
                              {formatMoney(
                                item.amount
                              )}
                            </strong>

                          </div>
                        )
                      })}

                  </div>
                )}

              </div>

              {/* GOALS */}

              <div className="panel goals-panel">

                <div className="panel-heading">

                  <div>
                    <span className="eyebrow">
                      SAVINGS
                    </span>

                    <h2>
                      Your goals
                    </h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      navigate(
                        'Savings goals'
                      )
                    }
                  >
                    Manage
                  </button>

                </div>

                <div className="goal-illustration">
                  <Target size={32} />
                </div>

                {goals.length > 0 ? (
                  <>

                    <h3>
                      {goals[0].name}
                    </h3>

                    <p className="goal-description">
                      {formatMoney(
                        goals[0].saved
                      )}{' '}
                      saved of{' '}
                      {formatMoney(
                        goals[0].target
                      )}
                    </p>

                    <div className="goal-progress">
                      <div
                        className="goal-progress-fill"
                        style={{
                          width: `${Math.min(
                            (goals[0].saved /
                              goals[0].target) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(
                          'Savings goals'
                        )
                      }
                    >
                      View goals
                    </button>

                  </>
                ) : (
                  <>
                    <h3>
                      Start your first goal
                    </h3>

                    <p className="goal-description">
                      Create a savings goal and
                      watch your progress grow.
                    </p>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(
                          'Savings goals'
                        )
                      }
                    >
                      Create goal
                    </button>
                  </>
                )}

              </div>

            </div>

            {/* LEARNING BANNER */}

            <div className="learning-banner">

              <div className="learning-icon">
                <BookOpen size={17} />
              </div>

              <div>
                <span>
                  LEARN FINANCE
                </span>

                <h3>
                  Money knowledge is money power.
                </h3>

                <p>
                  Explore short, simple lessons
                  designed for everyday finance.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate('Learn finance')
                }
              >
                Explore
              </button>

            </div>

            <footer className="app-footer">
              Built for women who want to take
              control of their money.
              <span>•</span>
              SheCodes
              <small>
                Personal finance · Learning · Growth
              </small>
            </footer>

          </div>
        )}

        {/* ================= TRANSACTIONS ================= */}

        {activePage === 'Transactions' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  ACTIVITY
                </span>

                <h2>
                  Transactions
                </h2>

                <p>
                  Keep track of where your money goes.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setShowModal(true)}
              >
                <Plus size={15} />
                Add transaction
              </button>

            </div>

            <div className="panel full-panel">

              {transactions.length === 0 ? (
                <div className="empty-state">
                  <Receipt size={28} />
                  <p>
                    No transactions yet.
                  </p>
                </div>
              ) : (
                <div className="transaction-list">

                  {transactions.map(
                    (item, index) => {

                      const isIncome =
                        item.type === 'income' ||
                        item.transaction_type ===
                          'income'

                      return (
                        <div
                          className="transaction-row"
                          key={
                            item.id || index
                          }
                        >

                          <div className="transaction-emoji">
                            <Receipt size={14} />
                          </div>

                          <div className="transaction-info">
                            <strong>
                              {titleOf(item)}
                            </strong>

                            <span>
                              {categoryOf(item)}
                              {dateOf(item)
                                ? ` · ${dateOf(
                                    item
                                  )}`
                                : ''}
                            </span>
                          </div>

                          <strong
                            className={`transaction-amount ${
                              isIncome
                                ? 'positive'
                                : 'negative'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {formatMoney(
                              item.amount
                            )}
                          </strong>

                          {item.id && (
                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteTransaction(
                                  item.id
                                )
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          )}

                        </div>
                      )
                    }
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= BUDGET ================= */}

        {activePage === 'My budget' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  BUDGET
                </span>

                <h2>
                  My monthly budget
                </h2>

                <p>
                  Give every rupee a simple job.
                </p>
              </div>

              <Wallet
                size={25}
              />

            </div>

            <div className="budget-layout">

              <div className="panel budget-card">

                <span className="eyebrow">
                  PLAN
                </span>

                <h3>
                  Monthly budget
                </h3>

                <div className="budget-form">

                  <label>
                    Monthly income

                    <input
                      type="number"
                      value={budget.income}
                      onChange={(e) =>
                        setBudget({
                          ...budget,
                          income: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </label>

                  <label>
                    Needs

                    <input
                      type="number"
                      value={budget.needs}
                      onChange={(e) =>
                        setBudget({
                          ...budget,
                          needs: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </label>

                  <label>
                    Wants

                    <input
                      type="number"
                      value={budget.wants}
                      onChange={(e) =>
                        setBudget({
                          ...budget,
                          wants: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </label>

                  <label>
                    Savings

                    <input
                      type="number"
                      value={budget.savings}
                      onChange={(e) =>
                        setBudget({
                          ...budget,
                          savings: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </label>

                </div>

              </div>

              <div className="panel">

                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      SUMMARY
                    </span>

                    <h2>
                      Where your money goes
                    </h2>
                  </div>
                </div>

                <div className="budget-stat">
                  <span>
                    Monthly income
                  </span>

                  <strong>
                    {formatMoney(
                      budget.income
                    )}
                  </strong>
                </div>

                <div className="budget-stat">
                  <span>Needs</span>

                  <strong>
                    {formatMoney(
                      budget.needs
                    )}
                  </strong>
                </div>

                <div className="budget-stat">
                  <span>Wants</span>

                  <strong>
                    {formatMoney(
                      budget.wants
                    )}
                  </strong>
                </div>

                <div className="budget-stat">
                  <span>Savings</span>

                  <strong>
                    {formatMoney(
                      budget.savings
                    )}
                  </strong>
                </div>

                <div className="budget-stat">

                  <span>
                    Remaining
                  </span>

                  <strong
                    className={
                      budget.income -
                        budget.needs -
                        budget.wants -
                        budget.savings <
                      0
                        ? 'over-budget'
                        : ''
                    }
                  >
                    {formatMoney(
                      budget.income -
                        budget.needs -
                        budget.wants -
                        budget.savings
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= GOALS ================= */}

        {activePage === 'Savings goals' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  SAVINGS
                </span>

                <h2>
                  Savings goals
                </h2>

                <p>
                  Turn small savings into meaningful
                  milestones.
                </p>
              </div>

              <Target size={25} />

            </div>

            <div className="goals-page">

              <div className="panel goal-form-panel">

                <span className="eyebrow">
                  NEW GOAL
                </span>

                <div className="goal-form">

                  <label>
                    Goal name

                    <input
                      type="text"
                      placeholder="Emergency fund"
                      value={goalForm.name}
                      onChange={(e) =>
                        setGoalForm({
                          ...goalForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Target amount

                    <input
                      type="number"
                      placeholder="50000"
                      value={goalForm.target}
                      onChange={(e) =>
                        setGoalForm({
                          ...goalForm,
                          target:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    className="primary-button"
                    onClick={addGoal}
                  >
                    <Plus size={14} />
                    Create goal
                  </button>

                </div>

              </div>

              <div className="goals-grid">

                {goals.map((goal) => {

                  const percent = Math.min(
                    (goal.saved /
                      goal.target) *
                      100,
                    100
                  )

                  return (
                    <div
                      className="panel goal-card"
                      key={goal.id}
                    >

                      <div className="goal-card-heading">

                        <div className="goal-icon">
                          <Target size={17} />
                        </div>

                        <span className="goal-percent">
                          {Math.round(
                            percent
                          )}
                          %
                        </span>

                      </div>

                      <h3>
                        {goal.name}
                      </h3>

                      <div className="goal-saved">
                        {formatMoney(
                          goal.saved
                        )}{' '}
                        saved
                      </div>

                      <div className="goal-target">
                        Target:{' '}
                        {formatMoney(
                          goal.target
                        )}
                      </div>

                      <div className="goal-progress">

                        <div
                          className="goal-progress-fill"
                          style={{
                            width: `${percent}%`,
                          }}
                        />

                      </div>

                      {percent >= 100 ? (
                        <span className="goal-complete">
                          Goal reached
                        </span>
                      ) : (
                        <div className="contribution-form">

                          <button
                            className="secondary-button"
                            onClick={() =>
                              addContribution(
                                goal.id
                              )
                            }
                          >
                            Add savings
                          </button>

                        </div>
                      )}

                    </div>
                  )
                })}

              </div>

            </div>

          </div>
        )}

        {/* ================= SIP EMI ================= */}

        {activePage === 'SIP & EMI' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  CALCULATORS
                </span>

                <h2>
                  SIP & EMI
                </h2>

                <p>
                  Plan investments and understand
                  loan payments.
                </p>
              </div>

              <Calculator size={25} />

            </div>

            <div className="calculator-tabs">

              <button
                className={
                  calculator === 'sip'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setCalculator('sip')
                }
              >
                SIP calculator
              </button>

              <button
                className={
                  calculator === 'emi'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setCalculator('emi')
                }
              >
                EMI calculator
              </button>

            </div>

            {calculator === 'sip' && (
              <div className="calculator-layout">

                <div className="calculator-card">

                  <h3>
                    Build your investment plan
                  </h3>

                  <p>
                    See how regular investing could
                    grow over time.
                  </p>

                  <label>
                    Monthly investment

                    <input
                      type="number"
                      value={sip.monthly}
                      onChange={(e) =>
                        setSip({
                          ...sip,
                          monthly:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Expected annual return

                    <input
                      type="number"
                      value={sip.rate}
                      onChange={(e) =>
                        setSip({
                          ...sip,
                          rate: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Investment period

                    <input
                      type="number"
                      value={sip.years}
                      onChange={(e) =>
                        setSip({
                          ...sip,
                          years: e.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    className="primary-button"
                    onClick={calculateSIP}
                  >
                    Calculate SIP
                  </button>

                </div>

                <div className="calculator-result">

                  <div className="calculator-result-icon">
                    <TrendingUp size={19} />
                  </div>

                  <h3>
                    Estimated value
                  </h3>

                  {sipResult ? (
                    <>
                      <div className="big-result">
                        {formatMoney(
                          sipResult.total
                        )}
                      </div>

                      <div className="result-stat">
                        <span>
                          Amount invested
                        </span>

                        <strong>
                          {formatMoney(
                            sipResult.invested
                          )}
                        </strong>
                      </div>

                      <div className="result-stat">
                        <span>
                          Estimated returns
                        </span>

                        <strong>
                          {formatMoney(
                            sipResult.returns
                          )}
                        </strong>
                      </div>
                    </>
                  ) : (
                    <p className="helper-text">
                      Enter your SIP details and
                      calculate your estimated value.
                    </p>
                  )}

                </div>

              </div>
            )}

            {calculator === 'emi' && (
              <div className="calculator-layout">

                <div className="calculator-card">

                  <h3>
                    Understand your EMI
                  </h3>

                  <p>
                    See the monthly cost and total
                    interest of a loan.
                  </p>

                  <label>
                    Loan amount

                    <input
                      type="number"
                      value={emi.amount}
                      onChange={(e) =>
                        setEmi({
                          ...emi,
                          amount:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Annual interest rate

                    <input
                      type="number"
                      value={emi.rate}
                      onChange={(e) =>
                        setEmi({
                          ...emi,
                          rate:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Loan period

                    <input
                      type="number"
                      value={emi.years}
                      onChange={(e) =>
                        setEmi({
                          ...emi,
                          years:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    className="primary-button"
                    onClick={calculateEMI}
                  >
                    Calculate EMI
                  </button>

                </div>

                <div className="calculator-result">

                  <div className="calculator-result-icon">
                    <IndianRupee size={19} />
                  </div>

                  <h3>
                    Monthly EMI
                  </h3>

                  {emiResult ? (
                    <>
                      <div className="big-result">
                        {formatMoney(
                          emiResult.monthly
                        )}
                        <small>/month</small>
                      </div>

                      <div className="result-stat">
                        <span>
                          Total interest
                        </span>

                        <strong>
                          {formatMoney(
                            emiResult.interest
                          )}
                        </strong>
                      </div>

                      <div className="result-stat">
                        <span>
                          Total payment
                        </span>

                        <strong>
                          {formatMoney(
                            emiResult.total
                          )}
                        </strong>
                      </div>
                    </>
                  ) : (
                    <p className="helper-text">
                      Enter your loan details and
                      calculate your monthly EMI.
                    </p>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= LEARNING ================= */}

        {activePage === 'Learn finance' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  LEARNING
                </span>

                <h2>
                  Learn finance
                </h2>

                <p>
                  Simple lessons for everyday money
                  decisions.
                </p>
              </div>

              <BookOpen size={25} />

            </div>

            <div className="learning-grid">

              {lessons.map((lesson) => (
                <div
                  className="lesson-card"
                  key={lesson.number}
                >

                  <div className="lesson-icon">
                    {lesson.number}
                  </div>

                  <h3>
                    {lesson.title}
                  </h3>

                  <p>
                    {lesson.text}
                  </p>

                  <button className="text-button">
                    Read lesson
                    <ChevronRight size={12} />
                  </button>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* ================= VAULT ================= */}

        {activePage === 'Private vault' && (
          <div className="page-content">

            <div className="feature-header">

              <div>
                <span className="eyebrow">
                  PRIVATE
                </span>

                <h2>
                  Private vault
                </h2>

                <p>
                  A private space for your financial
                  notes and reminders.
                </p>
              </div>

              <Lock size={25} />

            </div>

            {!vaultUnlocked ? (
              <div
                className="panel"
                style={{
                  maxWidth: '440px',
                }}
              >

                <div className="goal-icon">
                  <Lock size={17} />
                </div>

                <h3>
                  Unlock your vault
                </h3>

                <p className="helper-text">
                  Enter your 4-digit PIN to access
                  your private space.
                </p>

                <label>
                  PIN

                  <input
                    type="password"
                    maxLength={4}
                    value={vaultPin}
                    onChange={(e) =>
                      setVaultPin(
                        e.target.value
                      )
                    }
                  />
                </label>

                <br />

                <button
                  className="primary-button"
                  onClick={unlockVault}
                >
                  Unlock
                </button>

                <p className="helper-text">
                  Demo PIN: 1234
                </p>

              </div>
            ) : (
              <div
                className="panel"
                style={{
                  maxWidth: '650px',
                }}
              >

                <div className="panel-heading">

                  <div>
                    <span className="eyebrow">
                      UNLOCKED
                    </span>

                    <h2>
                      Your private space
                    </h2>

                    <p>
                      This is a demo vault for the
                      hackathon.
                    </p>
                  </div>

                  <ShieldCheck
                    size={23}
                  />

                </div>

                <div className="budget-stat">
                  <span>
                    Financial reminder
                  </span>

                  <strong>
                    Review your savings goals
                  </strong>
                </div>

                <div className="budget-stat">
                  <span>
                    Monthly check-in
                  </span>

                  <strong>
                    Track your expenses
                  </strong>
                </div>

                <br />

                <button
                  className="secondary-button"
                  onClick={() => {
                    setVaultUnlocked(false)
                    setVaultPin('')
                  }}
                >
                  Lock vault
                </button>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
        >

          <div
            className="transaction-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-heading">

              <div>
                <span className="eyebrow">
                  MONEY ACTIVITY
                </span>

                <h2>
                  Add transaction
                </h2>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={16} />
              </button>

            </div>

            <div className="type-switch">

              <button
                className={
                  transactionForm.type ===
                  'expense'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setTransactionForm({
                    ...transactionForm,
                    type: 'expense',
                  })
                }
              >
                Expense
              </button>

              <button
                className={
                  transactionForm.type ===
                  'income'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setTransactionForm({
                    ...transactionForm,
                    type: 'income',
                  })
                }
              >
                Income
              </button>

            </div>

            <form
              onSubmit={
                handleTransactionSubmit
              }
            >

              <label>
                Description

                <input
                  type="text"
                  placeholder="e.g. Groceries"
                  value={
                    transactionForm.title
                  }
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      title:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Amount

                <input
                  type="number"
                  placeholder="₹0"
                  value={
                    transactionForm.amount
                  }
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      amount:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Category

                <select
                  value={
                    transactionForm.category
                  }
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      category:
                        e.target.value,
                    })
                  }
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </label>

              <button
                className="primary-button submit-button"
                type="submit"
              >
                Save transaction
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default App