const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/user");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		async (accessToken, refreshToken, profile, done) => {
      			const currentUser = await User.findOne({
                googleId: profile._json.sub
              }).exec();

              if (!currentUser) {
                const newUser = await new User({
                  name: profile._json.name,
                  givenName: profile._json.given_name,
                  googleId: profile._json.sub,
                  profileImageUrl: profile._json.picture
                }).save();
                if (newUser) {
                  done(null, newUser);
                }
              }
              done(null, currentUser);
            
		}
	)
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});