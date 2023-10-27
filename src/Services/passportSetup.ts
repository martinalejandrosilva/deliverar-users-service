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
        "647098315366-r86pqh99c3qmhp4b6fc64bnfq407dpk6.apps.googleusercontent.com",
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
      if (result.code === 200) {
        done(null, result.user);
      } else {
        done(new Error(result.message), null);
      }
    }
  )
);
