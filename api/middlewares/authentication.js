
import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
const token = req.cookies?.auth_token //se lee token desde cookies
  // 1️⃣ Token requerido
  if (!token) {
    return res.status(401).json({
      status: 'error' 
    });
  }

  try {

    // 2️⃣ Verificación con .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //valida la firma que se hizo en el endpoint /login
    
    // 3️⃣ Inyectamos userData en la request
    req.userData = decoded.userData;    //le agrega a la request que esta golpeando al endpoint userData, se obtiene del token. Es de utilidad del lado de la API para, por ejemplo
                                        //en base a dicha informacion, filtrar datos en BD, por ej. traer todos los dispositivos de dicho usuario.
        
    next(); //paso el req de nuevo. Por ej: a la funcion devices.js para que siga la ejecucion del get a /device
  } catch (err) {
    return res.status(401).json({
      status: 'error'
    });
  }
};

