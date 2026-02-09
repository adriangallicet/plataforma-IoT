import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/authentication.js'

router.get("/verify", checkAuth, async (req,res) => {
 
  res.json({
    status: 'success',
    userData: req.userData
  })
});

// 🔐 LOGOUT
// Sobre checkAuth en logout
//  Está bien usarlo, por dos motivos:
// 1.	Si no hay cookie → igual ya está deslogueado
// 2.	Evita que alguien spamee logout sin sesión

router.post('/logout', checkAuth, (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    sameSite: 'none', // debe ser igual que en login
    secure: true,     // debe ser igual que en login
    path: '/'
  })

  return res.json({ status: 'success' })
})




export default router;