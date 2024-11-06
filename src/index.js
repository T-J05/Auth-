import express from "express";
import { PORT } from "./config.js";
import UserRepo from "./repositorio/Userepo.js";
const repo = new UserRepo();
const app = express();
app.set('view engine','ejs')
app.use(express.json())
// app.use(cookieParser())

app.get('/', (req,res) => {
    res.render('inicio',{username: "Jose"})
})
app.post("/registrar",repo.registrar);


app.post("/login",repo.login);

app.post("/logout",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
});


app.get("/vertodo",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
});




app.patch("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})

app.delete("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})

app.put("/",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
})




app.listen(PORT,"localhost",() =>{
    console.log(`Servidor corriendo en el puerto 3000`)
})