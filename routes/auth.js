"use strict";


const Router = require("express").Router;
const router = new Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const { BadRequestError } = require('../expressError');


/** POST /login: {username, password} => {token} */
router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;
  const isAuthenticated = await User.authenticate(username, password);
  // fail fast
  if (isAuthenticated === true) { // not equal true
    const token = jwt.sign({ username }, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({ token });
  }
  throw new BadRequestError("Invalid Username or Password");
})


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post('/register', async function (req, res, next) {
  const { username, password, first_name, last_name, phone } = req.body;
  const user = await User.register({ username, password, first_name, last_name, phone });

  if (user) { // fail fast
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }
  throw new BadRequestError("Invalid registration information");
})

module.exports = router;