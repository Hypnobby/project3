module.exports = {
    database: "crafting_test",
    username: "",
    password: "",
    params: {
        dialect: "sqlite",
        storage: "project.sqlite",
        logging: false,
        define: {
            underscored: true
        }
    },
    jwtSecret: "h4l01nf1n1t3",
    jwtSession: {session: false}
};