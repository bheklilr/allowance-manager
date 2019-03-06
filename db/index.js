import { Client } from 'pg';
import QUERIES from './queries';

export async function getDB() {
    if (!process.env.DATABASE_URL) {
        const client = new Client(process.env.DATABASE_URL);
        try {
            await client.connect();
            return client;
        } catch (err) {
            console.log("Failed to connect to database: ", err);
            process.exit(-1);
        }
    }
}

export async function initializeDB(db) {
    console.log("Setting up the database: ", db);
    const client = await getDB();
    console.log("Connected to the database, ensuring the tables are created.");
    try {
        await client.query(QUERIES.createTables);
        console.log("Database is set up");
    } catch (err) {
        console.error("Failed to set up database: ", err);
        process.exit(-2);
    }
}


export async function withDatabase(action) {
    const client = await getDB();
    const result = await action(client);
    return result;
}