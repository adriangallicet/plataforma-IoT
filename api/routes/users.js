
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
import User from '../models/user.js';

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
//como utilizamos axios en el front, dicha libreria estructura de manera tal que los datos
//vienen POST->req.body y GET->req.query
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario
    const user = await User.findOne({ email }); //metodo de mongoose y usamos el modelo User creado, buscamos el usuario que coincida con el mail introducido desde el front
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid credentials'
      });
    }

    // 2️⃣ Validar password
    const isValid = bcrypt.compareSync(password, user.password); //compara el hash guardado en bd con hash de la contrasenia ingresada por el usuario
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid credentials'
      });
    }

    // 3️⃣ Eliminar password antes de firmar
    user.set('password', undefined, { strict: false }); //eliminamos el campo password de user, antes de poner dichos datos para armar el token, seria error de seguridad

    // 4️⃣ Firmar JWT
    const token = jwt.sign(
      { userData: user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // 5️⃣ Setear cookie
      res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'none',   // importante
      secure: true,     // true solo en https
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 // 1 día
      });

// 6️⃣ Responder SIN token
return res.json({
  status: 'success',
  userData: user
});



  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: 'Login failed'
    });
  }

  
});

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
router.post('/register', async (req, res) => {
  try { //usamos trycatch para que no se detenga la ejecucion del programa ante un error, por ejemplo. si se intenta registrar con mismo mail
    const { name, email, password } = req.body;

    const encryptedPassword = bcrypt.hashSync(password, 10); //cuantas veces hash la pass

    const newUser = { //tipo de modelo que planteamos en models/user
      name,
      email,
      password: encryptedPassword
    };

    await User.create(newUser); //creamos el usuario en la bd mediante el modelo user creado

    return res.json({
      status: 'success'
    });

  } catch (error) {
    return res.status(500).json({ //status indica el tipo de respuesta
      status: 'error',
      error
    });
  }
});

export default router;
