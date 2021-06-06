var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_domain = require("./domain/users_domain");
const matches_domain = require("./domain/matches_domain");

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
    const amountOfParams = Object.keys(req.query).length;
    // sanity check
    if (req.body.length != undefined || amountOfParams > 0 ){
      res.status(400).send("Not suppose to have any params or body");
      // throw{status: 400, message: "Not suppose to have any params or body"};
    }
    else{
      const user_id = req.session.user_id;
    
      // get favorite matches ids
      const favoriteMatches_ids = await users_domain.getFavoriteMatchesIDs(user_id);
      // returning 0 means error from help function
      if(favoriteMatches_ids.length == 0){
        res.status(204).send("This user does not have any favorite matches");
        // throw { status: 204, message: "This user does not have any favorite matches" };
      }
      else{
        const results = await matches_domain.getFutureMatchesInfo(favoriteMatches_ids);
        res.status(200).send(results);
      }
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with matchId and save this match in the favorites list of the logged-in user
 */
 router.post("/favoriteMatches", async (req, res, next) => {
  try {
    const amountOfParams = Object.keys(req.query).length;
    // sanity check
    if (req.body.match_id == undefined ||  !(/^[0-9]+$/.test(req.body.match_id)) ||amountOfParams > 0 ){
      res.status(400).send("invalid body");
      // throw{status: 400, message: "invalid body"};
    }
    else{
      const user_id = req.session.user_id;
      const match_Id_from_body = req.body.match_id;

      //get all future matches ids
      const future_match_id_from_table = await matches_domain.getFutureMatchesIDs();

      const num_of_error = await users_domain.markFavorites(user_id, match_Id_from_body,future_match_id_from_table);
      if(num_of_error== 0){
        res.status(400).send("match id is not a future match id or is invalid");
        // throw{status:400,message:"match id is not a future match id or is invalid"};
      }
      else if(num_of_error == -1){
        res.status(400).send("match id already inside favorites");
        // throw{status:400,message:"match id already inside favorites"};
      }
      else{
        res.status(201).send("The match successfully saved to the favorites");
      }
    } 
  } catch (error) {
    next(error);
  }
 });



module.exports = router;
