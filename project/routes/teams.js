var express = require("express");
var router = express.Router();
const player_domain = require("../routes/domain/players_domain");
const teams_domain = require("../routes/domain/teams_domain");
const matches_domain = require("../routes/domain/matches_domain");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    var team_id;
    // check if number
    if(/^[0-9]+$/.test(req.params.teamId)){
      team_id = parseInt(req.params.teamId);
    }
    else{
      team_id = false;
    }
    // check if valid team ID
    if (team_id == false|| !await teams_domain.validTeamID(team_id)){
      res.status(400).send("Team id is not valid or not exist in the league");
    }
    else{
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
        pastMatchesWithEvent.push({"MatchDetails": match, "MatchEvents": events});
      }

      team_details["team's past matches"]=pastMatchesWithEvent;
      team_details["team's future matches"]=futureMatches;

      if (team_details.length == 0){
        res.status(204).send("There is no details about this team");
      }
      else{
        res.send(team_details); 
      }
           
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
