import * as fs from 'fs';
import * as path from 'path';

const projectRoot = path.resolve(__dirname, '..');
const filePath = path.join(projectRoot, 'data', 'loan_sample_1000.json');

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Total records:', data.length);
  console.log('\nFirst record keys:', Object.keys(data[0]));
  console.log('\nFirst record sample:');
  console.log(JSON.stringify(data[0], null, 2));
  
  console.log('\nSample field values:');
  console.log('ID:', data[0].id);
  console.log('Member ID:', data[0].member_id);
  console.log('Loan Amount:', data[0].loan_amnt);
  console.log('Grade:', data[0].grade);
  console.log('Purpose:', data[0].purpose);
} catch (error) {
  console.error('Error reading file:', error);
} 