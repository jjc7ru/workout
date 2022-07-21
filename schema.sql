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
