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
		paymentSchedule: z.enum(["monthly", "bi-weekly", "accelerated bi-weekly"]),
	})
	.refine((data) => data.downPayment || data.downPaymentPercent, {
		message: "Either down payment or down payment percentage must be provided.",
	});
