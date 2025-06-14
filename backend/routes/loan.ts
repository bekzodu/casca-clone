import express from 'express'
import prisma from '../prisma/client'

const router = express.Router()

// POST /loan-applications
router.post('/', async (req, res) => {
    try {
      const { name, businessType, amount, reason } = req.body
  
      const newLoan = await prisma.loanApplication.create({
        data: {
          name,
          businessType,
          amount,
          reason
        },
      })
  
      res.status(201).json(newLoan)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create loan application' })
    }
  })

// GET /loan-applications
router.get('/', async (_req, res) => {
    const loans = await prisma.loanApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(loans)
  })
  
  export default router