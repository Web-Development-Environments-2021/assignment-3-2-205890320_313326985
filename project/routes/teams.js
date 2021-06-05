var express = require("express");
var router = express.Router();
const player_domain = require("../routes/domain/players_domain");
const teams_domain = require("../routes/domain/teams_domain");
const matches_domain = require("../routes/domain/matches_domain");

/**
 * Authenticate all incoming requests by middleware
 */
//  router.use(async function (req, res, next) {
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

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_id = parseInt(req.params.teamId);

    // chech if valid team ID
    if (!await teams_domain.validTeamID(team_id)){
      throw { status: 400, message: "Bad request: team" };
    }

  let team_details = {};


    // team info
    const team_info = await teams_domain.getTeamInfoById(team_id);
    team_details["team name"] = team_info[0]["team name"];
    team_details["logo path"] = team_info[0]["logo path"];

    // players details
    const players_details = await player_domain.getPlayersByTeam(team_id);
    team_details["players"] = players_details;

    // future and past matches
    var futureMatches = await matches_domain.getFutureMatches();
    futureMatches = futureMatches.filter(function(match){
      return match.local_team_id == team_id || match.visitor_team_id == team_id
    })

    var pastMatches = await matches_domain.getPastMatches();
    pastMatches = pastMatches.filter(function(match){
      return match.local_team_id == team_id || match.visitor_team_id == team_id
    })

    var pastMatchesWithEvent = []
    for(var i=0 ; i < pastMatches.length ; i++){
      var match = pastMatches[i];
      var events = await matches_domain.getEventsMatch(match.match_id);
      pastMatchesWithEvent.push({"details": match, "events": events});
    }

    team_details["team's past matches"]=pastMatchesWithEvent;
    team_details["team's future matches"]=futureMatches;

    if (team_details.length == 0){
      throw { status: 400, message: "No Content" };
    }

    
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
