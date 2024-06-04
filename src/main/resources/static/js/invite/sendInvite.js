function sendInvite(team, userId) {
    fetch(`/api/invites/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inviterId: userId,
            inviteeId: team.captain_id,
            teamId: team.id
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send invite: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(invite => {
            console.log("Invite sent successfully.");
            createNotification(team, userId);
        })
        .catch(error => {
            console.error("Error sending invite:", error);
            // Handle error sending invite
        });
}