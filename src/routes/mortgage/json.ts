import {
	calculateMortgage,
	validateDownPayment,
} from "../../services/mortgageService";
import { MortgageSchemaJSON } from "../../services/mortgageValidation";
import type { Request, Response } from "express";

export const mortgageJSONHandler = (req: Request, res: Response) => {
	try {
		const validationResult = MortgageSchemaJSON.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({ error: validationResult.error.errors });
		}

		let {
			propertyPrice,
			downPayment,
			downPaymentPercent,
			annualInterestRate,
			amortizationPeriod,
			paymentSchedule,
		} = validationResult.data;

		// Ensure that either downPayment or downPaymentPercent is provided and calculate downPayment if needed
		if (downPaymentPercent) {
			downPayment = (propertyPrice * downPaymentPercent) / 100;
		}

		// Check if downPayment is still undefined after calculations
		if (downPayment === undefined) {
			return res.status(400).json({
				error:
					"Either down payment or down payment percentage must be provided.",
			});
		}

		// Validate the down payment and calculate mortgage
		validateDownPayment(propertyPrice, downPayment);
		const mortgage = calculateMortgage(
			propertyPrice,
			downPayment,
			annualInterestRate,
			amortizationPeriod,
			paymentSchedule,
		);
		// Otherwise, return a JSON response
		res.json(mortgage);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
		} else {
			res.status(400).json({ error: "An unknown error occurred" });
		}
	}
};
