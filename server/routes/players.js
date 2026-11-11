import express from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const db = await readDb();
        const name = req.query.name;

        if (name !== undefined) {
            if (typeof name !== "string") {
                return res.status(400).json({
                    error: "Invalid player name"
                });
            }

            const players = db.players.filter(
                player => player.name === name
            );

            return res.json(players.map(player => ({
                ...player,
                timeToBeatMessage: player.lowestTime == null
                    ? null
                    : `Hi ${player.name}! Your previous lowest time was ${player.lowestTime} seconds.`
            })));

        }    

        res.json(db.players);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not load players"
        });
    }
});



router.post("/", async (req, res) => {

    try {

        const { name } = req.body ?? {};

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                error: "Player name is required"
            });
        }

        const playerName = name.trim();
        const db = await readDb();

        const existingPlayer = db.players.find(
            player => player.name === playerName
        );

        if (existingPlayer) {
            return res.json(existingPlayer);
        }

        const id = Math.max(
            0,
            ...db.players.map(player => player.id)
        ) + 1;

        const newPlayer = {
            id,
            name: playerName,
            lowestTime: null
        };

        db.players.push(newPlayer);
        await writeDb(db);

        res.status(201).json(newPlayer);




    } catch (error) {

        console.error(error);
        res.status(500).json({
            error: "Could not create player"
        });
    }
});



router.put("/:id", async (req, res) => {
     
    try {

        const id = Number(req.params.id);
        const { lowestTime } = req.body ?? {};

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                error: "Invalid player ID"
            });
        }

        if (
            typeof lowestTime !== "number" ||
            !Number.isFinite(lowestTime) ||
            lowestTime < 0
        ) {
            return res.status(400).json({
                error: "Time must be a non-negative number"
            });
        }

        const db = await readDb();

        const player = db.players.find(
            player => player.id === id
        );


        if (!player) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        const recordUpdated =
        player.lowestTime == null ||
        lowestTime < player.lowestTime;

        if (recordUpdated) {
            player.lowestTime = lowestTime;
            await writeDb(db);
        }

        res.json({
            ...player,
            recordUpdated
        });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not update player"
        });

    }
})


router.get("/leaderboard", async (req, res) => {
    try {
        const db = await readDb();

        const leaderboard = db.players
            .filter(player => player.lowestTime != null)
            .sort((a, b) => a.lowestTime - b.lowestTime);


            res.json(leaderboard);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not load leaderboard"
        });
    }

})




export default router;