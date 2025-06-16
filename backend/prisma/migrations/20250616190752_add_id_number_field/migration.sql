-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalLoanData" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "memberId" TEXT,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "fundedAmount" DOUBLE PRECISION,
    "fundedAmountInv" DOUBLE PRECISION,
    "term" TEXT,
    "intRate" DOUBLE PRECISION,
    "installment" DOUBLE PRECISION,
    "grade" TEXT,
    "subGrade" TEXT,
    "empTitle" TEXT,
    "empLength" TEXT,
    "homeOwnership" TEXT,
    "annualInc" DOUBLE PRECISION,
    "verificationStatus" TEXT,
    "issueDate" TEXT,
    "loanStatus" TEXT,
    "purpose" TEXT,
    "title" TEXT,
    "zipCode" TEXT,
    "addrState" TEXT,
    "dti" DOUBLE PRECISION,
    "delinq2Yrs" INTEGER,
    "earliestCrLine" TEXT,
    "inqLast6Mths" INTEGER,
    "openAcc" INTEGER,
    "pubRec" INTEGER,
    "revolBal" DOUBLE PRECISION,
    "revolUtil" DOUBLE PRECISION,
    "totalAcc" INTEGER,
    "initialListStatus" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalLoanData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalLoanData_originalId_key" ON "HistoricalLoanData"("originalId");
