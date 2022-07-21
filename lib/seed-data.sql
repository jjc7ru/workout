INSERT INTO exercise_groups (exercise_group_name, username)
  VALUES ('Full Body Dumbbell Workout Day 1', 'admin'),
         ('Full Body Dumbbell Workout Day 2', 'admin'),
         ('Full Body Dumbbell Workout Day 3', 'admin');

INSERT INTO exercises (exercise_name, sets, reps, exercise_group_id, username)
  VALUES ('Dumbbell Squat', 3, 10, 1, 'admin'),
         ('Dumbbell Stiff Legged Deadlift', 3, 10, 1, 'admin'),
         ('Bent Over Dumbbell Row', 3, 10, 1, 'admin'),
         ('Dumbbell Bench Press', 3, 10, 1, 'admin'),
         ('Lateral Raises', 2, 8, 1, 'admin'),
         ('Standing Dumbbell Curl', 2, 8, 1, 'admin'),
         ('Lying Dumbbell Extension', 2, 8, 1, 'admin'),
         ('Dumbbell Lunge', 3, 10, 2, 'admin'),
         ('Dumbbell Hamstring Curl', 3, 10, 2, 'admin'),
         ('Dumbbell Deadlift', 3, 10, 2, 'admin'),
         ('Dumbbell Military Press', 3, 10, 2, 'admin'),
         ('Dumbbell Flys', 2, 8, 2, 'admin'),
         ('Hammer Curl', 2, 8, 2, 'admin'),
         ('Seated Dumbbell Extension', 2, 8, 2, 'admin'),
         ('Dumbbell Step Up', 3, 10, 3, 'admin'),
         ('Dumbbell Stiff Legged Deadlift', 3, 10, 3, 'admin'),
         ('One Arm Dumbbell Row', 3, 10, 3, 'admin'),
         ('Reverse Grip Dumbbell Press', 3, 10, 3, 'admin'),
         ('Dumbbell Rear Delt Fly', 2, 8, 3, 'admin'),
         ('Zottman Curl', 2, 8, 3, 'admin'),
         ('Close Grip Dumbbell Press', 2, 8, 3, 'admin');
