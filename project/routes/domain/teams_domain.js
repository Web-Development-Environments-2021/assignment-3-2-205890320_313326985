const teams_utils = require("../utils/teams_utils");
const league_utils = require("../utils/league_utils");

function extractRelevantTeamData(teams_info) {
    return teams_info.map((team) => {
      const { name, logo_path} = team;
      return {
        "team name": name,
        "logo path": logo_path,
      };
    });
}

async function SortTeams(team_list_filtered_by_season_sorted_by_name,sort_way){
  if(/^[A-Za-z]+$/.test(sort_way)){
    // sort by team name, ascending
    if(sort_way == "asc"){
      team_list_filtered_by_season_sorted_by_name.sort((a,b) => ((a.name).localeCompare(b.name)));
      // return team_list_filtered_by_season_sorted_by_name;
    }
    // sort by team name, descending
    else if(sort_way == "desc"){
      team_list_filtered_by_season_sorted_by_name.sort((a,b) => ((b.name).localeCompare(a.name)));
      // return team_list_filtered_by_season_sorted_by_name;
    }
    // if query is only letters, but invalid
    else if(sort_way != "none"){
      return -2;
    }
  }
  // wrong parameter, send status fail
  else{
    return -1;
  }
}

async function searchForTeamsInOurSeason(team_name_to_search){
  const team_list = await teams_utils.getTeamsByName(team_name_to_search);
  const team_list_filtered_by_season=[];
  // get current season
  const current_season_id =await league_utils.getCurrentSeasonID();
  // push all teams to arr by specific season
  for(var i=0; i<team_list.length; i++){
    if (team_list[i].current_season_id == current_season_id){
      team_list_filtered_by_season.push(team_list[i]);
    }
  }
  if(team_list_filtered_by_season.length == 0){
    return 0;
  }
  return team_list_filtered_by_season;
}

async function getRelevantTeams(){
  return teams_utils.getTeamsBySeason();
}

async function validTeamNames(local_team, visitor_team){
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

async function validTeamID(team_id){
  const teams = await teams_utils.getTeamsBySeason();
  return teams.find(x => x.id === team_id)
}

async function getTeamInfoById(teamId){
  var team_info = await teams_utils.getTeamInfoById(teamId);
  team_info = extractRelevantTeamData(team_info);
  return team_info;
}


exports.SortTeams = SortTeams;
exports.extractRelevantTeamData = extractRelevantTeamData;
exports.searchForTeamsInOurSeason = searchForTeamsInOurSeason;
exports.getRelevantTeams = getRelevantTeams;
exports.validTeamNames = validTeamNames;
exports.validTeamID=validTeamID;
exports.getTeamInfoById=getTeamInfoById;