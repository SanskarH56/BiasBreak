export const processRows = (rows, sensitiveCol) => {
  if (!rows || rows.length === 0) return rows;

  // Check if sensitive column is numeric
  let isNumeric = true;
  for (let i = 0; i < Math.min(rows.length, 100); i++) {
    const val = rows[i][sensitiveCol];
    if (val !== "" && val !== null && val !== undefined && isNaN(Number(val))) {
      isNumeric = false;
      break;
    }
  }

  if (!isNumeric) return rows;

  // Extract all valid numeric values
  const values = rows
    .map((r) => Number(r[sensitiveCol]))
    .filter((v) => !isNaN(v));
    
  if (values.length === 0) return rows;

  const uniqueValues = new Set(values);
  
  const colName = sensitiveCol.toLowerCase();
  
  // Rule 1: "experience" should not have a bucket, or if small cardinality
  if (colName.includes("experience") || uniqueValues.size <= 8) {
    return rows.map(r => ({
      ...r,
      [sensitiveCol]: `${r[sensitiveCol]}` // Convert to string for charting
    }));
  }

  // Calculate range
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  if (range === 0) return rows;

  let bucketSize = 10;
  
  // Rule 2: "age" shouldn't be too big (5 years is too large and loses meaning)
  // We'll use 2-year or 3-year buckets depending on range.
  if (colName.includes("age")) {
    bucketSize = range > 30 ? 3 : 2; 
  } else {
    // General numeric bucketing based on context
    if (range <= 10) bucketSize = 2;
    else if (range <= 50) bucketSize = 5;
    else if (range <= 100) bucketSize = 10;
    else if (range <= 500) bucketSize = 50;
    else if (range <= 1000) bucketSize = 100;
    else bucketSize = Math.ceil(range / 10);
  }

  return rows.map((row) => {
    const val = Number(row[sensitiveCol]);
    if (isNaN(val)) return row;

    const bucketStart = Math.floor(val / bucketSize) * bucketSize;
    const bucketEnd = bucketStart + bucketSize - 1;
    
    return {
      ...row,
      [sensitiveCol]: `${bucketStart}-${bucketEnd}`
    };
  });
};
