"use strict";

const Router = require("express").Router;
const router = new Router();
const Message = require('../models/message');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', async function (req, res, next) {
  const username = res.locals.user.username;
  const message = await Message.get(req.params.id);

  if (username !== message.from_user.username && username !== message.to_user.username) {
    throw new UnauthorizedError("Unauthorized to see this message");
  }

  return res.json({ message });
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', async function (req, res, next) {
  const from_username = res.locals.user.username;

  const { to_username, body } = req.body;

  const message = await Message.create({ from_username, to_username, body });
  console.log("message created", message);

  return res.json({ message });
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async function (req, res, next) {
  const username = res.locals.user.username;

  const messageID = req.params.id;

  const message = await Message.get(messageID);
  if (username !== message.to_user.username) {
    throw new UnauthorizedError("Unauthorized to mark message as read");
  }

  const messageRead = await Message.markRead(messageID);

  return res.json({ message: messageRead });
});

module.exports = router;