import express from "express";
import { PORT,SESSION_KEY } from "./config.js";
import UserRepo from "./repositorio/Userepo.js";
import https from "https";
import fs from "fs"
import  Auth  from "./repositorio/validacion.js";
import Common from "./repositorio/common.js";
import session from "express-session";



const auth = new Auth();
const common = new Common();
const repo = new UserRepo();

const app = express();

const options = {
    // key: fs.readFileSync('/home/penguin/Escritorio/penguin/Auth/src/server.key'),
    // cert: fs.readFileSync('/home/penguin/Escritorio/penguin/Auth/src/server.cert'),
    key: fs.readFileSync('C:/Users/Usuario/Desktop/js/AuthT-J/Auth-/src/server.key'),
    cert: fs.readFileSync('C:/Users/Usuario/Desktop/js/AuthT-J/Auth-/src/server.cert'),
  };

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: SESSION_KEY, 
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,  
        secure: true,   
        maxAge: 24 * 60 * 60 * 1000,  //24 horas
        sameSite: 'lax'
      },
    })
  );


app.get('/', (req,res) => {
    res.render('inicio',{username: "Jose"})
})

app.post("/registrar",repo.registrar);
//cookies o token kp hina
app.post("/login/:sesion",repo.login);

app.get("/user",auth.autorizacion('user'), (req,res)=>{
    res.json("Buenas tardes User")
})

app.get("/admin",auth.autorizacion("admin"),common.vertodo);


//cookies o token kp hina
app.post("/logout/:sesion",auth.verificarCsrf,common.logout);





// Crea el servidor HTTPS y escucha en el puerto 443 (puerto HTTPS estándar)
https.createServer(options, app).listen(PORT, () => {
    console.log('Servidor HTTPS en ejecución en https://localhost');
  });