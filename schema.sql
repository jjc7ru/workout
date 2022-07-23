CREATE TABLE exercise_groups (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  exercise_group_name text NOT NULL,
  username text NOT NULL,
  UNIQUE(exercise_group_name, username)
);

CREATE TABLE exercises (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  exercise_name text NOT NULL,
  sets int CHECK (sets >= 0),
  reps int CHECK (reps >= 0),
  exercise_group_id int REFERENCES exercise_groups(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL
);

CREATE TABLE user_exercises (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  set int CHECK (set >=0),
  reps int CHECK (reps >= 0),
  weight int CHECK (weight >= 0),
  exercise_date date NOT NULL DEFAULT CURRENT_DATE,
  exercise_id int REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL
);
