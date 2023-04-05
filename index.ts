import express from 'express';

const app = express();

interface Game {
    id: string;
    gameName: string;
    missionName: string;
    gameVer: string;
    numPlayers: number;
    maxPlayers: number;
    host: string;
    port: number;
    lastUpdate: number;
}

let games:Game[] = [];

app.post('/new_game', (req, res) => {
    const game:Game = req.body;
    game.host = req.ip;
    game.port = game.port || 12987;
    game.lastUpdate = Date.now();
    games.push(req.body);
});

app.post('/update_game', (req, res) => {
    const update: Game = req.body;
    const game = games.find(g => g.id === update.id);
    if (game) {
        game.gameName = update.gameName;
        game.missionName = update.missionName;
        game.gameVer = update.gameVer;
        game.numPlayers = update.numPlayers;
        game.maxPlayers = update.maxPlayers;
        game.lastUpdate = Date.now();
    }
});

app.get('/list_games', (req, res) => {
    res.send(games);
});

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

setInterval(() => {
    const now = Date.now();
    games = games.filter(g => now - g.lastUpdate < 10 * 60 * 1000);
}, 10000);