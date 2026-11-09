const PLAYERS_URL = "http://localhost:3000/players";

export async function findPlayerByName (name) {

    const response = await fetch(
        `${PLAYERS_URL}?name=${encodeURIComponent(name)}`
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, lowestTime: null})
    });

    if (!response.ok) {
        throw new Error(`Could not create player: ${response.status}`);
    }

    return response.json();
}


export async function updatePlayer(player) {
    const response = await fetch(`${PLAYERS_URL}/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lowestTime: player.lowestTime })
    });

    if(!response.ok) {
        throw new Error(`Could not update player: ${response.status}`);
    }

    return response.json();
}

export async function getAllPlayers() {
    const response = await fetch(PLAYERS_URL);

    if (!response.ok){
        throw new Error(`Could not load players: ${response.status}`);
    }

    return response.json();
}

