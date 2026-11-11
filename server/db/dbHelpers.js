import fs from "node:fs/promises";

const DB_URL = new URL("./db.json", import.meta.url);

export async function readDb() {
    const text = await fs.readFile(DB_URL, "utf8");
    return JSON.parse(text);
}

export async function writeDb(data) {
    const text = JSON.stringify(data, null, 2);
    await fs.writeFile(DB_URL, text, "utf8");
}