const recipeRoutes = require("./recipe");
const usersRoutes = require("./user");

const constructorMethod = (app) => {
  app.use("/",usersRoutes);
  app.use("/", recipeRoutes);
  

  app.use("*", (req, res) => {
    res.sendStatus(404).render("Error", { e: "Page Not Found!" });
  });
};

module.exports = constructorMethod;