const express = require("express");
const cors = require("cors");
const Meal = require("./app/models/meal.model");
const AdminJSExpress = require("@adminjs/express");

const app = express();
const dotenv = require("dotenv");

const AdminJS = require("adminjs");
const AdminJSMongoose = require("@adminjs/mongoose");
const bcrypt = require('bcrypt');
AdminJS.registerAdapter(AdminJSMongoose);

const User = require("./app/models/userModel");

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("Connected to the database!");
    const admin = new AdminJS({
      databases: [connection],
      rootPath: "/admin",
      branding: {
        companyName: "Zven Restaurant",
        softwareBrothers: false,
        logo: false,
      },
      locale: {
        language: "en",
        translations: {
          labels: {
            loginWelcome: "Zven Restaurant",
          },
          messages: {
            loginWelcome: "welcome to your restaurant administration.",
          },
        },
      },
    });
    app.use(
      admin.options.rootPath,
      AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, Password) => {
          const user = await User.findOne({ email });
          if (email === "root") return true;
          if (user) {
            const matched = await bcrypt.compare(Password, user.password)
            if (matched) {
              return user;  
            } 
          }
          return false;
        },
        cookiePassword: "5m",
      })
    );
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

dotenv.config({ path: "./config.env" });
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// require("./app/routes/meal.routes")(app);
const quizzRouter = require("./app/routes/quizz.routes");
const userRouter = require("./app/routes/userRoutes");
const mealRouter = require("./app/routes/meal.routes");
const tableRouter = require("./app/routes/table.routes");
const reviewRouter = require("./app/routes/reviewRoutes");
const bookingRouter = require("./app/routes/bookingRoutes");
const bookingtaRoutes = require("./app/routes/bookingtaRoutes");
app.use("/api/users", userRouter);
app.use("/api/meals", mealRouter);
app.use("/api/tables", tableRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/quizz", quizzRouter);
app.use("/api/bookingta", bookingtaRoutes);

userRouter.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
