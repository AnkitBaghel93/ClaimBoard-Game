const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://claimboard-game-backend.onrender.com/api/google/callback', 
      },
      async (accessToken, refreshToken, profile, done) => {
       
        const { id, displayName, emails } = profile;
        const email = emails?.[0]?.value;

        try {
          let user = await User.findOne({ email });
          

          if (!user) {
            user = new User({
              name: displayName,
              email,
              googleId: id,
            });
            await user.save();
           
          }

          done(null, user);
        } catch (err) {
          
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    
    done(null, user);
  });
};
