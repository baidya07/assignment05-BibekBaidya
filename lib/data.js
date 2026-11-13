export const workouts = [
    {
        id: 1,
        name: 'Bench press',
        durationMinutes: 10,
        muscleGroup: 'push',
        email: 'bob@gmail.com'
    },
    {
        id: 2,
        name: 'Pull Ups',
        durationMinutes: 10,
        muscleGroup: 'pull',
        email: 'costa@example.com'
    },
    {
        id: 3,
        name: 'Warmup Jog',
        durationMinutes: 15,
        muscleGroup: 'cardio',
        email: 'alex@example.com'
    },
    {
        id: 4,
        name: 'Squats',
        durationMinutes: 20,
        muscleGroup: 'legs',
        email: 'sam@outlook.com'
    },
    {
        id: 5,
        name: 'Deadlift',
        durationMinutes: 20,
        muscleGroup: 'pull / back',
        email: 'jordan@yahoo.com'
    },
    {
        id: 6,
        name: 'Shoulder press',
        durationMinutes: 10,
        muscleGroup: 'push / shoulder',
        email: 'taylor@swift.com'
    }

];

let currentID = workouts.length;

export function nextId(){
    currentID += 1;
}

