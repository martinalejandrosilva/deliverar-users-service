"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const Routes_1 = __importDefault(require("./Routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dbConnection_1 = require("./config/dbConnection");
const cors = require("cors");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./Services/passportSetup");
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const app = (0, express_1.default)();
app.use(cors());
//Connect to Database.
(0, dbConnection_1.connectDB)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.static("public"));
//Yo me suscribo a la cola de usuarios ahi me van a llegar todos los topics relevantes.
app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
app.use((0, express_session_1.default)({
    secret: "random_secret_key",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(Routes_1.default);
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
