const DButils = require("../utils/DButils");
const teams_utils = require("../utils/teams_utils");
const unionAgent_utils = require("../utils/unionAgent_utils");

function validDate(date){
    var isDate;
    var currentdate = new Date();
    var matches = date.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    var date_time = Date.parse(date);
  
    if(matches == null){
      isDate = false;
    }
    else if(isNaN(date_time) || date_time <= currentdate){
      isDate = false;
    }
    else{
      isDate = true;
    }
    return isDate;
  }
  
  
  async function validTeam(local_team, visitor_team){
    const teams = await teams_utils.getTeamsBySeason();
    const local_team_id = teams.find(x => x.name === local_team)
    const visitor_team_id = teams.find(x => x.name === visitor_team)
  
    if(local_team_id == null || visitor_team_id == null || local_team_id.id == visitor_team_id.id){
      return false;
    }
    else{
      return {"local": local_team_id.id, "visitor": visitor_team_id.id}
    }
  
  }
  
  
  async function validVenue(venue){
    const venues = await unionAgent_utils.getVenuesBySeason();
    const venue_id = venues.find(x => x.name === venue)
    if(venue_id == null){
      return false;
    }
    else{
      return venue_id.id;
    }
  
  }
  
  function validResults(home, away){
    if(!Number.isInteger(home) || !Number.isInteger(away)){
      return false;
    }
    else if(home < 0 || away < 0){
      return false;
    }
    else{
      return true;
    }
  }
  
  async function validReferee(referee){
    const referees = await DButils.execQuery(
      "SELECT referee_id FROM dbo.Referees"
    );
    if (referees.find((x) => x.referee_id === referee) == null){
      false;
    }
    else{
      true;
    }
  
  }


  async function sortMatches(sortType){
    const matches = await DButils.execQuery(
        "SELECT * FROM dbo.Matches"
      );
      
      // sort by match id
      if (sort == 'none'){
        matches.sort((a,b) => a.match_id - b.match_id);
      }
  
      // sort by date time descending 
      else if (sort == 'Date'){
        matches.sort((a,b) => b.date_time - a.date_time);
      }
  
      // sort by local tam id ascending
      else if (sort == 'Teams'){
        matches.sort((a,b) => ((a.local_team_name).localeCompare(b.local_team_name)));
      }
      else{
          return false;
      }
      return matches;
  }

  async function validMatch(match_id){
    const matches = await DButils.execQuery(
        "SELECT match_id FROM dbo.Matches"
      );

    if (matches.find((x) => x.match_id === match_id)){
        return true;
    }
    else{
        return false;
    }

  }
  

  exports.validDate = validDate;
  exports.validTeam = validTeam;
  exports.validVenue = validVenue;
  exports.validResults = validResults;
  exports.validReferee = validReferee;
  exports.sortMatches = sortMatches;
  exports.validMatch = validMatch;