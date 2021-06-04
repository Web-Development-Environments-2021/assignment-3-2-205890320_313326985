var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_domain = require("./utils/users_domain");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM dbo.Users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path returns the favorites matches that were saved by the logged-in user
 * If a match is not a future match, it will be removed
 */
 router.get("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_ids = await users_domain.getFutureMatchesIDs(user_id);
    // returning 0 means error from help function
    if(match_ids.length == 0){
      throw { status: 204, message: "This user does not have any favorite matches" };
    }
    let match_ids_array = [];
    match_ids.map((element) => match_ids_array.push(element.match_id)); //extracting the match's ids into array
    const results = await users_domain.getInfoAboutMatches(match_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with matchId and save this match in the favorites list of the logged-in user
 */
 router.post("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_Id_from_body = req.body.match_id;
    const num_of_error = await users_domain.markFavorites(user_id, match_Id_from_body);
    if(num_of_error== 0){
      throw{status:400,message:"match id invalid"};
    }
    else{
      res.status(201).send("The match successfully saved to the favorites");
    }
  } catch (error) {
    next(error);
  }
 });



module.exports = router;
