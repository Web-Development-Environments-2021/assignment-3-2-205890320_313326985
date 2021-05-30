var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const team_utils = require("./utils/teams_utils");
const player_utils = require("./utils/players_utils");

// request that will return all of the relevant teams for our season with partial/full match to name
router.get("/Teams", async (req, res, next) => {
  try{
    const team_name_to_search = req.query.query;
    const sort_way = req.query.sort;
    const team_list = await team_utils.getTeamsByName(team_name_to_search);
    const team_list_filtered_by_season = [];
    for(var i=0; i<team_list.length; i++){
      if (team_list[i].current_season_id == 17328){
        team_list_filtered_by_season.push(team_list[i]);
      }
    }
    const results = await team_utils.extractRelevantTeamData(team_list_filtered_by_season);
    res.status(201).send(results);
  }
  catch (error) {
  next(error);
  }
 
});


// request that will return all of the relevant players for our season with partial/full match to name
router.get("/Players", async (req, res, next) => {
  try{
    const player_name_to_search = req.query.query;
    const sort_way = req.query.sort;
    const players_list = await player_utils.getPlayersByNameAndTeam(player_name_to_search);
    const players_list_filtered_by_season = [];
      // add to array only players that are in teams that are playing in SuperLiga
    for(var i=0; i<players_list.length; i++){
        // if player does not have a team, continue
        if(players_list[i].team==undefined){
          continue;
        }
        else{
          if(players_list[i].team.data == undefined){
            continue;
          }
          else{
            if(players_list[i].team.data.current_season_id == undefined){
              continue;
            }
          }
        }
        if (players_list[i].team.data.current_season_id == 17328){
          players_list_filtered_by_season.push(players_list[i]);
        }
    }
    const results = await player_utils.extractRelevantPlayerData(players_list_filtered_by_season);
    res.status(201).send(results);
  }
    catch (error) {
    next(error);
  }
  
});




module.exports = router;
