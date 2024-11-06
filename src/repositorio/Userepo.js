import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUDS } from "../config.js";
import prisma from '../conexionDb.js';



export default class UserRepo{
    constructor(){

    }
    async registrar(req,res){
        try{
            const {username,password,email,role} = req.body
            const validacionUser = new Validaciones(username,3);
            validacionUser.validar();
            
            const validacionPassword = new Validaciones(password,6);
            validacionPassword.validar();
            
            const validacionCorreo = new Validaciones(email,8);
            validacionCorreo.validar();

            const validacionRol = new Validaciones(role,4);
            validacionRol.validar();

            const user = await prisma.usuarios.findUnique({
                where: { username }
            });

            if (user){
                 throw new Error("El usuario ya existe")
            };

            const id =  crypto.randomUUID();

            // encriptar la contraseña 
            const hashPassword = await bcrypt.hash(password,SALT_ROUDS) // hashsync bloquea el hilo principal

            await prisma.usuarios.create({
                data:{
                    id:id,
                    username:username,
                    email: email,
                    password: hashPassword,
                    role:role
               }
            });

            res.json({ id });

            }catch(error){
                res.status(400).json({error: error.message});
            }
        }
    async login(){
        try{
            const {username,password,email,role} = req.body
            const validacionUser = new Validaciones(username,3);
            validacionUser.validar();
            
            const validacionPassword = new Validaciones(password,6);
            validacionPassword.validar();
            
            const validacionCorreo = new Validaciones(email,8);
            validacionCorreo.validar();

            const validacionRole = new Validaciones(role,4);
            validacionRole.validar();
    
            const user = await prisma.usuarios.findUnique({
                where: { username }
            });
            const token = 1234
            if (user){
                res.status(201).json({token})
            }
            else{
                res.status(400).json(`eRROR CHAVAL`)
            }

        }catch{
            res.status(400).json({error: error.message});
        }
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