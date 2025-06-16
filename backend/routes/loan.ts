import express from 'express'
import prisma from '../prisma/client'

const router = express.Router()

// POST /loan-applications
router.post('/', async (req, res) => {
    try {
      const { name, idNumber, businessType, amount, reason } = req.body
  
      const newLoan = await prisma.loanApplication.create({
        data: {
          name,
          idNumber,
          businessType,
          amount,
          reason
          // status will default to PENDING in the database
        },
      })
  
      res.status(201).json(newLoan)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create loan application' })
    }
  })

// GET /loan-applications
router.get('/', async (req, res) => {
    const loans = await prisma.loanApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(loans)
  })

// GET /loan-applications/history - Get historical loan data
router.get('/history', async (req, res) => {
  try {
    const { page = '1', limit = '20' } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [historicalLoans, totalCount] = await Promise.all([
      prisma.historicalLoanData.findMany({
        orderBy: { importedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.historicalLoanData.count()
    ])

    res.json({
      data: historicalLoans,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch historical loan data' })
  }
})

// PATCH /loan-applications/:id - Update loan status
router.patch('/:id', (req, res) => {
  (async () => {
    try {
      const { id } = req.params
      const { status } = req.body

      const validStatuses = ['PENDING', 'REVIEWING', 'APPROVED', 'DENIED']
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        })
      }

      const updatedLoan = await prisma.loanApplication.update({
        where: { id },
        data: { status },
      })

      res.json(updatedLoan)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to update loan application' })
    }
  })()
})
  
export default router