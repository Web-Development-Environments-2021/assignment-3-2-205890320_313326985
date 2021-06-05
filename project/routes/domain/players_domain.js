const player_utils = require("../utils/players_utils");
const league_utils = require("../utils/league_utils");
// get current season
const current_season_id = league_utils.getCurrentSeasonID();

// get from data we have got from http req' the relevant to response
function extractRelevantPlayerData(players_info) {
    return players_info.map((player_info) => {
      const { fullname, player_id, image_path, position_id } = player_info;
      const { name } = player_info.team.data;
      return {
        name: fullname,
        id: player_id,
        image: image_path,
        position: position_id,
        team_name: name,
      };
    });
  }
  
  // get from data we have got from http req', data for personal page
async function extractPersonalPagePlayerData(player_id) {

    const player_info = (await player_utils.getPlayerById(player_id)).data.data;
    // // get current season
    // const current_season_id = league_utils.getCurrentSeasonID();

    if(player_info.team.data.current_season_id != current_season_id){
      return 0;
    }
    const {fullname,image_path,position_id,common_name,nationality,birthdate,birthcountry,height,weight} = player_info;
    const { name } = player_info.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      common_name: common_name,
      nationality: nationality,
      birth_date: birthdate,
      birth_country: birthcountry,
      height:height,
      weight:weight
    };
};
  
async function getPlayersByTeam(team_id) {
  // Naor's 
  //let player_ids_list = await getPlayerIdsByTeam(team_id);
  //let players_info = await getPlayersInfo(player_ids_list);

  var players_info = await player_utils.getPlayersInfo(team_id);
  players_info = extractRelevantPlayerData(players_info);

  return players_info;
}

async function searchForPlayersInOurSeason(player_name_to_search){
  const players_list = await player_utils.getPlayersByNameAndTeam(player_name_to_search);
  const players_list_filtered_by_season=[];
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
    if (players_list[i].team.data.current_season_id == current_season_id){
      players_list_filtered_by_season.push(players_list[i]);
    }
  }

  if(players_list_filtered_by_season.length == 0){
    return 0;
  }
  return players_list_filtered_by_season;
}

async function filterPlayers(filter_way,query_to_filter_players,players_list_filtered_by_season){
  const players_list_filtered_by_season_filterquery=[];
  // filter by team name
  if(filter_way == "team name"){
    if(query_to_filter_players == undefined){
      return -1;
    }
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
    if(query_to_filter_players == undefined){
      return -2;
    }
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
    return -3;
  }
  if(players_list_filtered_by_season_filterquery.length == 0){
    return -4;
  }
  else{
    return players_list_filtered_by_season_filterquery;
  }
}

async function sortPlayers(sort_way,players_list_filtered_by_season_filterquery_sorted_by_name){
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
}


exports.extractRelevantPlayerData=extractRelevantPlayerData;
exports.extractPersonalPagePlayerData=extractPersonalPagePlayerData;
exports.getPlayersByTeam=getPlayersByTeam;
exports.searchForPlayersInOurSeason=searchForPlayersInOurSeason;
exports.filterPlayers=filterPlayers;
exports.sortPlayers=sortPlayers;