import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar/Topbar'
import PlanTripForm from '../components/PlanTripForm/PlanTripForm'
import BudgetTracker from '../components/BudgetTracker/BudgetTracker'
import './PlanTripPage.css'

export default function PlanTripPage() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState(7)

  return (
    <div className="plan-page">
      <Topbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="plan-hero">
        <div className="plan-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
            alt="Planning an adventure trip"
          />
          <div className="plan-hero-overlay" />
        </div>
        <div className="plan-hero-content">
          <p className="plan-hero-eyebrow">AI-Powered Itinerary Planner</p>
          <h1 className="plan-hero-title">Plan Your Adventure</h1>
          <p className="plan-hero-sub">
            Tell us where you want to go — we'll handle the rest.
          </p>
        </div>
      </section>

      {/* ── Form Card ─────────────────────────────────────────── */}
      <section className="plan-form-section">
        <div className="plan-form-card">
          <div className="plan-form-card-header">
            <h2 className="plan-form-card-title">Build Your Itinerary</h2>
            <p className="plan-form-card-sub">Fill in the details and let AI craft your perfect trip</p>
          </div>
          <PlanTripForm
            onBudgetChange={setBudget}
            onDaysChange={setDays}
          />

          {/* Budget Tracker */}
          <div className="plan-budget-tracker-wrap">
            <BudgetTracker budget={budget} days={days} />
          </div>
        </div>
      </section>
    </div>
  )
}
