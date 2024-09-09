import {
	calculateMortgage,
	validateDownPayment,
} from "../../services/mortgageService";
import { mortgageSchemaWeb } from "../../services/mortgageValidation";
import type { Request, Response } from "express";
import { formTemplate } from "./formTemplate";
import { roundToTwo } from "../../utils/moneyUtils";

export const mortgageWebHandler = (req: Request, res: Response) => {
	let cmhcInsuranceCost = 0;
	let principal = 0;
	let finalPayment = 0;
	let propertyPrice = 0;
	let downPayment = 0;
	let downPaymentPercent = 0;
	let annualInterestRate = 0;
	let amortizationPeriod = 0;
	let paymentSchedule = ""; // String initialization for schedule type
	try {
		const validationResult = mortgageSchemaWeb.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({ error: validationResult.error.errors });
		}
		({
			propertyPrice,
			downPayment,
			downPaymentPercent,
			annualInterestRate,
			amortizationPeriod,
			paymentSchedule,
		} = validationResult.data);
		// Ensure that either downPayment or downPaymentPercent is provided and calculate downPayment if needed
		if (downPaymentPercent) {
			downPayment = roundToTwo((propertyPrice * downPaymentPercent) / 100);
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
		cmhcInsuranceCost = payment.cmhcInsuranceCost;
		principal = payment.principal;
		finalPayment = payment.finalPayment;
		// If the request expects HTML, send an HTML response
		res.send(
			formTemplate(
				propertyPrice,
				downPaymentPercent,
				downPayment,
				payment.cmhcInsuranceCost,
				annualInterestRate,
				payment.principal,
				amortizationPeriod,
				paymentSchedule,
				payment.finalPayment,
			),
		);
	} catch (error) {
		if (error instanceof Error) {
			res.send(
				formTemplate(
					propertyPrice,
					downPaymentPercent,
					downPayment,
					cmhcInsuranceCost,
					annualInterestRate,
					principal,
					amortizationPeriod,
					paymentSchedule,
					finalPayment,
					error.message,
				),
			);
		} else {
			res.send(`
                <h3>Mortgage Payment</h3>
                <p class="text-lg font-bold">An unknown error occurred. Please restart the page.</p>
                `);
		}
	}
};
