var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const matches_domain = require("./domain/matches_domain");
const league_domain = require("./domain/league_domain");
const users_domain = require("./domain/users_domain");

router.get("/getDetails", async (req, res, next) => {
  try {
    var user_logged = false;
    var league_details = await league_domain.getLeagueDetails();
    var favoriteMatches = [];

    // next match planned
    const next_match = await matches_domain.nextMatchPlanned();
    league_details.next_match_planned = next_match;

    // check if the user logged in
    if (req.session && req.session.user_id) {
      await DButils.execQuery("SELECT user_id FROM dbo.Users")
        .then((users) => {
          if (users.find((x) => (x.user_id === req.session.user_id))) {
            req.user_id = req.session.user_id;
            user_logged = true;
          }
        })
        .catch((err) => next(err));
    }

    if(user_logged){
      const user_id = req.user_id;
    // get favorite matches ids
      const favoriteMatches_ids = await users_domain.getFavoriteMatchesIDs(user_id);
      favoriteMatches = await matches_domain.getFutureMatchesInfo(favoriteMatches_ids);
    }

    if(league_details.length == 0 && favoriteMatches.length == 0){
      res.sendStatus(204);
    }
    else{
      res.send({"leaguePreview":league_details, "favoriteMatches": favoriteMatches.slice(0,3)});
    }
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
