/**
 * Currency Conversion Utilities
 *
 * Used to convert INR to KWD for MyFatoorah payments since
 * MyFatoorah doesn't support INR payments directly.
 */

// Exchange rate: 1 KWD = ~270 INR (approximate rate)
// This should ideally come from an API for real-time rates
const INR_TO_KWD_RATE = 0.0037; // 1 INR = 0.0037 KWD

/**
 * Convert INR amount to KWD for MyFatoorah payment
 * @param inrAmount Amount in INR
 * @returns Amount in KWD (rounded to 3 decimal places)
 */
export const convertINRtoKWD = (inrAmount: number): number => {
  const kwdAmount = inrAmount * INR_TO_KWD_RATE;
  // Round to 3 decimal places (KWD standard)
  return Math.round(kwdAmount * 1000) / 1000;
};

/**
 * Convert KWD amount back to INR (for display purposes)
 * @param kwdAmount Amount in KWD
 * @returns Amount in INR (rounded to 2 decimal places)
 */
export const convertKWDtoINR = (kwdAmount: number): number => {
  const inrAmount = kwdAmount / INR_TO_KWD_RATE;
  return Math.round(inrAmount * 100) / 100;
};

/**
 * Get the payment amount and currency for MyFatoorah
 * Converts INR to KWD since MyFatoorah doesn't support INR
 *
 * @param amount Original amount
 * @param currency Original currency ('KWD' or 'INR')
 * @returns Object with converted amount and currency for MyFatoorah
 */
export const getMyFatoorahPaymentAmount = (
  amount: number,
  currency: 'KWD' | 'INR'
): { amount: number; currency: 'KWD' } => {
  if (currency === 'INR') {
    return {
      amount: convertINRtoKWD(amount),
      currency: 'KWD'
    };
  }
  return {
    amount,
    currency: 'KWD'
  };
};

/**
 * Get the current exchange rate info for display
 */
export const getExchangeRateInfo = () => ({
  rate: INR_TO_KWD_RATE,
  rateDisplay: `1 INR = ${INR_TO_KWD_RATE} KWD`,
  inverseRate: 1 / INR_TO_KWD_RATE,
  inverseRateDisplay: `1 KWD = ${Math.round(1 / INR_TO_KWD_RATE)} INR`
});
