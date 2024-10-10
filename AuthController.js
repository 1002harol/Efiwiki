const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Esquema de usuario en MongoDB

// Controlador de inicio de sesión
const login = async (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en la base de datos
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Verifica la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Genera el token JWT
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET, // Asegúrate de usar una clave secreta segura
    { expiresIn: '8h' }
  );

  // Devuelve el token al frontend
  res.json({ token });
};

module.exports = { login };