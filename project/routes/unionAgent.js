var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
// const matches_utils = require("./utils/matches_utils");



/**
 * Authenticate all incoming requests by middleware
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
// router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id FROM dbo.Users")
//       .then((users) => {
//         if (users.find((x) => x.user_id === req.session.user_id)) {
//           req.user_id = req.session.user_id;
//           next();
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });



// liad's dummy func
router.post("/addMatch", async (req, res, next) => {
  try {
    // insert match to Matches table
    await DButils.execQuery(
        `INSERT INTO dbo.Matches (match_id,date_time,local_team_id,visitor_team_id,venue_id,referee_id,home_goals,away_goals) VALUES ('${req.body.match_id}','${req.body.date_time}', '${req.body.local_team_id}', '${req.body.visitor_team_id}', '${req.body.venue_id}','${req.body.referee_id}','${req.body.home_goals}','${req.body.away_goals}')`
    );
  }
  catch (error){
    next(error);
  }
  res.status(201).send("The match successfully saved to the system");
});



module.exports = router;

