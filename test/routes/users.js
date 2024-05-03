const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

describe("Routes: Users", () => {
    const Users = app.db.models.Users;
    const jwtSecret = app.libs.config.jwtSecret;
    let token;
    beforeEach(done => {
        Users
           .destroy({where: {}})
           .then(() => Users.create({
                name: "test",
                email: "test@test.com",
                password: "password123"
            }))
           .then(user => {
                token = jwt.encode({id: user.id}, jwtSecret);
                done();
            });
    });
    describe("GET /user", () => {
        describe("status 200", () => {
            it("returns the authenticated user", done => {
                request.get("/user")
                   .set("Authorization", "JWT " + token)
                   .expect(200)
                   .end((err, res) => {
                        expect(res.body.name).to.eql("test");
                        expect(res.body.email).to.eql("test@test.com");
                        done(err);
                    });
                });
            });
        });
    describe("DELETE /user", () => {
        describe("status 204", () => {
            it("deletes the authenticated user", done => {
                request.delete("/user")
                   .set("Authorization", "JWT " + token)
                   .expect(204)
                   .end((err, res) => done(err));
            });
        });
    });
    describe("POST /users", () => {
        describe("status 200", () => {
            it("creates a new user", done => {
                request.post("/users")
                    .send({
                        name: "TestUser",
                        email: "test.user@test.com",
                        password: "test123"
                    })
                   .expect(200)
                   .end((err, res) => {
                        expect(res.body.name).to.eql("TestUser");
                        expect(res.body.email).to.eql("test.user@test.com");
                        done(err);
                    })
            });
        });
    });
});