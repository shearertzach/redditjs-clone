const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../models/user");

const testUser = {
    username: 'testone',
    password: 'password'
}

describe("User", function () {

    it("should not be able to login if they have not registered", function (done) {
        agent.post("/login", { email: "wrong@wrong.com", password: "nope" }).end(function (err, res) {
            res.status.should.be.equal(401);
            done();
        });
    });

    it("should be able to signup", function (done) {
        User.findOneAndRemove({ username: "testone" }, function () {
            agent
                .post("/sign-up")
                .send({ username: "testone", password: "password" })
                .end(function (err, res) {
                    res.should.have.status(200);
                    agent.should.have.cookie("nToken");
                    done();
                });
        });
    });

    // login
    it("should be able to login", function (done) {
        agent
            .post("/login")
            .send(testUser)
            .end(function (err, res) {
                res.should.have.status(200);
                agent.should.have.cookie("nToken");
                done();
            });
    });

    // logout
    it("should be able to logout", function (done) {
        agent.get("/logout").end(function (err, res) {
            res.should.have.status(200);
            agent.should.not.have.cookie("nToken");
            done();
        });
    });

});

after(function () {
    User.findOneAndDelete({
        username: testUser.username
    })
        .then(function (res) {
            agent.close()
            done()
        })
        .catch(function (err) {
            done(err);
        });
});

