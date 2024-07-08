
const mercadopago = new MercadoPago('TESTUSER264492744', {
    locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});


function buyPremium() {

    // Fetch userId from localStorage
    const userId = localStorage.getItem("userId");

    // Check if userId is available
    if (!userId) {
        console.error('User ID not found in localStorage');
        document.getElementById('upgrade-status').innerText = 'User ID not found. Please log in.';
        return;
    }

    fetch(`/api/user/upgrade/${userId}`, { // Update the URL with the actual userId
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // No need to send data in the body since it's based on the userId
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upgrade');
            }
            // Return the response to handle further processing
            return response;
        })
        .then(response => {
            // Check if response has a message in JSON format
            return response.json().then(data => ({
                data: data,
                status: response.status
            }));
        })
        .then(({ data, status }) => {
            if (status === 200) {
                // No content, assume success
                document.getElementById('upgrade-status').innerText = 'You are now a Premium member!';
            } else if (data && data.message) {
                document.getElementById('upgrade-status').innerText = data.message;
            }
        })
        .catch(error => {
            console.error('Upgrade failed:', error);
            document.getElementById('upgrade-status').innerText = 'Upgrade failed. Please try again later.';
        });
}


mp.bricks().create("wallet", "wallet_container", {
    initialization: {
        preferenceId: "wallet_container",
    },
    customization: {
        texts: {
            valueProp: 'smart_option',
        },
    },
});
