// backend/src/controllers/authController.js
import { User, ROLES } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const signup = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({
      name,
      email,
      address,
      password: await hashPassword(password),
      role: ROLES.USER
    });

    return res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    return res.status(500).json({ message: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  console.log("Inside login controller");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await comparePassword(password, user.password);
    console.log("Plain password:", password);
    console.log("Stored hash:", user.password);
    console.log("Compare result:", ok);


    const token = signToken({ id: user.id, role: user.role });
    return res.json({
      token,
      user: { id: user.id, role: user.role, name: user.name, email: user.email }
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const updatePassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    user.password = await hashPassword(password);
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (e) {
    return res.status(500).json({ message: 'Update failed' });
  }
};
