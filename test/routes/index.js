const { expect } = require("chai");

describe("Routes: Index", () => {
    describe("GET /", () => {
        it("returns the api status", done => {
            request.get("/")
            .expect(200)
            .end((err,res) => {
                const expected = {status: "Crafting API is up and running."};
                expect(res.body).to.eql(expected);
                done(err);
            });
        });
    });
});