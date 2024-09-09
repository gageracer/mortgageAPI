import { Router, type Request, type Response } from "express";
import {
	calculateMortgage,
	validateDownPayment,
} from "../services/mortgageService";
import { MortgageSchema } from "../services/mortgageValidation";

const router = Router();

router.post("/", (req: Request, res: Response) => {
	const validationResult = MortgageSchema.safeParse(req.body);

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
			error: "Either down payment or down payment percentage must be provided.",
		});
	}

	try {
		// Validate the down payment and calculate mortgage
		validateDownPayment(propertyPrice, downPayment);
		const payment = calculateMortgage(
			propertyPrice,
			downPayment,
			annualInterestRate,
			amortizationPeriod,
			paymentSchedule,
		);

		res.json({ payment });
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
		} else {
			res.status(400).json({ error: "An unknown error occurred" });
		}
	}
});

export default router;
