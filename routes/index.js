module.exports = app => {
  app.get("/", (req, res) => {
    res.json({
      status: "Crafting API is up and running."
    });
  });
}