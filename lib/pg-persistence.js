const dbQuery = require("./db-query");

class PgPersistence {
  constructor(session) {
    this.username = session.username;
  }

  // Loads all the exercise group data
  async loadAllExerciseGroups() {
    let EXERCISE_GROUPS = `SELECT * FROM exercise_groups WHERE username = $1`;
    let result = await dbQuery(EXERCISE_GROUPS, this.username);
    if (result.rowCount < 1) return undefined;
    return result.rows;
  }

  // Load "Exercise Group"
  async loadExerciseGroup(groupId) {
    let EXERCISE_GROUP = `SELECT * FROM exercise_groups WHERE id = $1 AND username = $2`;
    let exercise_group = await dbQuery(EXERCISE_GROUP, groupId, this.username);
    if (exercise_group.rowCount < 1) return undefined;
    return exercise_group.rows[0];
  }

  // Loads all "Exercise Groups" data and its associated "Exercises"
  async loadGroupAndExercises(groupId) {
    let EXERCISE_GROUP = `SELECT * FROM exercise_groups WHERE id = $1 AND username = $2`;
    let EXERCISES = `SELECT * from exercises WHERE exercise_group_id = $1 AND username = $2`;
    let exercise_group = dbQuery(EXERCISE_GROUP, groupId, this.username);
    let exercises = dbQuery(EXERCISES, groupId, this.username);
    let resultBoth = await Promise.all([exercise_group, exercises]);
    if (resultBoth[0].rowCount < 1) return undefined;
    
    resultBoth[0].rows[0].exercises = resultBoth[1].rows;
    return resultBoth[0].rows[0];
  }

  // Load "Exercise" and its associated "User Exercises"
  async loadExercise(exerciseId) {
    let EXERCISE = `SELECT * FROM exercises WHERE id = $1 AND username = $2`;
    let USER_EXERCISES = `SELECT * FROM user_exercises WHERE exercise_id = $1 AND username = $2`;
    let exercises = dbQuery(EXERCISE, exerciseId, this.username);
    let userExercises = dbQuery(USER_EXERCISES, exerciseId, this.username);
    let resultBoth = await Promise.all([exercises, userExercises]);

    resultBoth[0].rows[0].user_exercises = resultBoth[1].rows;
    return resultBoth[0].rows[0];
  };

  // Load "Exercises and its latest associated "User Exercises"
  async loadExerciseLatestExercisedDate(exerciseId, today) {
    let EXERCISE = `SELECT * FROM exercises WHERE id = $1 and username = $2`;
    let LATEST_DATE = `
      SELECT * 
      FROM user_exercises 
      WHERE exercise_id = $1 AND exercise_date != $2 AND username = $3
      ORDER BY exercise_date DESC
      LIMIT 1`;
    let USER_EXERCISES = `
      SELECT * 
      FROM user_exercises 
      WHERE exercise_id = $1 AND exercise_date = $2 AND username = $3`;

    let exercise = await dbQuery(EXERCISE, exerciseId, this.username);
    let date = await dbQuery(LATEST_DATE, exerciseId, today, this.username);
    if (exercise.rowCount < 1) return undefined;

    if (date.rowCount < 1) {
      exercise.rows[0].user_exercises = [];
    } else {
      let user_exercises = await dbQuery(USER_EXERCISES, exerciseId, date.rows[0].exercise_date, this.username);
      exercise.rows[0].user_exercises = user_exercises.rows;
    }
    return exercise.rows[0];
  };

  // Load today's user exercise
  async loadUserExerciseToday(exerciseId, date) {
    let TODAY = `SELECT * FROM user_exercises WHERE exercise_date = $1 AND exercise_id = $2 AND username = $3`;
    let result = await dbQuery(TODAY, date, exerciseId, this.username);
    if (!result) return undefined;
    return result.rows;
  }

  // Creates exercise group
  async createExerciseGroup(exerciseGroup) {
    let EXERCISE_GROUP = `INSERT INTO exercise_groups (exercise_group_name, username)
      VALUES ($1, $2)`;
    let result = await dbQuery(EXERCISE_GROUP, exerciseGroup, this.username);
    return result.rowCount > 0;
  }

  // Creates an exercise
  async createExercise(exercise_name, sets, reps, exercise_group_id) {
    let EXERCISE = `INSERT INTO exercises (exercise_name, sets, reps, exercise_group_id, username)
      VALUES ($1, $2, $3, $4, $5)`;
    let result = await dbQuery(EXERCISE, exercise_name, sets, reps, exercise_group_id, this.username);
    return result.rowCount > 0;
  }

  // Creates user exercise
  async createUserExercise(set, reps, weight, exercise_date, exercise_id) {
    let EXERCISE = `INSERT INTO user_exercises (set, reps, weight, exercise_date, exercise_id, username)
      VALUES ($1, $2, $3, $4, $5, $6)`;
    let result = await dbQuery(EXERCISE, set, reps, weight, exercise_date, exercise_id, this.username);
    return result.rowCount > 0;
  }

  // Destroy group
  async deleteGroup(groupId) {
    let GROUP = `DELETE FROM exercise_groups WHERE id = $1 AND username = $2`;
    let result = await dbQuery(GROUP, groupId, this.username);
    return result.rowCount > 0;
  }

  // Edit group
  async editGroup(name, groupId) {
    let GROUP = `UPDATE exercise_groups 
      SET exercise_group_name = $1
      WHERE id = $2 AND username = $3`;
    let result = await dbQuery(GROUP, name, groupId, this.username);
    return result.rowCount > 0;
  }

  // Edit exercise name
  async editExerciseName(name, exerciseId) {
    let EXERCISE = `UPDATE exercises
      SET exercise_name = $1
      WHERE id = $2`;
    let exercise = await dbQuery(EXERCISE, name, exerciseId);
    return exercise.rowCount > 0;
  }

  // Edit exercise sets
  async editExerciseSets(sets, exerciseId) {
    let EXERCISE = `UPDATE exercises
      SET sets = $1
      WHERE id = $2`;
    let exercise = await dbQuery(EXERCISE, sets, exerciseId);
    return exercise.rowCount > 0;
  }
  // Edit exercise reps
  async editExerciseName(reps, exerciseId) {
    let EXERCISE = `UPDATE exercises
      SET reps = $1
      WHERE id = $2`;
    let exercise = await dbQuery(EXERCISE, reps, exerciseId);
    return exercise.rowCount > 0;
  }
}

module.exports = PgPersistence;