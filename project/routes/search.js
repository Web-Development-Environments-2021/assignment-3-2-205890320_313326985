const e = require("express");
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
      res.status(400).send("invalid parameter names");
      // throw{status: 400, message: "invalid parameter names"};
    }
    else{
      const team_name_to_search = req.query.query;
      const sort_way = req.query.sort;
      // if query is empty, or does not contain only letters, with no space
      if(!(/^[a-zA-Z]+$/.test(team_name_to_search))){
        res.status(400).send("invalid query search");
      }

      else{
        const team_list_filtered_by_season = await team_domain.searchForTeamsInOurSeason(team_name_to_search);
        // if its int, indicates error need to throw
        if(team_list_filtered_by_season == 0){
          res.status(204).send("There is no content to send for this request");
          // throw{status: 204, message: "There is no content to send for this request"};
        }
        else{
          /**
          * Sort
          */
          var team_list_filtered_by_season_sorted_by_name = team_list_filtered_by_season;
          const numForError = await team_domain.SortTeams(team_list_filtered_by_season_sorted_by_name,sort_way);
          if(numForError == -1){
            res.status(400).send("invalid sort search");
            // throw{status: 400, message: "invalid sort search"};
          }
          else if(numForError == -2){
            res.status(400).send("wrong way to sort");
            // throw{status: 400, message:"wrong way to sort"};
          }
          else{
            const results = await team_domain.extractRelevantTeamData(team_list_filtered_by_season_sorted_by_name);
            res.status(200).send(results);
          }
        }
      }
    }
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
    if (req.query.query == undefined || req.query.sort == undefined || req.query.filter == undefined || amountOfParams < 3){
      res.status(400).send("invalid parameter names");
      // throw{status: 400, message: "invalid parameter names"};
    }
    else{
      const player_name_to_search = req.query.query;
      const sort_way = req.query.sort;
      const filter_way = req.query.filter;
      const query_to_filter_players = req.query["filter query"];
  
      if(!(/^[a-zA-Z]+$/.test(player_name_to_search))){
        res.status(400).send("invalid query search");
        // throw{status: 400, message: "invalid query search"};
      }
      else{
          // get from API all of the players
          // then get players that are in our season
          const players_list_filtered_by_season = await player_domain.searchForPlayersInOurSeason(player_name_to_search);
          if(players_list_filtered_by_season == 0){
            res.status(204).send("There is no content to send for this request");
            // throw{status: 204, message: "There is no content to send for this request"};
          }
          else{
            /**
            * Filter
            */
            var players_list_filtered_by_season_filterquery = await player_domain.filterPlayers(filter_way,query_to_filter_players,players_list_filtered_by_season);
            if(
              players_list_filtered_by_season_filterquery == -1 ||
              players_list_filtered_by_season_filterquery == -2
              ){
              res.status(400).send("missing parameters");
              // throw{status: 400, message: "missing parameters"};
            }
            else if(players_list_filtered_by_season_filterquery == -3){
              res.status(400).send("wrong way to filter");
              // throw{status: 400, message:"wrong way to filter"}
            }
            else if(players_list_filtered_by_season_filterquery == -4){
              res.status(204).send("There is no content to send for this request");
              // throw{status: 204, message: "There is no content to send for this request"};
            }
            else{
              /**
              * Sort
              */
              var players_list_filtered_by_season_filterquery_sorted_by_name = players_list_filtered_by_season_filterquery;
              const error_indicator = await player_domain.sortPlayers(sort_way,players_list_filtered_by_season_filterquery_sorted_by_name);
              if(error_indicator == 0){
                res.status(400).send("invalid sort search");
                // throw{status: 400, message:"invalid sort search"}
              }
              else if(error_indicator == -1){
                res.status(400).send("wrong way to sort");
                // throw{status: 400, message:"wrong way to sort"}
              }
              else{
                const results = await player_domain.extractRelevantPlayerData(players_list_filtered_by_season_filterquery_sorted_by_name);
                res.status(200).send(results);
              }
            }
          }
      }
    }
  }
    catch (error) {
    next(error);
  }
});


module.exports = router;
