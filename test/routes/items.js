const jwt = require("jwt-simple");
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../../app');

describe("Routes: Items", () => {
    const Users = app.db.models.Users;
    const Items = app.db.models.Items;
    const jwtSecret = app.libs.config.jwtSecret;
    let token;
    let fakeItem;

    beforeEach(done => {
        Users
            .destroy({where: {}})
            .then(() => Users.create({
                name: "test",
                email: "test@test.com",
                password: "password123"
            }))
            .then(user => {
                Items
                    .destroy({where: {}})
                    .then(() => Items.bulkCreate([{
                        id: 1,
                        itemID: 1001,
                        itemName: "Handmade Necklace",
                        price: 29.99,
                        material: "Silver, Gemstones",
                        creator: "Alice Craft",
                        description: "Beautifully crafted necklace",
                        UserId: user.id
                    }, {
                        id: 2,
                        itemID: 1002,
                        itemName: "Custom Bracelet",
                        price: 19.99,
                        material: "Leather, Beads",
                        creator: "Bob Smith",
                        description: "Custom made bracelet",
                        UserId: user.id
                    }]))
                .then(items => {
                    fakeItem = items[0];
                    token = jwt.encode({id: user.id}, jwtSecret);
                    done();
                });
        });
    });
    describe("GET /items", () => {
        describe("status 200", () => {
            it("should return all items", done => {
                request(app).get("/items")
                    .set("Authorization", "JWT " + token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.length(2);
                        expect(res.body[0].itemName).to.eql("Handmade Necklace");
                        expect(res.body[1].itemName).to.eql("Custom Bracelet");
                        done(err);
                    });
            });
        });
    });
    it("should create a new item with an image", done => {
        const imagePath = path.join(__dirname, '../../../Project/public/uploads/test_image.jpg');
        console.log(fs.existsSync(imagePath));
        request(app)
            .post("/items")
            .set("Authorization", "JWT " + token)
            .field('itemID', '1024')
            .field('itemName', "Wooden Decor")
            .field('price', '34.99')
            .field('material', "Oak Wood")
            .field('creator', "Cindy Wood")
            .field('description', "Handmade wooden decor piece")
            .attach('image', imagePath)
            .expect(201)  // Changed from 200 to 201
            .end((err, res) => {
                if (err) return done(err);
                console.log(res.body);
                expect(res.body.itemName).to.eql("Wooden Decor");
                expect(res.body.imageUrl).to.exist;
                done();
            });
    });
    
    describe("GET /items/:id", () => {
        describe("status 200", () => {
            it("should return an item", done => {
                request(app).get("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.itemName).to.eql("Handmade Necklace");
                        done(err);
                    });
            });
        });
        describe("status 404", () => {
            it("throws error that item does not exist", done => {
                request(app).get("/items/0")
                    .set("Authorization", "JWT " + token)
                    .expect(404)
                    .end((err, res) => done(err));
            });
        });
    });
    describe("PUT /items/:id", () => {
        describe("status 204", () => {
            it("should update an item", done => {
                request(app).put("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .send({
                        itemID: 1001,
                        itemName: "Handmade Necklace",
                        price: 29.99,
                        material: "Silver, Gemstones",
                        creator: "Alice Craft",
                        description: "Exquisitely crafted necklace"
                    })
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
    describe("DELETE /items/:id", () => {
        describe("status 204", () => {
            it("should delete an item", done => {
                request(app).delete("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
});
