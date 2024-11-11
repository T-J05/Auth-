import prisma from '../conexionDb.js';
import rateLimit from 'express-rate-limit';

export const blacklist = new Set();

export default class Common{
    constructor(){

    };

    async vertodo(req, res){
        try{
            const users = await prisma.usuarios.findMany()
            res.json({users})
        }catch(err){
            res.status(401).json({err: err.message,error: "Error al obtener los users"})
        }
    };

    limiteIntentos = rateLimit({
        windowMs: 15 * 60 * 1000, //15 minutos
        max: 5, // 5 intentos
        message: "Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.",
      });

    agregarTokenBlackList(token) {
        blacklist.add(token);
    }

    esTokenBlackListed(token) {
        return blacklist.has(token);
    }
     
    logout= (req,res)=> {
        const typeLogin = req.params.sesion
        const tokken = req.userT
        const common = new Common();
        console.log(typeLogin)
        for (const elemento of blacklist) {
            console.log({tokenplaga: elemento});
        }
        try{
            if(typeLogin && typeLogin === 'token'){
                common.agregarTokenBlackList(tokken)
                if(req.Csrf){
                    const tokenCsrf = req.Csrf
                    common.agregarTokenBlackList(tokenCsrf)
                    if (common.esTokenBlackListed(tokenCsrf)&& this.esTokenBlackListed(tokken)){
                        console.log({tokenCsrf: tokenCsrf,tokken: tokken},'Puestos en lista negra ')
                    }
                   
                    res.json({tokenCsrf: tokenCsrf,tokken: tokken},'Puestos en lista negra ')
                }
                
            }
            else if(typeLogin && typeLogin === 'cookies'){

                if(req.Csrf){
                    const tokenCsrf = req.Csrf
                    this.agregarTokenBlackList(tokenCsrf)
                    console.log({tokenCsrf: tokenCsrf},'Puestos en lista negra ')
                    res.status(201).json({tokenCsrf: tokenCsrf},'Puestos en lista negra ')
                }
                    req.session.destroy((err) => {  
                        if (err) {
                            return res.status(500).json({ message: "Error al destruir la sesión" });
                        }
                        res.clearCookie("connect.sid"); 
                        res.status(200).json({ message: "Logout exitoso" })
                    });
            }
        }catch(error){
           res.status(444).json({error:"Error lastimosamente",error:error.message})
        }
    }
    
    

};