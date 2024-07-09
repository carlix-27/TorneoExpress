
// Vendedor Public KEY
const mercadopago = new MercadoPago("APP_USR-6b76fcb4-909a-41bb-9abb-35e4910f698c", {
    locale: 'es-AR'
});

document.getElementById("checkout-btn").addEventListener("click", function () {
    $('#checkout-btn').attr("disabled", true);

    fetch("/api/user/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (preference) {
            console.log("Preference ID: ", preference.id)
            createCheckoutButton(preference.id);

            const unitPrice = 500

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
