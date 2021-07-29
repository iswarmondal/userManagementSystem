const express=require("express")
const hbs=require("hbs")
const mysql=require("mysql")
const path=require("path")

require("dotenv").config()

// port setup
const app=express()
const port=process.env.PORT||8000;

// defining the paths
const viewsPath=path.join(__dirname,"./views")

// setting up the middlewares
// setting up the bodyparser
// app.use(express.urlencoded({extended: false}))
// app.use(express.json())

// setting up the static files
app.use(express.static("public"))

// settinup the templating engine
app.set("view engine","hbs")
app.set("views",viewsPath)

// creating pool
const pool=mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});

// db connection


// routes
app.route("/")
    .get((req,res) =>
    {
        pool.getConnection((err,connection) =>
        {
            if(err)
            {
                console.log(err);
            }
            console.log(`connection id is ${connection.threadId}`);

            // querry the data
            connection.query("SELECT * FROM user",(err,data) =>
            {

                connection.release()

                if(!err)
                {
                    console.log(data);
                    res.render('index',{data})
                }
                else
                {
                    console.log(err);
                }
            })

        })
    })

app.listen(port,() =>
{
    console.log(`server is online on the port ${port}`);
})