"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const alive_1 = __importDefault(require("../Controllers/alive"));
const user_1 = __importDefault(require("../Controllers/user"));
const auth_1 = __importDefault(require("../Controllers/auth"));
const UserService = require("../Services/UserService");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../Middleware/authMiddleware"));
const config = require("config");
const jwt = require("jsonwebtoken");
const passport_1 = __importDefault(require("passport"));
const supplier_1 = __importDefault(require("../Controllers/supplier"));
const router = express_1.default.Router();
const { validateRegister, validateLogin, validateSupplierLogin, validateSupplierRegister, validateSupplierUpdate, } = require("../Validation/userValidation");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get("/api/alive", (_req, res) => {
    const controller = new alive_1.default();
    controller.alive().then((response) => {
        res.send(response);
    });
});
router.post("/api/user", validateRegister, (_req, res) => {
    const errors = (0, express_validator_1.validationResult)(_req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const controller = new user_1.default();
    const { name, email, dni, address, phone, password } = _req.body;
    controller
        .register({ name, email, dni, address, phone, password })
        .then((response) => {
        res.status(response.code).send(response.payload);
    });
});
router.put("/api/user", authMiddleware_1.default, (_req, res) => {
    const errors = (0, express_validator_1.validationResult)(_req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const controller = new user_1.default();
    const { name, email, dni, address, phone, password } = _req.body;
    controller
        .update({ name, email, dni, address, phone, password })
        .then((response) => {
        res.status(response.code).send(response.payload);
    });
});
router.put("/api/user/profilePicture/:email", authMiddleware_1.default, upload.single("profilePicture"), (_req, res) => {
    const controller = new user_1.default();
    const email = _req.params.email;
    const profilePicture = _req.file;
    if (!profilePicture) {
        return res.status(400).json({ message: "Profile picture is required." });
    }
    controller
        .UpdateProfilePicture(email, profilePicture)
        .then((response) => {
        res.status(response.code).json(response.payload);
    })
        .catch((error) => {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    });
});
router.post("/api/auth/login", validateLogin, (_req, res) => {
    const controller = new auth_1.default();
    const { email, password } = _req.body;
    controller.login({ email, password }).then((response) => {
        res.status(response.code).send(response);
    });
});
router.post("/api/auth/login-supplier", validateSupplierLogin, (_req, res) => {
    const errors = (0, express_validator_1.validationResult)(_req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const controller = new auth_1.default();
    const { cuit, password } = _req.body;
    controller.loginSupplier({ cuit, password }).then((response) => {
        res.status(response.code).send(response);
    });
});
router.post("/api/auth/password-recovery/:email", (_req, res) => {
    const controller = new auth_1.default();
    const email = _req.params.email;
    controller.recovery(email).then((response) => {
        res.status(response.code).send(response);
    });
});
router.delete("/api/user/:email", authMiddleware_1.default, (_req, res) => {
    const controller = new user_1.default();
    const email = _req.params.email;
    controller.delete(email).then((response) => {
        res.status(response.code).send(response);
    });
});
router.get("/api/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/api/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield UserService.GetUserByEmail((_a = req.user) === null || _a === void 0 ? void 0 : _a.email);
    const token = yield new Promise((resolve, reject) => {
        jwt.sign(user.user, config.get("jwtSecret"), { expiresIn: "1h" }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
    res.json({ success: true, token: `Bearer ${token}` });
}));
router.post("/api/supplier", validateSupplierRegister, (_req, res) => {
    const errors = (0, express_validator_1.validationResult)(_req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const controller = new supplier_1.default();
    controller.register(_req.body).then((response) => {
        res.status(response.code).send(response);
    });
});
router.put("/api/supplier", authMiddleware_1.default, validateSupplierUpdate, (_req, res) => {
    const errors = (0, express_validator_1.validationResult)(_req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    const controller = new supplier_1.default();
    controller.update(_req.body).then((response) => {
        res.status(response.code).send(response.payload);
    });
});
router.put("/api/supplier/logo/:cuit", authMiddleware_1.default, upload.single("logo"), (_req, res) => {
    const controller = new supplier_1.default();
    const cuit = _req.params.cuit;
    const logo = _req.file;
    if (!logo) {
        return res.status(400).json({ message: "Logo is required." });
    }
    controller.updateLogo(cuit, logo).then((response) => {
        res.status(response.code).send(response.payload);
    });
});
router.put("/api/supplier/coverPhoto/:cuit", authMiddleware_1.default, upload.single("coverPhoto"), (_req, res) => {
    const controller = new supplier_1.default();
    const cuit = _req.params.cuit;
    const coverPhoto = _req.file;
    if (!coverPhoto) {
        return res.status(400).json({ message: "Cover photo is required." });
    }
    controller.updateCoverPhoto(cuit, coverPhoto).then((response) => {
        res.status(response.code).send(response.payload);
    });
});
router.delete("/api/supplier/:cuit", authMiddleware_1.default, (_req, res) => {
    const controller = new supplier_1.default();
    const cuit = _req.params.cuit;
    controller.delete(cuit).then((response) => {
        res.status(response.code).send(response);
    });
});
router.get("/api/supplier/:cuit", (_req, res) => {
    const controller = new supplier_1.default();
    const cuit = _req.params.cuit;
    controller.get(cuit).then((response) => {
        res.status(response.code).send(response.payload);
    });
});
exports.default = router;
