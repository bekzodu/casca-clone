'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

type Loan = {
  id: string
  name: string
  idNumber: string
  businessType: string
  amount: number
  reason: string
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED'
  createdAt: string
}

type HistoricalLoan = {
  id: string
  originalId: string
  memberId: string | null
  loanAmount: number
  fundedAmount: number | null
  fundedAmountInv: number | null
  term: string | null
  intRate: number | null
  installment: number | null
  grade: string | null
  subGrade: string | null
  empTitle: string | null
  empLength: string | null
  homeOwnership: string | null
  annualInc: number | null
  verificationStatus: string | null
  issueDate: string | null
  loanStatus: string | null
  purpose: string | null
  title: string | null
  zipCode: string | null
  addrState: string | null
  dti: number | null
  delinq2Yrs: number | null
  earliestCrLine: string | null
  inqLast6Mths: number | null
  openAcc: number | null
  pubRec: number | null
  revolBal: number | null
  revolUtil: number | null
  totalAcc: number | null
  initialListStatus: string | null
  importedAt: string
}

type HistoricalDataResponse = {
  data: HistoricalLoan[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  
  // Historical data state
  const [historicalData, setHistoricalData] = useState<HistoricalLoan[]>([])
  const [selectedHistoricalLoan, setSelectedHistoricalLoan] = useState<HistoricalLoan | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isHistoricalDetailModalOpen, setIsHistoricalDetailModalOpen] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

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

  const fetchHistoricalData = async (page = 1) => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/loan-applications/history?page=${page}&limit=20`)
      const data: HistoricalDataResponse = await res.json()
      setHistoricalData(data.data)
      setHistoryPagination(data.pagination)
    } catch (err) {
      console.error('Failed to fetch historical data', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true)
    if (historicalData.length === 0) {
      fetchHistoricalData()
    }
  }

  const handleHistoryPageChange = (newPage: number) => {
    fetchHistoricalData(newPage)
  }

  const handleHistoricalLoanClick = (loan: HistoricalLoan) => {
    setSelectedHistoricalLoan(loan)
    setIsHistoricalDetailModalOpen(true)
  }

  const getStatusClassName = (status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED') => {
    switch (status) {
      case 'APPROVED': return `${styles.status} ${styles.statusApproved}`
      case 'DENIED': return `${styles.status} ${styles.statusDenied}`
      case 'REVIEWING': return `${styles.status} ${styles.statusReviewing}`
      case 'PENDING': 
      default: return `${styles.status} ${styles.statusPending}`
    }
  }

  const getStatusDisplayText = (status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED') => {
    switch (status) {
      case 'PENDING': return 'Pending'
      case 'REVIEWING': return 'Under Review'
      case 'APPROVED': return 'Approved'
      case 'DENIED': return 'Denied'
      default: return 'Pending'
    }
  }

  const handleNameClick = (loan: Loan) => {
    setSelectedLoan(loan)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLoan(null)
  }

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false)
  }

  const handleCloseHistoricalDetailModal = () => {
    setIsHistoricalDetailModalOpen(false)
    setSelectedHistoricalLoan(null)
  }

  const handleStatusUpdate = async (newStatus: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED') => {
    if (!selectedLoan) return

    setUpdating(true)
    try {
      const res = await fetch(`http://localhost:4000/loan-applications/${selectedLoan.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setLoans(prevLoans => 
          prevLoans.map(loan => 
            loan.id === selectedLoan.id 
              ? { ...loan, status: newStatus }
              : loan
          )
        )
        
        setSelectedLoan(prev => prev ? { ...prev, status: newStatus } : null)
      } else {
        console.error('Failed to update loan status')
        alert('Failed to update loan status. Please try again.')
      }
    } catch (err) {
      console.error('Error updating loan status:', err)
      alert('Error updating loan status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const totalApplications = loans.length
  const pendingApplications = loans.filter(loan => loan.status === 'PENDING').length
  const reviewingApplications = loans.filter(loan => loan.status === 'REVIEWING').length
  const approvedApplications = loans.filter(loan => loan.status === 'APPROVED').length
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
          <div className={styles.headerButtons}>
            <button 
              className={styles.historyButton}
              onClick={handleHistoryClick}
            >
              📊 View History
            </button>
            <a href="/apply" className={styles.applyButton}>
              + New Application
            </a>
          </div>
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
            <div className={styles.statNumber}>{reviewingApplications}</div>
            <div className={styles.statLabel}>Under Review</div>
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
                  <th className={styles.tableHeaderCell}>ID Number</th>
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
                    <td className={styles.tableCell}>
                      <button 
                        className={styles.nameButton}
                        onClick={() => handleNameClick(loan)}
                      >
                        {loan.name}
                      </button>
                    </td>
                    <td className={styles.tableCell}>{loan.idNumber}</td>
                    <td className={styles.tableCell}>{loan.businessType}</td>
                    <td className={`${styles.tableCell} ${styles.amount}`}>
                      ${loan.amount.toLocaleString()}
                    </td>
                    <td className={`${styles.tableCell} ${styles.reason}`} title={loan.reason}>
                      {loan.reason}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={getStatusClassName(loan.status)}>
                        {getStatusDisplayText(loan.status)}
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

        {/* Loan Details Modal */}
        {isModalOpen && selectedLoan && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Loan Application Details</h2>
                <button 
                  className={styles.closeButton}
                  onClick={handleCloseModal}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Applicant Name</label>
                    <div className={styles.detailValue}>{selectedLoan.name}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>ID Number</label>
                    <div className={styles.detailValue}>{selectedLoan.idNumber}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Business Type</label>
                    <div className={styles.detailValue}>{selectedLoan.businessType}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Loan Amount</label>
                    <div className={`${styles.detailValue} ${styles.amountValue}`}>
                      ${selectedLoan.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Application ID</label>
                    <div className={styles.detailValue}>{selectedLoan.id}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Submitted Date</label>
                    <div className={styles.detailValue}>
                      {new Date(selectedLoan.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className={`${styles.detailItem} ${styles.reasonItem}`}>
                    <label className={styles.detailLabel}>Reason for Loan</label>
                    <div className={styles.detailValue}>{selectedLoan.reason}</div>
                  </div>
                </div>
                
                <div className={styles.statusSection}>
                  <label className={styles.detailLabel}>Current Status</label>
                  <div className={styles.currentStatus}>
                    <span className={getStatusClassName(selectedLoan.status)}>
                      {getStatusDisplayText(selectedLoan.status)}
                    </span>
                  </div>
                  
                  <label className={styles.detailLabel}>Update Status</label>
                  <div className={styles.statusButtons}>
                    {['PENDING', 'REVIEWING', 'APPROVED', 'DENIED'].map((status) => (
                      <button
                        key={status}
                        className={`${styles.statusButton} ${
                          selectedLoan.status === status ? styles.statusButtonActive : ''
                        }`}
                        onClick={() => handleStatusUpdate(status as 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED')}
                        disabled={updating || selectedLoan.status === status}
                      >
                        {updating && selectedLoan.status !== status ? (
                          '...'
                        ) : (
                          getStatusDisplayText(status as 'PENDING' | 'REVIEWING' | 'APPROVED' | 'DENIED')
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historical Data Modal */}
        {isHistoryModalOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseHistoryModal}>
            <div className={styles.historyModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Historical Loan Data</h2>
                <button 
                  className={styles.closeButton}
                  onClick={handleCloseHistoryModal}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.historyModalContent}>
                {historyLoading ? (
                  <div className={styles.loading}>Loading historical data...</div>
                ) : (
                  <>
                    <div className={styles.historyStats}>
                      <div className={styles.historyStatItem}>
                        <span className={styles.historyStatLabel}>Total Records:</span>
                        <span className={styles.historyStatValue}>{historyPagination.total.toLocaleString()}</span>
                      </div>
                      <div className={styles.historyStatItem}>
                        <span className={styles.historyStatLabel}>Showing Page:</span>
                        <span className={styles.historyStatValue}>{historyPagination.page} of {historyPagination.totalPages}</span>
                      </div>
                    </div>

                    <div className={styles.historyTableContainer}>
                      <table className={styles.historyTable}>
                        <thead className={styles.tableHeader}>
                          <tr>
                            <th className={styles.tableHeaderCell}>Original ID</th>
                            <th className={styles.tableHeaderCell}>Member ID</th>
                            <th className={styles.tableHeaderCell}>Amount</th>
                            <th className={styles.tableHeaderCell}>Grade</th>
                            <th className={styles.tableHeaderCell}>Purpose</th>
                            <th className={styles.tableHeaderCell}>Status</th>
                            <th className={styles.tableHeaderCell}>Interest Rate</th>
                            <th className={styles.tableHeaderCell}>Annual Income</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicalData.map((loan) => (
                            <tr key={loan.id} className={styles.tableRow}>
                              <td className={styles.tableCell}>
                                <button 
                                  className={styles.nameButton}
                                  onClick={() => handleHistoricalLoanClick(loan)}
                                >
                                  {loan.originalId}
                                </button>
                              </td>
                              <td className={styles.tableCell}>{loan.memberId || 'N/A'}</td>
                              <td className={`${styles.tableCell} ${styles.amount}`}>
                                ${loan.loanAmount.toLocaleString()}
                              </td>
                              <td className={styles.tableCell}>{loan.grade || 'N/A'}</td>
                              <td className={styles.tableCell}>{loan.purpose || 'N/A'}</td>
                              <td className={styles.tableCell}>{loan.loanStatus || 'N/A'}</td>
                              <td className={styles.tableCell}>
                                {loan.intRate ? `${loan.intRate.toFixed(2)}%` : 'N/A'}
                              </td>
                              <td className={styles.tableCell}>
                                {loan.annualInc ? `$${loan.annualInc.toLocaleString()}` : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {historyPagination.totalPages > 1 && (
                      <div className={styles.pagination}>
                        <button 
                          className={styles.paginationButton}
                          onClick={() => handleHistoryPageChange(historyPagination.page - 1)}
                          disabled={historyPagination.page === 1}
                        >
                          Previous
                        </button>
                        <span className={styles.paginationInfo}>
                          Page {historyPagination.page} of {historyPagination.totalPages}
                        </span>
                        <button 
                          className={styles.paginationButton}
                          onClick={() => handleHistoryPageChange(historyPagination.page + 1)}
                          disabled={historyPagination.page === historyPagination.totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Historical Loan Detail Modal */}
        {isHistoricalDetailModalOpen && selectedHistoricalLoan && (
          <div className={styles.modalOverlay} onClick={handleCloseHistoricalDetailModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Historical Loan Details</h2>
                <button 
                  className={styles.closeButton}
                  onClick={handleCloseHistoricalDetailModal}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Original Loan ID</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.originalId}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Member ID</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.memberId || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Loan Amount</label>
                    <div className={`${styles.detailValue} ${styles.amountValue}`}>
                      ${selectedHistoricalLoan.loanAmount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Funded Amount</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.fundedAmount ? `$${selectedHistoricalLoan.fundedAmount.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Term</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.term || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Interest Rate</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.intRate ? `${selectedHistoricalLoan.intRate.toFixed(2)}%` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Installment</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.installment ? `$${selectedHistoricalLoan.installment.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Grade</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.grade || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Sub Grade</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.subGrade || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Employment Title</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.empTitle || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Employment Length</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.empLength || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Home Ownership</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.homeOwnership || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Annual Income</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.annualInc ? `$${selectedHistoricalLoan.annualInc.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Verification Status</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.verificationStatus || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Issue Date</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.issueDate || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Loan Status</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.loanStatus || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Purpose</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.purpose || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>ZIP Code</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.zipCode || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>State</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.addrState || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>DTI Ratio</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.dti ? `${selectedHistoricalLoan.dti.toFixed(2)}%` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Delinquencies (2 years)</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.delinq2Yrs ?? 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Earliest Credit Line</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.earliestCrLine || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Inquiries (6 months)</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.inqLast6Mths ?? 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Open Accounts</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.openAcc ?? 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Public Records</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.pubRec ?? 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Revolving Balance</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.revolBal ? `$${selectedHistoricalLoan.revolBal.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Revolving Utilization</label>
                    <div className={styles.detailValue}>
                      {selectedHistoricalLoan.revolUtil ? `${selectedHistoricalLoan.revolUtil.toFixed(2)}%` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Total Accounts</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.totalAcc ?? 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Initial List Status</label>
                    <div className={styles.detailValue}>{selectedHistoricalLoan.initialListStatus || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <label className={styles.detailLabel}>Imported Date</label>
                    <div className={styles.detailValue}>
                      {new Date(selectedHistoricalLoan.importedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}