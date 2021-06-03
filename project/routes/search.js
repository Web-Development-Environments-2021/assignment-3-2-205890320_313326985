var express = require("express");
var router = express.Router();
const team_utils = require("./utils/teams_utils");
const player_utils = require("./utils/players_utils");
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
    const team_list = await team_utils.getTeamsByName(team_name_to_search);
    const team_list_filtered_by_season = [];
    // push all teams to arr by specific season
    for(var i=0; i<team_list.length; i++){
      if (team_list[i].current_season_id == 17328){
        team_list_filtered_by_season.push(team_list[i]);
      }
    }
    if(team_list_filtered_by_season.length == 0){
      throw{status: 204, message: "There is no content to send for this request"};
    }
    var team_list_filtered_by_season_sorted_by_name = team_list_filtered_by_season;
    if(/^[A-Za-z]+$/.test(sort_way)){
      // sort by team name, ascending
      if(sort_way == "asc"){
        team_list_filtered_by_season_sorted_by_name.sort((a,b) => ((a.name).localeCompare(b.name)));
      }
      // sort by team name, descending
      else if(sort_way == "desc"){
        team_list_filtered_by_season_sorted_by_name.sort((a,b) => ((b.name).localeCompare(a.name)));
      }
      // if query is only letters, but invalid
      else if(sort_way != "none"){
        throw{status: 400, message:"wrong way to sort"};
      }
    }
    // wrong parameter, send status fail
    else{
      throw{status: 400, message: "invalid sort search"};
    }
    
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
            // if player has team but not playing in our LIGA, continue
            if(players_list[i].team.data.current_season_id == undefined){
              continue;
            }
          }
        }
        if (players_list[i].team.data.current_season_id == 17328){
          players_list_filtered_by_season.push(players_list[i]);
        }
    }
    if(players_list_filtered_by_season.length == 0){
      throw{status: 204, message: "There is no content to send for this request"};
    }
    // now filter
    var players_list_filtered_by_season_filterquery = [];
    // filter by team name
    if(filter_way == "team name"){
      // check if filter query is only letters, no space
      if(/^[A-Za-z]+$/.test(query_to_filter_players)){
        for(var i=0; i<players_list_filtered_by_season.length; i++){
          // if team name given contained or equal to a real team name
          if(((players_list_filtered_by_season[i].team.data.name).toLowerCase()).indexOf(query_to_filter_players.toLowerCase()) !== -1){
            players_list_filtered_by_season_filterquery.push(players_list_filtered_by_season[i]);
          }
        }
      }
    }
    // filter by position id
    else if(filter_way == "player's position"){
      // check if filter query is only numbers, no space
      if(/^[0-9]+$/.test(query_to_filter_players)){
        for(var i=0; i<players_list_filtered_by_season.length; i++){
          // if position id given equal to position id in data
          if(players_list_filtered_by_season[i].position_id == query_to_filter_players){
            players_list_filtered_by_season_filterquery.push(players_list_filtered_by_season[i]);
          }
        }
      }
    }
    // no filtering
    else if(filter_way == "none"){
      players_list_filtered_by_season_filterquery = players_list_filtered_by_season;
    }
    // wrong parameter, send status fail
    else{
      throw{status: 400, message:"wrong way to filter"}
    }
    if(players_list_filtered_by_season_filterquery.length == 0){
      throw{status: 204, message: "There is no content to send for this request"};
    }
    // now sort
    var players_list_filtered_by_season_filterquery_sorted_by_name = players_list_filtered_by_season_filterquery;
    // check if sort way is only letters, and space
    if(/^[a-zA-Z\s]*$/.test(sort_way)){
      // sort by player name, ascending
      if(sort_way == "player name"){
        players_list_filtered_by_season_filterquery_sorted_by_name.sort((a,b) => ((a.fullname).localeCompare(b.fullname)));
      }
      // sort by team name, ascending and space
      else if(sort_way == "team name"){
        players_list_filtered_by_season_filterquery_sorted_by_name.sort((a,b) => ((a.team.data.name).localeCompare(b.team.data.name)));
      }
      // if query is only letters and space, but invalid
      else if(sort_way != "none"){
        throw{status: 400, message:"invalid sort search"}
      }
    }
    // wrong parameter, send status fail
    else{
      throw{status: 400, message:"wrong way to sort"}
    }
    
    
    const results = await player_domain.extractRelevantPlayerData(players_list_filtered_by_season_filterquery_sorted_by_name);
    

    res.status(201).send(results);
  }
    catch (error) {
    next(error);
  }
  
});


module.exports = router;
