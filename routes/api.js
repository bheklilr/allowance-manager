import { Route } from 'express';
import { withDatabase } from '../db';
import queries from '../db/queries';

const route = new Route();

// route.get("history", (req, res) => {
//     withDatabase(async (client) => {
//         try {
//             const user = req.body.user;
//             const queryResult = await client.query(queries.getPurchases, [user]);
//             console.log("Found ", queryResult.rows.length, " purchases");
//             res.json(queryResult.rows.map((row) => ({
//                 date: row.date,
//                 purchaseName: row.name,
//                 purchaseAmount: row.amount
//             })));
//         } catch (err) {
//             res.json([]);
//         }
//     });
// });

// route.post('history', (req, res) => {
//     withDatabase(async (client) => {
//         let {user, date, purchaseName, purchaseAmount} = req.body;
//         let values = [user, date, purchaseName, purchaseAmount];
//         try {
//             console.log("Inserting purchase for ", req.body);
//             await client.query(queries.insertPurchase, values);
//             console.log("Inserted successfully");
//             res.json({ status: "ok" });
//         } catch (err) {
//             console.log("Failed to insert:", err);
//             res.json({
//                 status: 'failed',
//                 err: err ? err.code ? err.code : "" : "",
//             })
//             return;
//         }
//     });
// });

// route.get("history/clear", (req, res) => {
//     withDatabase(async (client) => {
//         try {
//             let user = req.body.user;
//             console.log("Clearing the database");
//             await client.query(QUERIES.clear, [user]);
//         } finally {
//             res.json({});
//         }
//     });
// });

// route.post("history/edit", (req, res) => {
//     withDatabase(async (client) => {
//         try {
//             console.log("Editing a purchase");
//             /** 
//              * @typedef {Object} Update
//              * @property {string} user
//              * @property {string=} date
//              * @property {string=} name
//              * @property {number=} price
//              * @property {string=} url
//              */
//             /** @type Update */
//             const update = req.body;
//         } catch (err) {

//         }
//     });
// })

// route.post("history/delete", (req, res) => {
//     withDatabase(async (client) => {
//         try {
//             console.log("Removing a purchase");
//             /**
//              * @typedef {Object} ItemToRemove
//              * @property {string} date
//              * @property {string} name
//              */
//             /** @type ItemToRemove */
//             const item = req.body;
//         } catch (err) {

//         }
//     });
// })

export default route;
