module.exports = app => {
    if (process.env.NODE_ENV !== "test") {
        app.db.sequelize.sync().then(() => {
            app.listen(app.get("port"), () => console.log("api - listening on port: " + app.get("port")));
        });
    }
};