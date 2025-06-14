'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

type Loan = {
  id: string
  name: string
  businessType: string
  amount: number
  reason: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch('http://localhost:4000/loan-applications')
        const data = await res.json()
        setLoans(data)
      } catch (err) {
        console.error('Failed to fetch loans', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  const getStatusClassName = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending'
    switch (statusLower) {
      case 'approved': return `${styles.status} ${styles.statusApproved}`
      case 'rejected': return `${styles.status} ${styles.statusRejected}`
      case 'pending': return `${styles.status} ${styles.statusPending}`
      default: return `${styles.status} ${styles.statusPending}`
    }
  }

  const totalApplications = loans.length
  const pendingApplications = loans.filter(loan => (loan.status?.toLowerCase() || 'pending') === 'pending').length
  const approvedApplications = loans.filter(loan => (loan.status?.toLowerCase() || 'pending') === 'approved').length
  const totalAmount = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0)

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading loan applications...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loan Applications</h1>
          <a href="/apply" className={styles.applyButton}>
            + New Application
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalApplications}</div>
            <div className={styles.statLabel}>Total Applications</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{pendingApplications}</div>
            <div className={styles.statLabel}>Pending Review</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{approvedApplications}</div>
            <div className={styles.statLabel}>Approved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>${totalAmount.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Requested</div>
          </div>
        </div>

        {loans.length === 0 ? (
          <div className={styles.noApplications}>
            <p className={styles.noApplicationsText}>No applications yet.</p>
            <a href="/apply" className={styles.applyButton}>
              Submit Your First Application
            </a>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Name</th>
                  <th className={styles.tableHeaderCell}>Business</th>
                  <th className={styles.tableHeaderCell}>Amount</th>
                  <th className={styles.tableHeaderCell}>Reason</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{loan.name}</td>
                    <td className={styles.tableCell}>{loan.businessType}</td>
                    <td className={`${styles.tableCell} ${styles.amount}`}>
                      ${loan.amount.toLocaleString()}
                    </td>
                    <td className={`${styles.tableCell} ${styles.reason}`} title={loan.reason}>
                      {loan.reason}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={getStatusClassName(loan.status)}>
                        {loan.status}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} ${styles.date}`}>
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}