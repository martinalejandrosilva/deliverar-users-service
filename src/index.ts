import express, { Application } from "express";
import morgan from "morgan";
import router from "./Routes";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/dbConnection";
const cors = require("cors");
import session from "express-session";
import passport from "passport";
import "./Services/passportSetup";

const PORT = process.env.PORT ?? 8000;

const app: Application = express();
app.use(cors());
//Connect to Database.
connectDB();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
//Yo me suscribo a la cola de usuarios ahi me van a llegar todos los topics relevantes.
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(
  session({
    secret: "random_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
