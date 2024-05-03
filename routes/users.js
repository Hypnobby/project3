module.exports = app => {
    const Users = app.db.models.Users;

    app.route("/user")
        .all(app.auth.authenticate())
        /**
         * @api {get} /user Get the authenticated user's data
         * @apiGroup User
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT asdhfkashdkfhkasdf"}
         * @apiSuccess {Number} id User id
         * @apiSuccess {String} name User name
         * @apiSuccess {String} email User email
         * @apiSuccessExample {json} Success-Response:
         *  HTTP/1.1 200 OK
         *  {
         *    "id": 1,
         *    "name": "John Doe",
         *    "email": "john@doe.com"
         *  }
         */
        .get((req, res) => {
            Users.findByPk(req.user.id, {
                attributes: ["id", "name", "email"]
            })
            .then(user => res.json(user))
            .catch(error => res.status(500).json({msg: error.message}));
        });

    /**
     * @api {delete} /user Delete the authenticated user's account
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *  {"Authorization": "JWT asdhfkashdkfhkasdf"}
     * @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 204 No Content
     */
    app.delete("/user", (req, res) => {
        Users.destroy({ where: { id: req.user.id } })
        .then(result => result ? res.sendStatus(204) : res.status(404).send('User not found'))
        .catch(error => res.status(500).json({msg: error.message}));
    });

    /**
     * @api {post} /users Register a new user
     * @apiGroup User
     * @apiParam {String} name User's name
     * @apiParam {String} email User's email
     * @apiParam {String} password User's password
     * @apiSuccess {Number} id User id
     * @apiSuccess {String} name User name
     * @apiSuccess {String} email User email
     * @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 201 Created
     *  {
     *      "id": 1,
     *      "name": "Jane Doe",
     *      "email": "jane@doe.com"
     *  }
     */
    app.post("/users", (req, res) => {
        Users.create(req.body)
        .then(result => res.json(result))
        .catch(error => {
             res.status(500).json({msg: error.message});
         });
    });
}
