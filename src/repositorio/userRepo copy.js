import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUDS } from "../config.js";
import prisma from '../conexionDB.js';



export class UserRepo{
    constructor(){

    }
    async crear(req,res){
        try{
            const {username,password,email} = req.body
            const validacionUser = new Validaciones(username,3);
            validacionUser.validar();
            
            const validacionPassword = new Validaciones(password,6);
            validacionPassword.validar();
            
            const validacionCorreo = new Validaciones(email,8);
            validacionCorreo.validar();
    
            // Asegurarse que el user no existe
            const user = prisma.Usuarios.findOne({username})

            if (user){
                 throw new Error("El usuario ya existe")
            }

            const id =  crypto.randomUUID()

            // encriptar la contraseña 
            const hashPassword = await bcrypt.hash(password,SALT_ROUDS) // hashsync bloquea el hilo principal
            prisma.Usuarios.create({
               data:{
                
               }
            }).save()

      return id

        }catch(error){
            res.send("Error",error.mesagge)
        }
    }
    static async create({username,password,email}) {
        const validacionUser = new Validaciones(username,3);
        validacionUser.validar();
        
        const validacionPassword = new Validaciones(password,6);
        validacionPassword.validar();
        
        const validacionCorreo = new Validaciones(email,8);
        validacionCorreo.validar();

      // Asegurarse que el user no existe
      const user = prisma.Users.findOne({username})
      if (user) throw new Error("El usuario ya existe")
    
      const id =  crypto.randomUUID()

      // encriptar la contraseña 
      const hashPassword = await bcrypt.hash(password,SALT_ROUDS) // hashsync bloquea el hilo principal
      prisma.Users.create({
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
        if (!this.parametro || this.parametro.trim() === ''){
            throw new Error({error: `El campo ${this.parametro} es obligatorio`})
        }

    }
}
