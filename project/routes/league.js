var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    //------------------------left------------------------------// 
    const league_details = await league_utils.getLeagueDetails();

    // next match planned
    const next_match = await DButils.execQuery(
      "SELECT TOP 1 * FROM dbo.Matches WHERE date_time > GETDATE() ORDER BY date_time ASC"
    );

    league_details.next_match_planned = next_match[0];


    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
