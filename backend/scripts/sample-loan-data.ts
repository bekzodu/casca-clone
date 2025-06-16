const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

console.log('Script started!');

// Use a more reliable path resolution
const projectRoot = path.resolve(__dirname, '..');
const filePath = path.join(projectRoot, 'data', 'accepted_2007_to_2018Q4.csv');
console.log('Project root:', projectRoot);
console.log('Resolved file path:', filePath);
console.log('Does file exist?', fs.existsSync(filePath));

const outputPath = path.join(projectRoot, 'data', 'loan_sample_1000.json');

const sampleSize = 1000;
const sample: any[] = [];
let rowCount = 0;

if (!fs.existsSync(filePath)) {
  console.error('CSV file not found:', filePath);
  process.exit(1);
}

console.log('About to create read stream...');

// Function to write the sample and exit
function writeSampleAndExit() {
  console.log(`🧪 Sample length before writing: ${sample.length}`);
  fs.writeFileSync(outputPath, JSON.stringify(sample, null, 2));
  console.log(`✅ Wrote ${sample.length} rows to ${outputPath}`);
  process.exit(0);
}

const stream = fs.createReadStream(filePath);
stream.on('open', () => {
  console.log('✅ Stream opened successfully');
});
stream.on('error', (err: any) => {
  console.error('❌ Stream open failed:', err);
});

stream
  .pipe(csv())
  .on('data', (row: any) => {
    rowCount++;
    if (rowCount === 1) {
      console.log('First row received:', Object.keys(row));
    }
    if (rowCount % 10000 === 0) {
      console.log(`Processed ${rowCount} rows, collected ${sample.length} samples...`);
    }
    
    if (sample.length < sampleSize) {
      sample.push(row);
      
      // Write file and exit once we have enough samples
      if (sample.length === sampleSize) {
        console.log(`✅ Collected ${sampleSize} samples. Writing file and stopping.`);
        writeSampleAndExit();
      }
    }
  })
  .on('end', () => {
    console.log(`✅ Finished parsing. Total rows processed: ${rowCount}`);
    writeSampleAndExit();
  })
  .on('error', (err: any) => {
    console.error('❌ Stream error:', err);
  });

console.log('Stream setup complete');
