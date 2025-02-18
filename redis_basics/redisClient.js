import redis from 'redis';

const client = redis.createClient({
    url: 'redis://localhost:6379' // Use a URL correta para o Redis
});

client.on('connect', () => {
    console.log("Redis connected");
});

client.on('error', (err) => {
    console.log("Redis connection error: ", err);
});

export default client;