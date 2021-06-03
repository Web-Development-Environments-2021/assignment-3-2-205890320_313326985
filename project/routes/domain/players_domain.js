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
function extractPersonalPagePlayerData(player_info) {
  // return player_info => {
    if(player_info.team.data.current_season_id != 17328){
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

  let players_info = await getPlayersInfo(team_id);

  return players_info;
}


exports.extractRelevantPlayerData=extractRelevantPlayerData;
exports.extractPersonalPagePlayerData=extractPersonalPagePlayerData;
exports.getPlayersByTeam=getPlayersByTeam;