import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';
import Common from './common.js';
import { blacklist } from './common.js';

const common = new Common();

export default class Auth {
    constructor() {}

    verificarToken(token) {
       
        try {
            console.log(token)
            const ListaNegra = common.esTokenBlackListed(token)
            
            if(ListaNegra){
                throw Error("token en la lista negra")
            }
            const tokenv = jwt.verify(token, SECRET_KEY);
            console.log({tokenv:tokenv})
            return tokenv;
        } catch (error) {
            throw error;  
        }
    }

    autorizacion(rolRequerido) {
        return (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1]; 
            const listb = common.esTokenBlackListed(token)

            if (token && !listb) {
                try {
                    const decoded = jwt.verify(token, SECRET_KEY);
                    if (common.esTokenBlackListed(token)){
                        res.send('Token en lista negra')
                    }
                    if (decoded && decoded.role === rolRequerido) {
                        
                        req.decoded = decoded
                        return next();
                    } else {
                        return res.status(403).json({ message: 'Acceso denegado: Rol no correspondiente' });
                    }
                } catch (error) {
                    console.log('Token inválido o expirado:', error.message);
                    return res.status(401).json({ message: 'Token inválido o expirado' });
                }
            }

            else if (req.session && req.session.username && req.session.role === rolRequerido) {

                console.log("Acceso mediante sesion")
                return next();
            }
            
            res.status(401).json({ message: 'Acceso denegado' });
        };
    }
    
    verificarCsrf(req,res,next){
        const typeLogin = req.params.sesion
        const token = req.headers.authorization?.split(' ')[1];
  
        const csrfTokenCliente = req.headers['csrf-token'];

        req.Csrf = csrfTokenCliente
        if(common.esTokenBlackListed(csrfTokenCliente)){
            return res.status(401).json({'token en lista negra': csrfTokenCliente})
        }
        try{
            if(typeLogin && typeLogin === 'token'){

                const ListaNegra = common.esTokenBlackListed(token)
            
                if(ListaNegra){
                    throw Error("token en la lista negra")
                 }
                const verficadoToken = jwt.verify(token, SECRET_KEY)
                // console.log(verficadoToken.csrfToken)
                if (verficadoToken && verficadoToken.csrfToken === csrfTokenCliente){
                    req.userT = token

                    console.log({verficado: verficadoToken.username});
                    return next();
                }
                else{
                    res.status(401).json({error: "Token CSRF invalido o inexistente capo"});
                };
                    
            }
            else if(typeLogin && typeLogin === 'cookies'){
                console.log({ csrfToken: req.session.csrfToken });
                if (req.session && req.session.csrfToken === csrfTokenCliente) {
                    console.log({ csrfToken: req.session.csrfToken });
                    return next();
                } else {
                    res.status(400).json({ message: 'Token CSRF no encontrado en la sesión' });
                };
        };
        }catch(error){
            res.status(401).json({error: error.message, msg: 'Error al verificar Token CSRF'})
        }
        
    }
}
