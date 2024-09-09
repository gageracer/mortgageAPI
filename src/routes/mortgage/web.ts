import {
	calculateMortgage,
	validateDownPayment,
} from "../../services/mortgageService";
import { mortgageSchemaWeb } from "../../services/mortgageValidation";
import type { Request, Response } from "express";

export const mortgageWebHandler = (req: Request, res: Response) => {
	try {
		const validationResult = mortgageSchemaWeb.safeParse(req.body);

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
		const payment = calculateMortgage(
			propertyPrice,
			downPayment,
			annualInterestRate,
			amortizationPeriod,
			paymentSchedule,
		);
		// If the request expects HTML, send an HTML response
		res.send(`
                <h3>Mortgage Payment</h3>
                <p class="text-lg font-bold">$${payment}</p>
            `);
	} catch (error) {
		if (error instanceof Error) {
			res.send(`
                <h3>Mortgage Payment</h3>
                <p class="text-lg font-bold">${error.message}</p>
                `);
		} else {
			res.status(400).json({ error: "An unknown error occurred" });
		}
	}
};
