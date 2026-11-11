const BASE_URL = "http://localhost:3000/api";


export async function getAllRiddles() {

    const response = await fetch(`${BASE_URL}/riddles`, {
        headers: {
            "Connection": "close"
        }
    });

    if (!response.ok) {
        throw new Error(`Could not load riddles: ${response.status}`);
    }

    return response.json();

}



export async function createRiddle(riddle) {

    const response = await fetch(`${BASE_URL}/riddles`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "Connection": "close"
     },
        body: JSON.stringify(riddle)
    });

    if (!response.ok) {
        throw new Error(`Could not create riddle: ${response.status}`);
    }

    return response.json();
}


export async function updateRiddle(id, riddle) {
    const response = await fetch(`${BASE_URL}/riddles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        "Connection": "close"
    },
        body: JSON.stringify(riddle)
    });

    if (!response.ok) {
        throw new Error(`Could not update riddle: ${response.status}`);
    }


    return response.json();

}


export async function deleteRiddle(id) {
    const response = await fetch(`${BASE_URL}/riddles/${id}` , {
        method: "DELETE",
        headers: {
            "Connection": "close"
        },
    });


    if (!response.ok) {
        throw new Error(`Could not delete riddle: ${response.status}`);
    }


    return response.json();

}