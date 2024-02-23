
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../server"; 
import {User} from "../models/user.model"

chai.use(chaiHttp);
const { expect } = chai;

describe("UserController", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("/POST create", () => {
    it("it should not POST a user without username, email or password field", (done) => {
      let user = {
        role: "user",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("error");
          done();
        });
    });

  });

});
