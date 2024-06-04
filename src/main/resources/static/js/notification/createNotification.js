function createNotification(team, userId) {
    fetch(`/api/notifications/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fromId: userId,
            toId: team.captain_id,
            message: `You have received an invite to join the team ${team.name}.`
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notification => {
            console.log("Notification created successfully.");
            displaySuccessMessage("Signup successful! An invite has been sent to the team captain.");
        })
        .catch(error => {
            console.error("Error creating notification:", error);
            // Handle error creating notification
        });
}