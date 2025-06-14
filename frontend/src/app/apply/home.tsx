'use client'

import { useState } from 'react'

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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Apply for a Loan</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input name="businessType" value={formData.businessType} onChange={handleChange} placeholder="Business Type" required />
        <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" type="number" required />
        <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Why do you need the loan?" required />
        <button type="submit">Submit Application</button>
      </form>

      {status === 'success' && <p style={{ color: 'green' }}>Loan application submitted!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Something went wrong.</p>}
    </div>
  )
}
