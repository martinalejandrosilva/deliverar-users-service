import express, { Application } from "express";
import morgan from "morgan";
import router from "./Routes";
import swaggerUi from "swagger-ui-express";


const PORT = process.env.PORT ?? 8000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});