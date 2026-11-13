import {Router} from 'express';
import { workouts } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        count: workouts.length,
        results: workouts
    });
});

router.get('/stats', (req, res) => {
    const count = workouts.length;

    const totalMinutes = workouts.reduce(
        (sum, item) => sum + item.durationMinutes,
        0
    );

    const averageDurationMinutes = 
        count === 0 ? 0 : Math.round((totalMinutes / count) * 10) / 10;

        const byMuscleGroup = workouts.reduce((acc, item) => {
            acc[item.muscleGroup] = (acc[item.muscleGroup] || 0) + 1;
            return acc;
        }, {});

        req.json({
            count,
            averageDurationMinutes,
            byMuscleGroup
        });
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const workout = workouts.find((item) => item.id === id);
    
    if(!workout){
        return res.status(404).json({
            error: `Workout ${req.params.id} not found`
        });
    }

    res.json(workout);
});

export default router;

