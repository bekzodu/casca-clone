'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function LoanFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    amount: '',
    reason: '',
  })

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:4000/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setStatus('success')
      setFormData({ name: '', businessType: '', amount: '', reason: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Apply for a Loan</h1>
          <p className={styles.subtitle}>Get the funding your business needs</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Business Type</label>
            <input
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="e.g., Restaurant, Tech Startup, Retail"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Loan Amount ($)</label>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="50000"
              type="number"
              min="1000"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Purpose of Loan</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe why you need this loan (equipment, expansion, working capital, etc.)"
              required
              rows={4}
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Application
          </button>
        </form>

        {status === 'success' && (
          <div className={styles.successMessage}>
            <p className={styles.successText}>
              ✅ Loan application submitted successfully!
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>
              ❌ Something went wrong. Please try again.
            </p>
          </div>
        )}

        <div className={styles.dashboardLink}>
          <a href="/dashboard">View All Applications →</a>
        </div>
      </div>
    </div>
  )
}