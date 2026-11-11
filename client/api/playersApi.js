const PLAYERS_URL = "http://localhost:3000/api/players";

export async function findPlayerByName (name) {

    const response = await fetch(
        `${PLAYERS_URL}?name=${encodeURIComponent(name)}`, {
            headers: {
                "Connection": "close"
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Could not find player: ${response.status}`);
    }

    const players = await response.json();
    return players[0];
}


export async function createPlayer(name) {
    const response = await fetch(PLAYERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "Connection": "close" },
        body: JSON.stringify({name, lowestTime: null})
    });

    if (!response.ok) {
        throw new Error(`Could not create player: ${response.status}`);
    }

    return response.json();
}


export async function updatePlayer(player) {
    const response = await fetch(`${PLAYERS_URL}/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
                    "Connection": "close"
     },
        body: JSON.stringify({ lowestTime: player.lowestTime })
    });

    if(!response.ok) {
        throw new Error(`Could not update player: ${response.status}`);
    }

    return response.json();
}

export async function getAllPlayers() {
    const response = await fetch(PLAYERS_URL, {
        headers: {
            "Connection": "close"
        }
    });

    if (!response.ok){
        throw new Error(`Could not load players: ${response.status}`);
    }

    return response.json();
}



export async function getLeaderboard() {
    const response = await fetch(`${PLAYERS_URL}/leaderboard`, {
        headers: {
            "Connection": "close"
        }
    });

    if (!response.ok) {
        throw new Error(`Could not load leaderboard: ${response.status}`);
    }

    return response.json();
}
