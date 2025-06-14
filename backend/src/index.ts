import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import loanRouters from '../routes/loan'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
    res.send('Backend is running 🚀')
})

// Add loan routes
app.use('/loan-applications', loanRouters)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
