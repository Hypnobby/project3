const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const uploadDir = path.resolve(__dirname, '../public/uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        callback(null, uploadDir);
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {

    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = app => {
    const Items = app.db.models.Items;

    app.route("/items")
        .all(app.auth.authenticate())
        /**
         * @api {get} /items Return a full list of items entered by the user
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiSuccess {Number} id Item id
         * @apiSuccess {Number} itemID Item unique identifier
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "itemID": 102,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         *  }
         * @apiErrorExample {json} List error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Items.findAll({
                where: { user_id: req.user.id }
            })
            .then(result => res.json(result))
            .catch(error => {
                 res.status(412).json({msg: error.message});
            });
        })
        /**
         * @api {post} /items Submit a new item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {String} itemName Item name
         * @apiParam {Number} price Item price
         * @apiParam {String} description Item description
         * @apiParam {String} material Main material used
         * @apiParam {String} creator Item creator
         * @apiParamExample {json} Input
         *  {
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe"
         *  }
         * @apiSuccess {Number} id Item id
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         *  }
         * @apiErrorExample {json} Submission error
         *  HTTP/1.1 412 Precondition Failed
         */
        app.post('/items', upload.single('image'), (req, res) => {
            const itemData = {
                itemID: req.body.itemID,
                itemName: req.body.itemName,
                price: req.body.price,
                material: req.body.material,
                creator: req.body.creator,
                description: req.body.description,
                imageUrl: req.file ? req.file.path.replace(/\\/g, '/') : null // Adjust path for URL usage
            };
        
            Items.create(itemData)
                .then(item => {
                    let responseItem = item.toJSON(); // Convert Sequelize model instance to JSON
                    responseItem.imageUrl = itemData.imageUrl; // Ensure imageUrl is included in response
                    res.status(201).json(responseItem);
                })
                .catch(error => {
                    console.error("Error when creating item: ", error);
                    res.status(500).json({ message: "Internal Server Error", error: error.message });
                });
        });
        
        
        
        app.get("/items", app.auth.authenticate(), (req, res) => {
            console.log("Requested by user:", req.user.id);  // Log which user is making the request
            Items.findAll({
                where: { user_id: req.user.id }
            })
            .then(items => {
                console.log("Items returned:", items);  // Log the items returned from the database
                res.json(items);
            })
            .catch(error => {
                console.error("Error fetching items:", error);
                res.status(500).json({msg: error.message});
            });
        });
        
    app.route("/items/:id")
        .all(app.auth.authenticate())
        /**
         * @api {get} /items/:id Get a single item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiSuccess {Number} id Item id
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         * {
         *      "id": 1,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         * }
         * @apiErrorExample {json} Item not found error
         *  HTTP/1.1 404 Not Found
         * @apiErrorExample {json} Find error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Items.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            })
            .then(result => {
                if (result) {
                    res.json(result);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(error => {
                res.status(412).json({msg: error.message});
            })
        })
        /**
         * @api {put} /items/:id Update an item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {Number} id Item id
         * @apiParam {String} itemName Item name
         * @apiParam {Number} price Item price
         * @apiParam {String} description Item description
         * @apiParam {String} material Main material used
         * @apiParam {String} creator Item creator
         * @apiParamExample {json} Input
         *  {
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe"
         *  }
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 204 No Content
         * @apiErrorExample {json} Update error
         *  HTTP/1.1 412 Precondition Failed
         */
        .put((req, res) => {
            Items.update(req.body, {
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            })
            .then(result => res.sendStatus(204))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        })
        /**
         * @api {delete} /items/:id Remove an item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {Number} id Item id
         * @apiSuccessExample {json} Success
         * HTTP/1.1 204 No Content
         * @apiErrorExample {json} Delete error
         * HTTP/1.1 412 Precondition Failed
         */
        .delete((req, res) => {
            Items.destroy({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            })
            .then(result => res.sendStatus(204))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        });
}


        