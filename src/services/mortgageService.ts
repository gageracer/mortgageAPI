import { roundToTwo } from "../utils/moneyUtils";

// Custom validation for down payment based on property price
export const validateDownPayment = (
	propertyPrice: number,
	downPayment: number,
) => {
	if (propertyPrice >= 1_000_000) {
		// For properties $1,000,000 or more, down payment must be at least 20%
		if (downPayment < propertyPrice * 0.2) {
			throw new Error(
				"For properties $1,000,000 or more, the down payment must be at least 20%.",
			);
		}
	} else if (propertyPrice > 500_000) {
		// For properties between $500,000 and $999,999
		const minDownPayment = 500_000 * 0.05 + (propertyPrice - 500_000) * 0.1;
		if (downPayment < minDownPayment) {
			throw new Error(
				`For properties between $500,000 and $999,999, the down payment must be at least $${minDownPayment.toFixed(2)}.`,
			);
		}
	} else {
		// For properties $500,000 or less, the minimum down payment is 5%
		if (downPayment < propertyPrice * 0.05) {
			throw new Error(
				"For properties $500,000 or less, the down payment must be at least 5% of the property price.",
			);
		}
	}
};

export const calculateMortgage = (
	propertyPrice: number,
	downPayment: number,
	annualInterestRate: number,
	amortizationPeriod: number,
	paymentSchedule: string,
): {
	principal: number;
	cmhcInsuranceCost: number;
	paymentSchedule: "Monthly" | "Bi-weekly" | "Accelerated bi-weekly";
	interestRatePerPeriod: number;
	roundedInterestRatePerPeriod: number;
	numberOfPayments: number;
	finalPayment: number;
} => {
	validateDownPayment(propertyPrice, downPayment);

	let cmhcInsuranceCost = 0;
	if (downPayment < propertyPrice * 0.2 && propertyPrice < 1_000_000) {
		cmhcInsuranceCost = calculateCMHCInsurance(propertyPrice, downPayment);
	}

	const principal = propertyPrice - downPayment + cmhcInsuranceCost;

	let paymentsPerYear: number;
	let interestRatePerPeriod: number;

	switch (paymentSchedule) {
		case "Monthly":
			paymentsPerYear = 12;
			interestRatePerPeriod = annualInterestRate / 100 / 12; // Monthly interest rate
			break;
		case "Bi-weekly":
			paymentsPerYear = 12; // First, calculate the monthly payment and then convert to bi-weekly
			interestRatePerPeriod = annualInterestRate / 100 / 12; // Monthly interest rate
			break;
		case "Accelerated bi-weekly":
			paymentsPerYear = 12; // First, calculate the monthly payment and then divide by 2
			interestRatePerPeriod = annualInterestRate / 100 / 12; // Monthly interest rate
			break;
		default:
			throw new Error("Invalid payment schedule");
	}

	const n = amortizationPeriod * paymentsPerYear;

	const roundedInterestRatePerPeriod =
		Math.round(interestRatePerPeriod * 1_000_000) / 1_000_000; // Round to 6 decimal places

	const numerator =
		roundedInterestRatePerPeriod * (1 + roundedInterestRatePerPeriod) ** n;
	const denominator = (1 + roundedInterestRatePerPeriod) ** n - 1;

	let monthlyPayment = principal * (numerator / denominator);

	// Adjust for payment schedule
	if (paymentSchedule === "Accelerated bi-weekly") {
		monthlyPayment = roundToTwo(monthlyPayment / 2); // Accelerated bi-weekly is half of monthly payment
	}
	if (paymentSchedule === "Bi-weekly") {
		monthlyPayment = roundToTwo((monthlyPayment * 12) / 26); // Regular bi-weekly is annual divided by 26
	}
	if (paymentSchedule === "Monthly") {
		monthlyPayment = roundToTwo(monthlyPayment); // monthly
	}

	// For monthly payment
	console.log({
		principal,
		cmhcInsuranceCost,
		paymentSchedule,
		interestRatePerPeriod,
		roundedInterestRatePerPeriod,
		numberOfPayments: n,
		finalPayment: monthlyPayment,
	});

	return {
		principal,
		cmhcInsuranceCost,
		paymentSchedule,
		interestRatePerPeriod,
		roundedInterestRatePerPeriod,
		numberOfPayments: n,
		finalPayment: monthlyPayment,
	}; // Return monthly payment if not bi-weekly or accelerated bi-weekly
};

export const calculateCMHCInsurance = (
	propertyPrice: number,
	downPayment: number,
): number => {
	if (downPayment >= propertyPrice * 0.2) {
		// No CMHC insurance if down payment is 20% or more
		return 0;
	}

	const loanAmount = propertyPrice - downPayment;
	const loanToValueRatio = loanAmount / propertyPrice;

	let insuranceRate = 0;

	// Loan-to-value thresholds for CMHC insurance
	if (loanToValueRatio > 0.95) {
		throw new Error("Down payment is too low to qualify for a mortgage.");
	}
	if (loanToValueRatio > 0.9) {
		insuranceRate = 0.04; // 4%
	} else if (loanToValueRatio > 0.85) {
		insuranceRate = 0.031; // 3.1%
	} else if (loanToValueRatio > 0.8) {
		insuranceRate = 0.028; // 2.8%
	}

	// Calculate the CMHC insurance cost (premium)
	return roundToTwo(loanAmount * insuranceRate);
};
