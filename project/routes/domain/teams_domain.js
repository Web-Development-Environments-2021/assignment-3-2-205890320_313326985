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
      return team_list_filtered_by_season_sorted_by_name;
    }
    // sort by team name, descending
    else if(sort_way == "desc"){
      team_list_filtered_by_season_sorted_by_name.sort((a,b) => ((b.name).localeCompare(a.name)));
      return team_list_filtered_by_season_sorted_by_name;
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
}

async function searchForTeamsInOurSeason(team_list){
  const team_list_filtered_by_season=[];
  // push all teams to arr by specific season
  for(var i=0; i<team_list.length; i++){
    if (team_list[i].current_season_id == 17328){
      team_list_filtered_by_season.push(team_list[i]);
    }
  }
  if(team_list_filtered_by_season.length == 0){
    throw{status: 204, message: "There is no content to send for this request"};
  }
  return team_list_filtered_by_season;
}


exports.SortTeams = SortTeams;
exports.extractRelevantTeamData = extractRelevantTeamData;
exports.searchForTeamsInOurSeason = searchForTeamsInOurSeason;