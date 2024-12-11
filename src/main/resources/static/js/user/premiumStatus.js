function isUserPremium() {
    const userId = localStorage.getItem("userId");

    try {
        const response = fetch(`api/user/${userId}/premium`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.json
    } catch (error) {
        console.error("Error checking premium status:", error);
    }
}