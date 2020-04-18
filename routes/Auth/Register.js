import * as express from 'express';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { validate } from ('../../../middleware/validator');
import { body } from 'express-validator';

const router = express.Router();

/**
 * Register Validation Rules
 */
const registerInputRules = () => {
  return [
    body("first_name").isAlpha().isLength({ min: 2 }).trim().escape(),
    body("last_name").isAlpha().isLength({ min: 2 }).trim().escape(),
    body("email", "Invalid email address")
      .isEmail()
      .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),
    body("password", "Your password must be at least 6 characters long")
      .isLength({ min: 6 })
      .trim()
      .escape(),
  ];
};

router.post("/", registerInputRules(), validate, async (req, res) => {
  const User = getConnection('default').getRepository("User");
  const { first_name, last_name, email, password } = req.body;

  // Does a user with this email already exist?
  const exists = await User.findOne({ email });
  if (exists) {
    return res
      .status(409)
      .send({ error: "A user with this email address already exists." });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create User
  const newUser = await User.save({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  // Return User
  const user = await User.findOne(newUser.id);
  if (!user) {
    return res.status(500).send({ error: "A new user could not be created." });
  }

  res.send({ user });
});

module.exports = router;
