"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require('../models/user');


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', async function (req, res, next){
  if (res.locals.user === undefined) {
    throw new UnauthorizedError("Please login to see users");
  }
  const users = await User.all();

  return res.json({users});
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', async function (req, res, next){
  const username = res.locals.user.username;

  if(username !== req.params.username) {
    throw new UnauthorizedError("Only user can access their user data");
  }

  const user = await User.get(username);

  return res.json({user});
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', async function (req, res, next){
  const username = res.locals.user.username;

  if(username !== req.params.username) {
    throw new UnauthorizedError("Only user can access their to messages");
  }

  const messages = await User.messagesTo(username);

  return res.json({messages});
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', async function (req, res, next){
  const username = res.locals.user.username;

  if(username !== req.params.username) {
    throw new UnauthorizedError("Only user can access their from messages");
  }

  const messages = await User.messagesFrom(username);

  return res.json({messages});
});

module.exports = router;
