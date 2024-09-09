import { Router, type Request, type Response } from "express";
import {
	calculateMortgage,
	validateDownPayment,
} from "../services/mortgageService";
import { MortgageSchemaJSON } from "../services/mortgageValidation";

const router = Router();


router.post("/", (req: Request, res: Response) => {
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
		const acceptHeader = req.get("Content-Type");

		if (acceptHeader?.includes("application/x-www-form-urlencoded")) {
			// If the request expects HTML, send an HTML response
			res.send(`
                <h3>Mortgage Payment</h3>
                <p class="text-lg font-bold">$${payment}</p>
            `);
		}
		if (acceptHeader?.includes("application/json")) {
			// Otherwise, return a JSON response
			res.json({ payment });
		}
		// res.json({ payment });
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
		} else {
			res.status(400).json({ error: "An unknown error occurred" });
		}
	}
});

// router.post("/", (req: Request, res: Response) => {
// 	try {
// 		// Parse and validate the request body using Zod
// 		const validatedData = MortgageSchema.parse(req.body);

// 		// Calculate the mortgage payment
// 		let {
// 			propertyPrice,
// 			downPayment,
// 			downPaymentPercent,
// 			annualInterestRate,
// 			amortizationPeriod,
// 			paymentSchedule,
// 		} = validatedData;

// 		// Ensure that either downPayment or downPaymentPercent is provided and calculate downPayment if needed
// 		if (downPaymentPercent) {
// 			downPayment = (propertyPrice * downPaymentPercent) / 100;
// 		}

// 		// Check if downPayment is still undefined after calculations
// 		if (downPayment === undefined) {
// 			return res.status(400).json({
// 				error:
// 					"Either down payment or down payment percentage must be provided.",
// 			});
// 		}
// 		const payment = calculateMortgage(
// 			propertyPrice,
// 			downPayment,
// 			annualInterestRate,
// 			amortizationPeriod,
// 			paymentSchedule,
// 		);

// 		// Check the 'Accept' header to determine whether to return HTML or JSON
// 		const acceptHeader = req.get("Content-Type");

// 		if (acceptHeader?.includes("text/html")) {
// 			// If the request expects HTML, send an HTML response
// 			res.send(`
//                 <h3>Mortgage Payment</h3>
//                 <p class="text-lg font-bold">$${payment}</p>
//             `);
// 		}
// 		if (acceptHeader?.includes("application/json")) {
// 			// Otherwise, return a JSON response
// 			res.json({
// 				propertyPrice,
// 				downPayment,
// 				annualInterestRate,
// 				amortizationPeriod,
// 				paymentSchedule,
// 				payment,
// 				message: "Success",
// 			});
// 		}
// 	} catch (error) {
// 		// Return validation errors or other issues
// 		if (error instanceof ZodError) {
// 			res.status(400).json({ error: error.errors });
// 		} else {
// 			res.status(500).json({ error: "Internal Server Error" });
// 		}
// 	}
// });
export default router;
