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
const passport_1 = __importDefault(require("passport"));
const user_model_1 = __importDefault(require("../Models/user.model"));
const AuthService = require("../Services/AuthService");
const passport_google_oauth20_1 = require("passport-google-oauth20");
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "647098315366-iobhe4aucqr4rsj9m1kru56a1jvponj2.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield AuthService.RegisterOrLoginGoogleUser(profile);
    console.log("Result", result);
    if (result.code === 200) {
        done(null, result.user);
    }
    else {
        console.log("Error", result.message);
        done(new Error(result.message), null);
    }
})));
