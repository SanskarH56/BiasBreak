import { processRows } from "../utils/dataProcessor";

export const analyzeDataset = async (rows, target, sensitive) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processedRows = processRows(rows, sensitive);
      
      const total = processedRows.length;
      let selected = 0;
      let rejected = 0;

      processedRows.forEach((row) => {
        if (row[target] == 1) selected++;
        else rejected++;
      });

      resolve({
        total,
        selected,
        rejected,
        processedRows
      });
    }, 1200); // simulate API delay
  });
};

export const runMitigationSimulation = async (rows, target, sensitive) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simple mock mitigation: randomly flip some rejected to selected to balance rates
      const mitigatedRows = rows.map((row) => {
        if (row[target] == 0 && Math.random() > 0.8) {
           return { ...row, [target]: 1 };
        }
        return row;
      });

      resolve({
        mitigatedRows
      });
    }, 1500); // simulate ML model running
  });
};
