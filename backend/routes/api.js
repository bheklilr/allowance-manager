import {
    Router
} from 'express';

const HISTORY_QUERY = "SELECT date, name as purchaseName, amount as purchaseAmount FROM history WHERE user = $1::text";

export default function buildApiRouter(client) {
    var router = Router();

    router.get('/api', function (req, res) {
        res.json({});
    });

    router.get("/api/history", function (req, res) {
        const username = req.cookies['username']
        client.query(HISTORY_QUERY, [username], (err, response) => {
            if (!err) {
                res.json(response.rows.map());
            }
        })
    });

    return router;
}