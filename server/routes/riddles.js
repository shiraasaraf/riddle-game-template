import express from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.riddles);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not load riddles"
        });
    }
});





router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                error: "Invalid riddle ID"
            });
        }
        
        const db = await readDb();

        const riddle = db.riddles.find(
            riddle => riddle.id === id
        );

        if (!riddle) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }

        res.json(riddle);


    

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not load riddle"
        });
    }
});



router.post("/", async (req, res) => {
    try {

        const {name, taskDescription, correctAnswer } = req.body ?? {};

        const fields = [name, taskDescription, correctAnswer];
        
        if ( fields.some(value =>
            typeof value !== "string" || value.trim() === ""
        )) {
            return res.status(400).json({
                error: "Name, description and answer are required"
            });
        }

        const db = await readDb();

        const id = Math.max(
            0,
            ...db.riddles.map(riddle => riddle.id)
        ) + 1;

        const newRiddle = {
            id,
            name: name.trim(),
            taskDescription: taskDescription.trim(),
            correctAnswer: correctAnswer.trim()
        };
    
        db.riddles.push(newRiddle);
        await writeDb(db);

        res.status(201).json(newRiddle);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not create riddle"
        });
    }
});



router.put("/:id", async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                error: "Invalid riddle ID"
            });
        }


        const { name, taskDescription, correctAnswer } = req.body ?? {};
        const fields = [name, taskDescription, correctAnswer];

        if (fields.some(value =>
            typeof value !== "string" || value.trim() === ""
        )) {
            return res.status(400).json({
                error: "Name, description and answer are required"
            });
        }

        const db = await readDb();

        const index = db.riddles.findIndex(
            riddle => riddle.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }


        const updatedRiddle = {
            id,
            name: name.trim(),
            taskDescription: taskDescription.trim(),
            correctAnswer: correctAnswer.trim()
        };

        db.riddles[index] = updatedRiddle;

        await writeDb(db);

        res.json(updatedRiddle);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not update riddle"
        });
    }
});


router.delete("/:id", async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                error: "Invalid riddle ID"
            });
        }

        const db = await readDb();

        const index = db.riddles.findIndex(
            riddle => riddle.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }

        const [deletedRiddle] = db.riddles.splice(index, 1);

        await writeDb(db);

        res.json(deletedRiddle);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not delete riddle"
        });
    }
});


export default router;