import { calculateMortgage } from "../services/mortgageService";

describe("Mortgage Calculator Tests", () => {
	test("Calculates mortgage for 600,000 property with 20% down payment and 4.19% interest rate", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period (25 years)
			"monthly", // Payment Schedule
		);

		expect(result).toBeCloseTo(2584.35, 2); // Expected result
	});
	test("Calculates mortgage for 600,000 property with 10% down payment and 4.19% interest rate", () => {
		const result = calculateMortgage(
			600000, // Property Price
			60000, // Down Payment (10% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period (25 years)
			"monthly", // Payment Schedule
		);
		expect(result).toBeCloseTo(2997.52, 2); // Expected result with CMHC insurance
	});
	test("Calculates mortgage for 600,000 property with 20% down payment and 4.19% interest rate over 30 years", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			30, // Amortization Period (30 years)
			"monthly", // Payment Schedule
		);
		expect(result).toBeCloseTo(2344.59, 2); // Expected result for 30 years
	});
	test("Calculates mortgage with bi-weekly payments", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period
			"bi-weekly", // Bi-weekly Payment Schedule
		);
		expect(result).toBeCloseTo(1192.78, 2); // Allow for small rounding differences
	});
	test("Throws error for down payment below 5%", () => {
		expect(() =>
			calculateMortgage(
				600000, // Property Price
				10000, // Down Payment (too low)
				4.19, // Annual Interest Rate
				25, // Amortization Period
				"monthly", // Payment Schedule
			),
		).toThrow(
			"For properties between $500,000 and $999,999, the down payment must be at least $35000.00.",
		);
	});
	test("Calculates mortgage with CMHC insurance for down payment less than 20%", () => {
		const result = calculateMortgage(
			600000, // Property Price
			60000, // Down Payment (10% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period
			"monthly", // Payment Schedule
		);

		// Expect a payment with CMHC insurance included
		expect(result).toBeCloseTo(2997.52, 2); // Adjust expected value based on insurance calculation
	});
	test("Calculates mortgage with no CMHC insurance for down payment of 20% or more", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period
			"monthly", // Payment Schedule
		);

		// Expect a payment with no CMHC insurance
		expect(result).toBeCloseTo(2584.35, 2);
	});
	test("Throws error for invalid payment schedule", () => {
		expect(() => {
			calculateMortgage(
				600000, // Property Price
				120000, // Down Payment (20% of 600,000)
				4.19, // Annual Interest Rate
				25, // Amortization Period
				"invalid-schedule", // Invalid Payment Schedule
			);
		}).toThrow("Invalid payment schedule");
	});
	test("Throws error for property over $1,000,000 with down payment less than 20%", () => {
		expect(() => {
			calculateMortgage(
				1200000, // Property Price
				200000, // Down Payment (<20%)
				4.19, // Annual Interest Rate
				25, // Amortization Period
				"monthly", // Payment Schedule
			);
		}).toThrow(
			"For properties $1,000,000 or more, the down payment must be at least 20%.",
		);
	});
	test("Throws error for property between $500,000 and $999,999 with insufficient down payment", () => {
		expect(() => {
			calculateMortgage(
				750000, // Property Price
				25000, // Down Payment (<10%)
				4.19, // Annual Interest Rate
				25, // Amortization Period
				"monthly", // Payment Schedule
			);
		}).toThrow(
			"For properties between $500,000 and $999,999, the down payment must be at least $50000.00.",
		);
	});
	test("Throws error for property $500,000 or less with insufficient down payment", () => {
		expect(() => {
			calculateMortgage(
				450000, // Property Price
				10000, // Down Payment (<5%)
				4.19, // Annual Interest Rate
				25, // Amortization Period
				"monthly", // Payment Schedule
			);
		}).toThrow(
			"For properties $500,000 or less, the down payment must be at least 5% of the property price.",
		);
	});
	test("Calculates mortgage for bi-weekly payments", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period
			"bi-weekly", // Bi-weekly Payment Schedule
		);

		expect(result).toBeCloseTo(1192.78, 2); // Adjust expected value
	});
	test("Calculates mortgage for accelerated bi-weekly payments", () => {
		const result = calculateMortgage(
			600000, // Property Price
			120000, // Down Payment (20% of 600,000)
			4.19, // Annual Interest Rate
			25, // Amortization Period
			"accelerated bi-weekly", // Accelerated Bi-weekly Payment Schedule
		);

		expect(result).toBeCloseTo(1292.18, 1); // Adjust expected value
	});
});
