var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");

/**
 * This path returns all the matches in the system (only for union agent user)
 */
router.get("", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );
    const sort = req.query.sort


    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});


router.post("/addMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    // There is already match id in this table
    if (matches.find((x) => x.match_id === req.body.match_id))
      throw { status: 409, message: "Match ID taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.Users (username,firstname,lastname,country,password,email,image_url) VALUES ('${req.body.username}','${req.body.firstname}', '${req.body.lastname}', '${req.body.country}', '${hash_password}','${req.body.email}', '${req.body.image_url}')`
    );

    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});


module.exports = router;
