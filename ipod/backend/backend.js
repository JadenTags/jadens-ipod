import express from 'express';
import cors from 'cors';
import axios from 'axios';
import config from './config.js';
import consts from '../src/const.js';

const app = express();
const port = 5050;
var auth;

app.use(express.json());
app.use(cors());

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    return result;
}

app.post('/refresh', async (req, res) => {
    try {
        const response = await axios.post(`https://accounts.spotify.com/api/token`, {
            'grant_type': 'refresh_token',
            'refresh_token': req.body.refresh_token
        }, {
            headers: {
                'Authorization': `Basic ${btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET)}`,
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        res.send(response.data);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/login', async (req, res) => {
    try {
        const scopes = ['streaming', 'user-read-private', 'user-read-email', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state'];
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.CLIENT_ID,
            scope: scopes.join(' '),
            redirect_uri: `http://127.0.0.1:${port}/callback`,
            state: generateRandomString(16)
        });

        res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
    } catch (e) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/callback', async (req, res) => {
    console.log('Successful Login');
    
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: `http://127.0.0.1:${port}/callback`
        }, {
            headers: {
                'Authorization': `Basic ${btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET)}`,
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        auth = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
        }

        console.log('Successful Exchange');

        res.redirect(`${consts.FRONTEND_URL}/home`);
    } catch (e) {
        if (e.status == 400) {
            console.log('Expired Token... Logging In');
            return res.redirect('/login');
        }

        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/tokens', async (req, res) => {
    res.json({
        auth: auth
    });
});

app.get('*', async (req, res) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1${req.originalUrl}`, {
            headers: {
                'Authorization': req.headers['authorization']
            }
        })

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});