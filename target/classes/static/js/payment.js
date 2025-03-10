document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const API_BASE_URL = "https://narayansena-backend-dy-eqgzhsd3dehddfgc.eastasia-01.azurewebsites.net";
    const userId = getQueryParam('userId');
    console.log('userId from URL:', userId);

    if (!userId) {
        alert('User ID is not set. Redirecting to login...');
        window.location.href = 'login.html';
        return;
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('amount').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/payment/create?userId=${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Order Creation Response:', result);

                    const options = {
                        "key": "rzp_test_AIEfgCrKyUEdo8",
                        "amount": result.amount,
                        "currency": "INR",
                        "name": "MyApp",
                        "description": "Test Transaction",
                        "order_id": result.id,
                        "handler": async function (response) {
                            console.log("Payment ID: ", response.razorpay_payment_id);

                            const paymentDetails = {
                                orderId: result.id,
                                paymentId: response.razorpay_payment_id,
                                amountPaid: result.amount / 100
                            };
                            console.log('Saving payment details:', paymentDetails);

                            try {
                                sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

                                const updateResponse = await fetch(`${API_BASE_URL}/api/payment/update`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        orderId: result.id,
                                        paymentId: response.razorpay_payment_id,
                                        status: 'success'
                                    })
                                });

                                if (!updateResponse.ok) {
                                    const errorData = await updateResponse.text();
                                    console.error('Error updating payment:', errorData);
                                } else {
                                    const updateData = await updateResponse.json();
                                    console.log('Payment Update Response:', updateData);
                                }
                            } catch (error) {
                                console.error('Error saving payment details:', error);
                            }

                            setTimeout(() => {
                                window.location.href = 'success.html';
                            }, 1000);
                        },
                        "prefill": {
                            "name": "Your Name",
                            "email": "Your Email",
                            "contact": "Your Contact Number"
                        },
                        "theme": { "color": "#3399cc" },
                        "modal": {
                            "ondismiss": function() {
                                alert("Payment process was interrupted. Please try again.");
                            }
                        }
                    };

                    const rzp1 = new Razorpay(options);
                    rzp1.open();
                } else {
                    const errorData = await response.text();
                    console.error('Error:', errorData);
                    alert('Payment failed: ' + errorData);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            }
        });
    }
});
