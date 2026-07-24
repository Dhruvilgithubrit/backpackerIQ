import { useMemo } from 'react'
import './BudgetTracker.css'

const RATES = {
  '₹5,000 (Shoestring)':  { accommodation: 400, food: 300, activities: 200, transport: 100 },
  '₹10,000 (Backpacker)': { accommodation: 800, food: 500, activities: 400, transport: 200 },
  '₹20,000 (Standard)':   { accommodation: 1500, food: 800, activities: 700, transport: 400 },
  '₹30,000+ (Comfort)':   { accommodation: 2500, food: 1200, activities: 1200, transport: 600 },
}

export default function BudgetTracker({ budget, days }) {
  const breakdown = useMemo(() => {
    const rates = RATES[budget]
    if (!rates || !days) return null

    const accom      = rates.accommodation * days
    const food       = rates.food * days
    const activities = rates.activities * days
    const transport  = rates.transport * days
    const subtotal   = accom + food + activities + transport
    const contingency = Math.round(subtotal * 0.1)
    const total      = subtotal + contingency

    const budgetMax = parseInt(budget.replace(/[₹K+\s,()]/g,'').replace('Shoestring','').replace('Backpacker','').replace('Standard','').replace('Comfort','')) * 1000 || 30000

    return { accom, food, activities, transport, contingency, total, budgetMax }
  }, [budget, days])

  if (!breakdown) return null

  const { accom, food, activities, transport, contingency, total, budgetMax } = breakdown
  const overBudget = total > budgetMax
  const overAmount = total - budgetMax

  const fmt = n => `₹${n.toLocaleString('en-IN')}`
  const items = [
    { label: 'Accommodation', icon: '🏠', value: accom },
    { label: 'Food & Drinks', icon: '🍛', value: food },
    { label: 'Activities',    icon: '🎭', value: activities },
    { label: 'Transport',     icon: '🚌', value: transport },
    { label: 'Contingency (10%)', icon: '🛟', value: contingency },
  ]

  return (
    <div className="bt-root fade-in">
      <div className="bt-header">
        <span className="bt-icon">💰</span>
        <h3 className="bt-title">Estimated Budget</h3>
        <span className="bt-days">{days} days</span>
      </div>

      <div className="bt-items">
        {items.map(item => (
          <div key={item.label} className="bt-item">
            <span className="bt-item-icon">{item.icon}</span>
            <span className="bt-item-label">{item.label}</span>
            <span className="bt-item-val">{fmt(item.value)}</span>
          </div>
        ))}
      </div>

      <div className="bt-total">
        <span className="bt-total-label">TOTAL ESTIMATE</span>
        <span className="bt-total-val">{fmt(total)}</span>
      </div>

      <div className={`bt-status ${overBudget ? 'bt-status--over' : 'bt-status--ok'}`}>
        {overBudget
          ? `⚠️ Exceeds selected budget by ${fmt(overAmount)}`
          : `✓ Within your selected budget`}
      </div>
    </div>
  )
}
