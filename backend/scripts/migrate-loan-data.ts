import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateLoanData() {
  try {
    console.log('🚀 Starting loan data migration...');
    
    const projectRoot = path.resolve(__dirname, '..');
    const filePath = path.join(projectRoot, 'data', 'loan_sample_1000.json');
    
    console.log('📖 Reading JSON file...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📊 Found ${data.length} records to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      
      try {
        await prisma.historicalLoanData.create({
          data: {
            originalId: record.id?.toString() || `loan_${i}`,
            memberId: record.member_id?.toString(),
            loanAmount: parseFloat(record.loan_amnt) || 0,
            fundedAmount: record.funded_amnt ? parseFloat(record.funded_amnt) : null,
            fundedAmountInv: record.funded_amnt_inv ? parseFloat(record.funded_amnt_inv) : null,
            term: record.term?.toString(),
            intRate: record.int_rate ? parseFloat(record.int_rate) : null,
            installment: record.installment ? parseFloat(record.installment) : null,
            grade: record.grade?.toString(),
            subGrade: record.sub_grade?.toString(),
            empTitle: record.emp_title?.toString(),
            empLength: record.emp_length?.toString(),
            homeOwnership: record.home_ownership?.toString(),
            annualInc: record.annual_inc ? parseFloat(record.annual_inc) : null,
            verificationStatus: record.verification_status?.toString(),
            issueDate: record.issue_d?.toString(),
            loanStatus: record.loan_status?.toString(),
            purpose: record.purpose?.toString(),
            title: record.title?.toString(),
            zipCode: record.zip_code?.toString(),
            addrState: record.addr_state?.toString(),
            dti: record.dti ? parseFloat(record.dti) : null,
            delinq2Yrs: record.delinq_2yrs ? parseInt(record.delinq_2yrs) : null,
            earliestCrLine: record.earliest_cr_line?.toString(),
            inqLast6Mths: record.inq_last_6mths ? parseInt(record.inq_last_6mths) : null,
            openAcc: record.open_acc ? parseInt(record.open_acc) : null,
            pubRec: record.pub_rec ? parseInt(record.pub_rec) : null,
            revolBal: record.revol_bal ? parseFloat(record.revol_bal) : null,
            revolUtil: record.revol_util ? parseFloat(record.revol_util) : null,
            totalAcc: record.total_acc ? parseInt(record.total_acc) : null,
            initialListStatus: record.initial_list_status?.toString(),
          }
        });
        
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`✅ Migrated ${successCount} records...`);
        }
        
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error migrating record ${i}:`, errorMessage);
      }
    }
    
    console.log(`🎉 Migration completed!`);
    console.log(`✅ Successfully migrated: ${successCount} records`);
    console.log(`❌ Errors: ${errorCount} records`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('💥 Migration failed:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}

migrateLoanData(); 