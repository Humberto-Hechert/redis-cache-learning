import express from 'express';
import axios from 'axios';
import client from './redisClient.js';

const app = express();
app.use(express.json());

const PORT = 3007;

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const data = await client.get(`post:${id}`);

        if (data) {
            console.log("Retorno do cache");
            return res.json(JSON.parse(data));
        } else {
            console.log("Retorno direto da API");
            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const postData = response.data;

            // Armazena no cache com TTL de 60 segundos
            await client.setEx(`post:${id}`, 60, JSON.stringify(postData));

            return res.json(postData);
        }
    } catch (error) {
        console.error("Erro:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

const startServer = async () => {
    try {
        await client.connect();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao conectar ao Redis:", error);
    }
};

startServer();