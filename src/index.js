import express from "express";
import { PORT,SESSION_KEY } from "./config.js";
import UserRepo from "./repositorio/Userepo.js";
import https from "https";
import fs from "fs"
import cookieParser from "cookie-parser";

const app = express();
const repo = new UserRepo();

// Carga los archivos de clave y certificado
const options = {
    key: fs.readFileSync('/home/penguin/Escritorio/penguin/Auth/src/server.key'),
    cert: fs.readFileSync('/home/penguin/Escritorio/penguin/Auth/src/server.cert'),
  };

app.set('view engine','ejs')
app.use(express.json())
app.use(cookieParser())
app.use(
    session({
      secret: SESSION_KEY, 
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,  
        secure: true,   
        maxAge: 24 * 60 * 60 * 1000,  //24 horas,
        sameSite: 'lax'
      },
    })
  );


app.get('/', (req,res) => {
    res.render('inicio',{username: "Jose"})
})
app.post("/registrar",repo.registrar);
app.post("/login/:sesion",repo.login);




app.post("/logout",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
});


app.get("/vertodo",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
});




// Crea el servidor HTTPS y escucha en el puerto 443 (puerto HTTPS estándar)
https.createServer(options, app).listen(PORT, () => {
    console.log('Servidor HTTPS en ejecución en https://localhost');
  });