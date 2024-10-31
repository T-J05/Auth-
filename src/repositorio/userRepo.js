import DBLocal from "db-local"
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUDS } from "../config.js";


const { Schema } = new DBLocal({path: './db'})

const User = Schema('User',{
    _id:{type: String,require:true},
    username:{type: String,require:true},
    password:{type: String,require:true},
    password:{type: String,require:true}
})

export class UserRepo{
    
    static async create({username,password,email}) {
        const validacionUser = new Validaciones(username,3);
        validacionUser.validar();
        
        const validacionPassword = new Validaciones(password,6);
        validacionPassword.validar();
        
        const validacionCorreo = new Validaciones(email,8);
        validacionCorreo.validar();

      // Asegurarse que el user no existe
      const user = User.findOne({username})
      if (user) throw new Error("El usuario ya existe")
    
      const id =  crypto.randomUUID()

      // encriptar la contraseña 
      const hashPassword = await bcrypt.hash(password,SALT_ROUDS) // hashsync bloquea el hilo principal
      User.create({
        _id: id,
        username,
        password: hashPassword
      }).save()

      return id
    }
    static login({username, password,email}){

    }
}

class Validaciones{
    constructor(parametro,minLetter){
        this.parametro = parametro,
        this.minLetter = minLetter;
    }
    validar(){
        if(typeof this.parametro !== 'string'){
            throw new Error(`El ${this.parametro} debe de ser un string`)
        }
        if (this.parametro.length < this.minLetter){ 
            throw new Error(`El ${this.parametro} debe de tener al menos ${this.minLetter} letras`)
        }
    }
}
