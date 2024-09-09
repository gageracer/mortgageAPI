export const formTemplate = (
	propertyPrice: number,
	downPaymentPercent: number,
	downPayment: number,
	cmhcInsuranceCost: number,
	annualInterestRate: number,
	principal: number,
	amortizationPeriod: number,
	paymentSchedule: string,
	finalPayment: number,
	error?: string,
): string => {
	return `
    <form hx-post="/api/mortgage" hx-swap="outerHTML" hx-target="#form" hx-trigger="change delay:100ms" id="form">
            <div class="grid grid-cols-1 gap-4">
                <!-- Property Price -->
                <div>
                    <label for="propertyPrice">Start Here</label>
                        <div class="relative mt-1">
                            <span class="absolute inset-y-0 left-0 pl-1 mb-4 flex items-center text-gray-500">$</span>
                            <input type="number" id="propertyPrice" name="propertyPrice" placeholder="600,000" value="${propertyPrice}"
                            min="0"  required>
                        </div>
                </div>

                <!-- Down Payment (both percentage and raw number) -->
                <div>
                    <label for="downPayment">- Down Payment</label>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="relative mt-1">
                            <span class="absolute inset-y-0 left-0 pl-1 mb-4 flex items-center text-gray-500 text-xs">%</span>
                            <input type="number" id="downPaymentPercent" name="downPaymentPercent" placeholder="10"
                                value="${downPaymentPercent}" step="0.01" min="0" max="100"  required>
                        </div>
                        <div class="relative mt-1">
                            <span class="absolute inset-y-0 left-0 pl-1 mb-4 flex items-center text-gray-500">$</span>
                            <input type="number" id="downPayment" name="downPayment" placeholder="60,000" value="${downPayment}"
                                min="0" required>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <!-- CMHC Insurance -->
                    <label>+ CMHC Insurance</label>
                    <p id="cmhcInsurance">$${cmhcInsuranceCost}</p>


                    <!-- Total Mortgage -->

                    <label>= Total Mortgage</label>
                    <p id="totalMortgage" >$${principal}</p>


                    <!-- Amortization Period -->

                    <label for="amortizationPeriod">Amortization Period</label>
                    <select id="amortizationPeriod" name="amortizationPeriod" class="form-select" required>
                        ${amortizationPeriodList(amortizationPeriod)}
                    </select>


                    <!-- Mortgage Rate -->
                    <label for="annualInterestRate">Mortgage rate</label>
                    <div class="relative mt-1">
                        <span
                            class="absolute inset-y-0 left-0 pl-1 mb-4 flex items-center text-gray-500 text-xs">%</span>
                        <input type="number" id="annualInterestRate" name="annualInterestRate" placeholder="4.19"
                            value="${annualInterestRate}" step="0.01" min="0" c required>
                    </div>
                    <!-- Payment Frequency -->

                    <label for="paymentSchedule">Payment Frequency</label>
                    <select id="paymentSchedule" name="paymentSchedule" class="form-select" required>
                    ${paymentScheduleList(paymentSchedule)}
                    </select>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-4">
                <button type="submit" hx-post="/api/mortgage" hx-target="#form" hx-swap="outerHTML" class="btn btn-primary">Calculate</button>
            </div>
            <!-- Results Section -->
            <div id="result" class="mt-8">
                <h3>= Mortgage payment</h3>
                <p class="text-lg font-bold ${error ? "text-red-400" : ""}">${error ?? finalPayment}</p>
            </div>
        </form>
    `;
};

const amortizationPeriodList = (year: number): string => {
	let selects = "";
	for (const num of [5, 10, 15, 20, 25, 30]) {
		if (num === year) {
			selects += `<option value=${num} selected>${num}-year</option>`;
		} else {
			selects += `<option value=${num}>${num}-year</option>`;
		}
	}
	return selects;
};
const paymentScheduleList = (schedule: string): string => {
	let selects = "";
	for (const freq of ["Monthly", "Accelerated bi-weekly", "Bi-weekly"]) {
		if (freq === schedule) {
			selects += `<option selected>${freq}</option>`;
		} else {
			selects += `<option>${freq}</option>`;
		}
	}
	return selects;
};
