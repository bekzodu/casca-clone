'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function LoanFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    businessType: '',
    customBusinessType: '',
    amount: '',
    reason: '',
  })

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const businessTypes = [
    'Restaurant',
    'Technology Startup',
    'Retail Store',
    'E-commerce',
    'Manufacturing',
    'Construction',
    'Consulting Services',
    'Healthcare Services',
    'Real Estate',
    'Transportation',
    'Agriculture',
    'Beauty & Personal Care',
    'Education & Training',
    'Financial Services',
    'Legal Services',
    'Marketing & Advertising',
    'Entertainment',
    'Fitness & Wellness',
    'Auto Services',
    'Professional Services',
    'Food & Beverage',
    'Home Services',
    'Other'
  ]

  const formatNumber = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '')
    
    // Return empty string if no digits
    if (!numericValue) return ''
    
    // Check if the numeric value exceeds 1 million
    const numericAmount = parseInt(numericValue, 10)
    if (numericAmount > 1000000) {
      return '1,000,000' // Cap at 1 million
    }
    
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'amount') {
      // Store the formatted value for display
      setFormData(prev => ({ ...prev, [name]: formatNumber(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Remove commas from amount before parsing
      const numericAmount = formData.amount.replace(/,/g, '')
      const businessType = formData.businessType === 'Other' ? formData.customBusinessType : formData.businessType
      
      console.log('Submitting data:', {
        name: formData.name,
        idNumber: formData.idNumber,
        businessType,
        amount: parseFloat(numericAmount),
        reason: formData.reason,
      })
      
      const res = await fetch('http://localhost:4000/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          idNumber: formData.idNumber,
          businessType,
          amount: parseFloat(numericAmount),
          reason: formData.reason,
        }),
      })

      console.log('Response status:', res.status)
      console.log('Response headers:', res.headers)
      
      // Log the actual response text to see what we're getting
      const responseText = await res.text()
      console.log('Raw response:', responseText)

      if (!res.ok) {
        throw new Error(`Failed to submit: ${res.status} ${responseText}`)
      }

      // Try to parse as JSON
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        throw new Error('Server returned invalid JSON')
      }

      setStatus('success')
      setFormData({ name: '', idNumber: '', businessType: '', customBusinessType: '', amount: '', reason: '' })
    } catch (error) {
      console.error('Submission error:', error)
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
            <label className={styles.label}>ID Number</label>
            <input
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID number (SSN, Driver's License, etc.)"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select your business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            
            {formData.businessType === 'Other' && (
              <input
                name="customBusinessType"
                value={formData.customBusinessType}
                onChange={handleChange}
                placeholder="Please specify your business type"
                required
                className={styles.input}
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Loan Amount ($)</label>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="50,000"
              type="text"
              required
              className={styles.input}
              inputMode="numeric"
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Maximum loan amount: $1,000,000
            </small>
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