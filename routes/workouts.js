import {Router} from 'express';
import { workouts, nextId } from '../lib/data.js';
import { validateWorkoutQuery, validateWorkoutBody } from '../lib/validate.js';

const router = Router();

router.get('/', (req, res) => {
    const {errors, parsed} = validateWorkoutQuery(req.query);

    if(errors.length > 0){
        return res.status(400).json({ errors });
    }

    let filtered = workouts;

    if(parsed.q){
        filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(parsed.q));
    }

    if(parsed.min != undefined){
        filtered = filtered.filter((item) => item.durationMinutes >= parsed.min);
    }

    if (parsed.max !== undefined) {
    filtered = filtered.filter((item) => item.durationMinutes <= parsed.max);
  }

  const count = filtered.length;
  const results = filtered.slice(0, parsed.limit);

  res.json({
    count,
    results
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

        res.json({
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

// POST /workouts — validate form data and create a new workout
router.post('/', (req, res) => {
  const { errors, item } = validateWorkoutBody(req.body ?? {});

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const newWorkout = {
    id: nextId(),
    ...item
  };

  workouts.push(newWorkout);
  res.status(201).json(newWorkout);
});

export default router;

