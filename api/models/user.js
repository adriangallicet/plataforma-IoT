import mongoose from 'mongoose';
import UniqueValidator from 'mongoose-unique-validator';//nos evita tener valores duplicados en bd, en este caso, lo utilizaremos para los email

const Schema = mongoose.Schema; //establecemos la estructura, que campos y que tipo de dato.(seguridad, validacion,evitar datos erroneos, posible ataque q rompa la bd,etc)

const userSchema = new Schema({
  name: { type: String, required: [true] },
  email: { type: String, required: [true], unique: true},
  password: {  type: String, required: [true]},
});


//Validator
userSchema.plugin(UniqueValidator, { message: 'Error, email already exists.'});


// convert to model
const User = mongoose.model('User', userSchema);

export default User; //exportamos para que los demas archivos puedan utiluizarlo, puntualmente lo utilizaremos en el archivo users