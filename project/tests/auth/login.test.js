const request = require('supertest')
const app = require('../auth')

describe("Unsuccessful user login, user invalid", ()=> {
  it("GET /Login - success", async () => {
    const res = await request(app)
      .post('/Login')
      .send({
        username: "naorb",
        password: "naor@55",
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('post')
  })
})

// test('Unsuccessful user login, user invalid', async () => {
//     const data = await auth.post("/Login", async (req, res, next)
//     var req = new Object();
//     req.body = new Object();
//     req.body.username = "naorb";
//     var res = new Object();
//     res.status = 401;
//     res.send = "Username or Password incorrect";
//     var next = new Object();
//     expect(auth.post("/Login", async (req, res, next))
//     ).toBe(res);
//   });
