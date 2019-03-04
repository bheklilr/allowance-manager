import {
    Router
} from 'express';

export default function buildApiRouter(client) {
    var router = Router();

    router.get('/api', function (req, res) {
        res.json({});
    });

    router.get("/api/history", function (req, res) {
        const username = req.cookies['username']
        client.query("SELECT date, name, amount FROM history WHERE user = $1::text", [username])
    });

    return router;
}