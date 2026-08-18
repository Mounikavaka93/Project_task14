/** Format amount as Indian Rupees (e.g. ₹1,299) */
export function formatPrice(amount) {
  const value = Number(amount) || 0
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}
