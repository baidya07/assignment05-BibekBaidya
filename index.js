import express from 'express';
import workoutsRouter from './routes/workouts.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=> {
    res
        .type('text/plain')
        .send(
            'Workouts API\n\nEndpoints:\n GET /workouts\n- GET /workouts/stats\n- GET /workouts/:id\n- POST /workouts\n'
        );  
});

app.use('/workouts', workoutsRouter);

app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});