export function generateUPIUrl({ payeeVPA, payeeName, amount, txnNote }) {
  return `upi://pay?pa=${payeeVPA}&pn=${payeeName}&am=${amount}&cu=INR&tn=${txnNote}`;
}
