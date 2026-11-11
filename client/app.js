// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.

import PromptSync from 'prompt-sync';
import Player from "./classes/Player.js";
import Riddle from "./classes/Riddle.js";

import {
    getAllRiddles,
    createRiddle,
    updateRiddle,
    deleteRiddle
} from "./api/riddlesApi.js";

import {
    findPlayerByName,
    createPlayer,
    updatePlayer,
    getAllPlayers,
    getLeaderboard
} from "./api/playersApi.js";


const prompt = PromptSync();

console.log("Welcome to the Riddle Game!");



async function playGame() {


    const playerName = prompt("What is your name? ").trim();
    if (playerName === "") {
        console.log("Please enter a name.");
        return;
    }

    let savedPlayer = await findPlayerByName(playerName);

    if (savedPlayer) {
        if (savedPlayer.lowestTime !== null) {
            console.log (
                `Hi ${savedPlayer.name}! Your previous lowest time was ${savedPlayer.lowestTime} seconds.`
            );
        } 
    } else {
        savedPlayer = await createPlayer(playerName);
    }

    const player = new Player(playerName);
    const riddles = await getAllRiddles();


    for (const riddleData of riddles) {
        const startTime = Date.now();
    
        const riddle = new Riddle(
            riddleData.id,
            riddleData.name,
            riddleData.taskDescription,
            riddleData.correctAnswer
        );
    
        riddle.ask(prompt);
    
        const endTime = Date.now();
        player.recordTime(startTime, endTime);
    }


    player.showStats();

    if (player.times.length === 0) {
        return;
    }


    let totalTime = 0;

    for (const time of player.times) {
        totalTime += time;
    }

    const currentTime = totalTime / 1000;

    console.log(`Great job, ${player.name}!`);
    console.log(`Your time: ${currentTime.toFixed(2)} seconds`);

    const result = await updatePlayer({
        id: savedPlayer.id,
        lowestTime: currentTime
    });
    
    if (result.recordUpdated) {
        console.log("New record! Time updated.");
    } else {
        console.log(`Your best time is still ${result.lowestTime} seconds.`);
    }




}

function readRiddleDetails() {
    return {
        name: prompt("Enter riddle name: ").trim(),
        taskDescription: prompt("Enter description: ").trim(),
        correctAnswer: prompt("Enter correct answer: ").trim()
    };
}


async function showLeaderboard () {
    const players = await getLeaderboard();

    console.log("🏆 Leaderboard:");

    if (players.length === 0) {
        console.log("No completed games yet.");
        return;
    }



    players.forEach((player, index) => {
        console.log(
            `${index + 1}. ${player.name} - ${player.lowestTime} seconds`
        );
    });


}






let choice;

do {
    console.log(`
    What do you want to do?
    1. Play the game
    2. Create a new riddle
    3. Read all riddles
    4. Update an existing riddle
    5. Delete a riddle
    6. View leaderboard
    0. Exit
    `);

    choice = prompt("Choose an option: ").trim();

    try{
        switch (choice) {

            case "1":
                {await playGame();
                break;}
    
            case "2":
                {const riddle = readRiddleDetails();
                await createRiddle(riddle);
                console.log("Riddle saved!");
                break;}
    
            case "3":
                {const riddles = await getAllRiddles();
                console.table(riddles);
                break;}
    
            case "4":
                {const id = prompt("Enter the ID of the riddle to update: ").trim();
                if (id === "") {
                    console.log("Please enter an ID.");
                    break;
                }
    
                const riddle = readRiddleDetails();
                await updateRiddle(id, riddle);
                console.log("Riddle updated!");
                break;}
    
            case "5":
                {
                const id = prompt("Enter the ID of the riddle to delete: ").trim();
                if (id === "") {
                    console.log("Please enter an ID.");
                    break;
                } 
    
                await deleteRiddle(id);
                console.log("Riddle deleted!");
                break;
            }
    
            case "6":
                await showLeaderboard();
                break;
    
    
                case "0":
                    console.log("Goodbye!");
                    break;
    
        
                    default:
                        console.log("Invalid choice. Try again.");
                        
        }
    } catch (error) {
        console.error(error);
    }


    
} while (choice !== "0");

















