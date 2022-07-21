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

  // Loads all the exercise group data and its associated exercises
  async loadExerciseGroup(groupId) {
    let EXERCISE_GROUP = `SELECT * FROM exercise_groups WHERE id = $1 AND username = $2`;
    let EXERCISES = `SELECT * from exercises WHERE exercise_group_id = $1 AND username = $2`;
    let exercise_group = dbQuery(EXERCISE_GROUP, groupId, this.username);
    let exercises = dbQuery(EXERCISES, groupId, this.username);
    let resultBoth = await Promise.all([exercise_group, exercises]);
    if (resultBoth[0].rowCount < 1) return undefined;
    
    resultBoth[0].rows[0].exercises = resultBoth[1].rows;
    return resultBoth[0].rows;
  }

  // Creates exercise group
  async createExerciseGroup(exerciseGroup) {
    let EXERCISE_GROUP = `INSERT INTO exercise_groups (exercise_group_name, username)
      VALUES ($1, $2)`;
    let result = await dbQuery(EXERCISE_GROUP, exerciseGroup, this.username);
    return result.rowCount > 0;
  }
}

module.exports = PgPersistence;