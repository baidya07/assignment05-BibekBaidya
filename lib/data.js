export const workouts = [
    {
        id: 1,
        name: 'Bench press',
        durationMinutes: 10,
        muscleGroup: 'push'
    },
    {
        id: 2,
        name: 'Pull Ups',
        durationMinutes: 10,
        muscleGroup: 'pull'
    },
    {
        id: 3,
        name: 'Warmup Jog',
        durationMinutes: 15,
        muscleGroup: 'cardio'
    },
    {
        id: 4,
        name: 'Squats',
        durationMinutes: 20,
        muscleGroup: 'legs'
    },
    {
        id: 5,
        name: 'Deadlift',
        durationMinutes: 20,
        muscleGroup: 'pull / back'
    },
    {
        id: 6,
        name: 'Shoulder press',
        durationMinutes: 10,
        muscleGroup: 'push / shoulder'
    }

];

let currentID = workouts.length;

export function nextId(){
    currentID += 1;
}

