import { z } from "zod";

// Define a Zod schema for input validation for JSON
export const MortgageSchemaJSON = z
	.object({
		propertyPrice: z
			.number()
			.positive("Property price must be a positive number."),
		downPayment: z.number().optional(),
		downPaymentPercent: z
			.number()
			.min(0, "Down payment percentage must be positive.")
			.max(100, "Down payment percentage cannot exceed 100%")
			.optional(),
		annualInterestRate: z
			.number()
			.min(0.01, "Interest rate must be greater than 0."),
		amortizationPeriod: z
			.number()
			.refine((val) => [5, 10, 15, 20, 25, 30].includes(val), {
				message:
					"Amortization period must be one of 5, 10, 15, 20, 25, or 30 years.",
			}),
		paymentSchedule: z.enum(["Monthly", "Bi-weekly", "Accelerated bi-weekly"]),
	})
	.refine((data) => data.downPayment || data.downPaymentPercent, {
		message: "Either down payment or down payment percentage must be provided.",
	});

// Schema to validate and transform inputs from the web form
export const mortgageSchemaWeb = z
	.object({
		propertyPrice: z.string().transform((val) => {
			const price = Number.parseFloat(val);
			if (Number.isNaN(price)) {
				throw new Error("Invalid property price. Please enter a valid number.");
			}
			return price;
		}),
		downPaymentPercent: z.string().transform((val) => {
			const percent = Number.parseFloat(val);
			if (Number.isNaN(percent) || percent < 0 || percent > 100) {
				throw new Error(
					"Invalid down payment Percent. Please enter a valid number between 0 and 100.",
				);
			}
			return percent;
		}),
		downPayment: z.string().transform((val) => {
			const payment = Number.parseFloat(val);
			if (Number.isNaN(payment)) {
				throw new Error("Invalid down payment. Please enter a valid number.");
			}
			return payment;
		}),
		
		annualInterestRate: z.string().transform((val) => {
			const rate = Number.parseFloat(val);
			if (Number.isNaN(rate)) {
				throw new Error("Invalid interest rate. Please enter a valid number.");
			}
			return rate;
		}),
		amortizationPeriod: z.string().transform((val) => {
			const period = Number.parseInt(val, 10);
			if (Number.isNaN(period)) {
				throw new Error(
					"Invalid amortization period. Please enter a valid number.",
				);
			}
			return period;
		}),
		paymentSchedule: z.enum(["Monthly", "Bi-weekly", "Accelerated bi-weekly"]),
	})
	.refine((data) => data.downPayment || data.downPaymentPercent, {
		message: "Either down payment or down payment percentage must be provided.",
	});
