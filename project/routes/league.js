var express = require("express");
var router = express.Router();
const matches_domain = require("./domain/matches_domain");
const league_domain = require("./domain/league_domain");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_domain.getLeagueDetails();

    // next match planned
    const next_match = await matches_domain.nextMatchPlanned();
    league_details.next_match_planned = next_match;


    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
