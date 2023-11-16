import passport from "passport";
import User from "../Models/user.model";
const AuthService = require("../Services/AuthService");
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "647098315366-iobhe4aucqr4rsj9m1kru56a1jvponj2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (arg0: Error | null, arg1: any) => void
    ) => {
      const result = await AuthService.RegisterOrLoginGoogleUser(profile);
      console.log("Result", result);
      if (result.code === 200) {
        done(null, result.user);
      } else {
        console.log("Error", result.message);
        done(new Error(result.message), null);
      }
    }
  )
);
