document.getElementById('myform').addEventListener('submit', function(event){
    event.preventDefault(); // Prevent form submission
    const existingErrMessages = document.querySelectorAll('.err-message');
    existingErrMessages.forEach(error => error.remove()); // Clear previous error messages

    let isValid = true;

    // Validate all required inputs
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;

            // Create and display the error message if input is empty
            const errMessage = document.createElement('div');
            errMessage.className = 'err-message';
            errMessage.textContent = 'This field is required!';

            // Insert error message after the input field
            input.parentElement.insertAdjacentElement('afterend', errMessage);

            input.parentElement.id = 'calculation-part-err';

            // Remove error when user starts typing
            input.addEventListener('input', function() {
                const error = input.parentElement.nextElementSibling;
                const inputError = input.parentElement;
                if (error && error.classList.contains('err-message')) {
                    error.remove(); // Remove the error message
                    inputError.id = '';
                }
            });
        }
    });

    // Custom validation for radio button group (Mortgage Type)
    const radioButtons = document.querySelectorAll('input[name="mor-type"]');
    const radioChecked = Array.from(radioButtons).some(radio => radio.checked);

    if (!radioChecked) {
        isValid = false;

        // Create and display the error message if no radio button is selected
        const errMessage = document.createElement('div');
        errMessage.className = 'err-message';
        errMessage.textContent = 'This field is required!';

        // Insert error message after the fieldset (for radio buttons)
        const fieldset = radioButtons[0].closest('fieldset');
        fieldset.insertAdjacentElement('afterend', errMessage);

        fieldset.addEventListener('change', function(){
            const error = fieldset.nextElementSibling;
            if(error && error.classList.contains('err-message')){
                error.remove();
            }
        });
    }

    if (isValid) {
        let mortgageAmount = document.querySelector('.mortgage-amount input').value;
        let mortgageTerm = document.querySelector('.mortgage-term input').value;
        let mortgageInterestRate = document.querySelector('.mortgage-interest input').value;
        function calculateMortgage(mortgageAmount, mortgageInterestRate, mortgageTerm) {
            const monthlyInterestRate = (mortgageInterestRate / 100) / 12;
            const totalPayments = mortgageTerm * 12;
        
            // Monthly Payment Formula
            const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
        
            // Total Repayment Formula
            const totalRepayment = monthlyPayment * totalPayments;
        
            const resultPart = document.querySelector('.result-part');
            resultPart.classList.add('final-results');
            resultPart.innerHTML = `
                <h3>Your results</h3>

                <p>
                Your results are shown below based on the information you provided. 
                To adjust the results, edit the form and click “calculate repayments” again.
                </p>
                <div class='centering-div'>
                <div class='result-shown'> 
                <div class='repay'>
                    <p>Your monthly repayments</p>
                    <span class='repay-shown'>&#163; ${monthlyPayment.toFixed(2)}</span>
                </div>
                <div class='total-overdue'>
                    <p>Total you'll repay over the term</p>
                    <span class='overdue-shown'>&#163;${totalRepayment.toFixed(2)}</span>
                </div>
                </div>
            `;
        }
        calculateMortgage(mortgageAmount, mortgageInterestRate, mortgageTerm);
              
    }
});
