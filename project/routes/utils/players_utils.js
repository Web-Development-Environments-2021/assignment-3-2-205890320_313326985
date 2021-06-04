const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


// get players by name typed in query, include team in http req'
async function getPlayersByNameAndTeam(player_name){
  let player_info_list = [];
  const players = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include:'team'
    },
  });
  players.data.data.map((player_info) =>
    player_info_list.push(player_info)
  );
  return player_info_list;
}

async function getPlayerById(player_id){
  const player = await axios.get(`${api_domain}/players/${player_id}`, {
    params: {
      api_token: process.env.api_token,
      include : 'team'
    },
  });
  return player;
}

async function getPlayersInfo(team_id){
  let players_info = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad.player.team",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    players_info.push(player.player.data)
  );
  return players_info;
}

exports.getPlayersByNameAndTeam=getPlayersByNameAndTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerById = getPlayerById;



