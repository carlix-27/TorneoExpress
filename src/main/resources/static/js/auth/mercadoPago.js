const mercadopago = new MercadoPago('TESTUSER264492744', {
    locale: 'es-AR'
});

document.getElementById("checkout-btn").addEventListener("click", function () {
    $('#checkout-btn').attr("disabled", true);

    const unitPrice = parseFloat(document.getElementById("unit-price").textContent);
    const orderData = {
        price: unitPrice
    };

    fetch("/api/user/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (preference) {
            createCheckoutButton(preference.id);

            // Populate the summary price and total elements
            document.getElementById("summary-price").textContent = `$${unitPrice}`;
            document.getElementById("summary-total").textContent = `$${unitPrice}`;

            $(".shopping-cart").addClass("hidden");
            setTimeout(() => {
                $(".container_payment").fadeIn(500).removeClass("hidden");
            }, 500);
        })
        .catch(function () {
            alert("Unexpected error");
            $('#checkout-btn').attr("disabled", false);
        });
});

function createCheckoutButton(preferenceId) {
    const bricksBuilder = mercadopago.bricks();

    const renderComponent = async (bricksBuilder) => {
        if (window.checkoutButton) window.checkoutButton.unmount();
        await bricksBuilder.create(
            'wallet',
            'button-checkout', // class/id where the payment button will be displayed
            {
                initialization: {
                    preferenceId: preferenceId
                },
                callbacks: {
                    onError: (error) => console.error(error),
                    onReady: () => {}
                }
            }
        );
    };
    window.checkoutButton = renderComponent(bricksBuilder);
}
