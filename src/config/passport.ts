import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { findOrCreateGoogleUser } from "../auth/auth.service.ts";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser({
          email: profile.emails![0]!.value,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          avatar: profile.photos![0]!.value,
          googleId: profile.id!,
        });
        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

export default passport;
