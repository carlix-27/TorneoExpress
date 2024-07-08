
//Ver que carajo es el PUBLIC KEY

const mercadopago = new MercadoPago('<PUBLIC_KEY>', {
    locale: 'es-AR'
});

document.getElementById("checkout-btn").addEventListener("click", function () {
    $('#checkout-btn').attr("disabled", true);

    const orderData = {
        description: document.getElementById("product-description").innerHTML,
        price: parseFloat(document.getElementById("unit-price").innerHTML)
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

            $(".shopping-cart").fadeOut(500);
            setTimeout(() => {
                $(".container_payment").show(500).fadeIn();
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
    window.checkoutButton =  renderComponent(bricksBuilder);
}
