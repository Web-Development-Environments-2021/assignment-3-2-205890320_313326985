var express = require("express");
var router = express.Router();
const player_domain = require("../routes/domain/players_domain");
const team_domain = require("../routes/domain/teams_domain");

// request that will return all of the relevant teams for our season with partial/full match to name
router.get("/Teams", async (req, res, next) => {
  try{
    // sanity checks
    const amountOfParams = Object.keys(req.query).length;
    if (req.query.query == undefined || req.query.sort == undefined || amountOfParams > 2){
      throw{status: 400, message: "invalid parameter names"};
    }

    const team_name_to_search = req.query.query;
    const sort_way = req.query.sort;
    // if query is empty, or does not contain only letters, with no space
    if(!(/^[A-Za-z]+$/.test(team_name_to_search))){
      throw{status: 400, message: "invalid query search"};
    }

    const team_list_filtered_by_season = await team_domain.searchForTeamsInOurSeason(team_name_to_search);
    
    /**
     * Sort
     */
    var team_list_filtered_by_season_sorted_by_name = team_list_filtered_by_season;
    await team_domain.SortTeams(team_list_filtered_by_season_sorted_by_name,sort_way);
    
    const results = await team_domain.extractRelevantTeamData(team_list_filtered_by_season_sorted_by_name);
    res.status(200).send(results);
  }
  catch (error) {
  next(error);
  }
 
});

// request that will return all of the relevant players for our season with partial/full match to name
router.get("/Players", async (req, res, next) => {
  try{
     // sanity checks
     const amountOfParams = Object.keys(req.query).length;
     if (req.query.query == undefined || req.query.sort == undefined || req.query.filter == undefined || amountOfParams > 4){
      throw{status: 400, message: "invalid parameter names"};
    }

    const player_name_to_search = req.query.query;
    const sort_way = req.query.sort;
    const filter_way = req.query.filter;
    const query_to_filter_players = req.query["filter query"];

    if(!(/^[A-Za-z]+$/.test(player_name_to_search))){
      throw{status: 400, message: "invalid query search"};
    }

    // get from API all of the players
    // then get players that are in our season
    const players_list_filtered_by_season = await player_domain.searchForPlayersInOurSeason(player_name_to_search);

    /**
     * Filter
     */
    var players_list_filtered_by_season_filterquery = await player_domain.filterPlayers(filter_way,query_to_filter_players,players_list_filtered_by_season);

    /**
     * Sort
     */
    var players_list_filtered_by_season_filterquery_sorted_by_name = players_list_filtered_by_season_filterquery;
    await player_domain.sortPlayers(sort_way,players_list_filtered_by_season_filterquery_sorted_by_name);
    
    const results = await player_domain.extractRelevantPlayerData(players_list_filtered_by_season_filterquery_sorted_by_name);

    res.status(200).send(results);
  }
    catch (error) {
    next(error);
  }
  
});


module.exports = router;
