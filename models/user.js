"use strict";

/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(
      password, BCRYPT_WORK_FACTOR);

    const result = db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    )
    return result.rows[0];

  }

  /** Authenticate: is username/password valid? Returns boolean.
   * TODO: what to do if password is entered incorrectly
   */

  static async authenticate(username, password) {
    const result = db.query(
      `SELECT password
          FROM users
          WHERE username = $1`,
      [username]);

    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user
   * TODO decide when to call this
   */

  static async updateLoginTimestamp(username) {
    db.query(`Update users
                SET last_login_at = (current_timestamp)
                WHERE user = $1`, [username]);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
  }
}


module.exports = User;