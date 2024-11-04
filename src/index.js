import express from "express";
import { PORT } from "./config.js";
import { UserRepo } from "./repositorio/repoexample.js";

const app = express();
app.set('view engine','ejs')
app.use(express.json())
app.use(cookieParser())

app.get('/', (req,res) => {
    res.render('inicio',{username: "Jose"})
})
app.post("/registrar",async (req,res)=>{
    const {username,password,email} = req.body
    console.log(req.body)
    try{
        const id = await UserRepo.create({username,password,email})
        res.send({ id })
    }catch(error){
        // Normalmente no es buena idea mandar el error del repositorio
        res.status(400).send(error.message)
    }
});


app.post("/login",(req,res)=>{
    res.send("<h1>Hola mundo</h1>")
});

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