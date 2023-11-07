const express = require("express");
const con = require("./config");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "anand", resave: false, saveUninitialized: true }));
//To store user data after login
const dataStore = [];

//Routes
app.get("/home", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the protected page, ${req.session.user}`);
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Logout failed");
    } else {
      res.redirect("/");
    }
  });
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/Cart", (req, res) => {
  res.render("cart.ejs");
});
app.get("/Orders", (req, res) => {
  res.render("order.ejs");
});
app.get("/Product", (req, res) => {
  res.render("product.ejs");
});
app.get("/AboutUs", (req, res) => {
  res.render("aboutUS.ejs");
});
//End Routes

//login post api

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM user WHERE email = ?";
    con.query(sql, [email], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).redirect("/login");
      }

      if (rows.length === 0) {
        return res.status(401).redirect("/login");
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
//send data to database of that user
        // sql="insert into logdata (email) values(?);"
        con.query(sql,email,(err,result)=>{
          if(err){
            console.log(err);
          }
        })
        return res.status(200).redirect("/home");
      } else {
        return res.status(401).send("Invalid username or password");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed");
  }
});

//logout
app.use(
  session({
    secret: "anand",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
//end login post api

//register api

app.post("/register", async (req, resp) => {
  try {
    const { fname, lname, email, c_num, password } = req.body;
    const saltRounds = 10;
    const hashpassword = await bcrypt.hash(password, saltRounds);
    console.log(users);
    const sql =
      "INSERT INTO user (fname,lname, email,contact_no, password) VALUES (?,?, ?, ?, ?)";
    const values = [fname, lname, email, c_num, hashpassword];

    con.query(sql, values, (err, result) => {
      if (err) throw err;
      resp.redirect("/login");
    });
  } catch (error) {
    console.log(error);
    resp.redirect("/register");
  }
});

//end register api

//Home Page api

const result= app.get("/home", (req,res)=>{

  const sql="Select * from product where products=?";
  const data=req.body.search;
  return con.query(sql,data, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/product")
      return result;
      }
    })
})

//end home page api

//Products api
app.post("/product", (req,res,result)=>{

  // const sql="insert into cart ()";
  const {email, product_id, quantity}=req.body;
  const sql="select * from product where products=?"
  con.query(sql,result, (err,output)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/cart")
      res.send(output)
      }
    })
})

//end product api

//Order page api
//end order page api

//Cart api
app.get("/Cart", async (req, res) => {
  res.render("/cart");
});
//end cart api

app.listen(3000);
