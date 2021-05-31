var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = {};
  try {
    // team info
    const team_info = await teams_utils.getTeamInfoById(req.params.teamId);
    team_details["team name"] = team_info[0]["team name"];
    team_details["logo path"] = team_info[0]["logo path"];
    // players details
    const players_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );

    team_details["players"] = players_details;

    // future and past matches
    var currentdate = new Date(); 

    const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );

    let futureMatches = [];
    let pastMatches = [];

    for(var i=0 ; i<matches.length ; i++){
      if(matches[i].date_time <= currentdate){
        pastMatches.push(matches[i])
      }
      else{
        futureMatches.push(matches[i])

      }
    }

    team_details["team's past matches"]=pastMatches;
    team_details["team's future matches"]=futureMatches;


                


    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
