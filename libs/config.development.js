const logger = require("./logger");

module.exports = {
    database: "items",
    username: "",
    password: "",
    params: {
        dialect: "sqlite",
        storage: "project.sqlite",
        logging: (sql) => {
            logger.info("[" + new Date() + "] " + sql);
        },
        define: {
            underscored: true
        }
    },
    jwtSecret: "h4l01nf1n1t3",
    jwtSession: {session: false}
};