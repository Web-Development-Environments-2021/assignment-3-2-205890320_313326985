const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
//const TEAM_ID = "85";

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

// we did the same function with less api requests
// async function getPlayerIdsByTeam(team_id) {
//   let player_ids_list = [];
//   const team = await axios.get(`${api_domain}/teams/${team_id}`, {
//     params: {
//       include: "squad",
//       api_token: process.env.api_token,
//     },
//   });
//   team.data.data.squad.data.map((player) =>
//     player_ids_list.push(player.player_id)
//   );
//   return player_ids_list;
// }

// we did the same function with less api requests
// async function getPlayersInfo(players_ids_list) {
//   let promises = [];
//   players_ids_list.map((id) =>
//     promises.push(
//       axios.get(`${api_domain}/players/${id}`, {
//         params: {
//           api_token: process.env.api_token,
//           include: "team",
//         },
//       })
//     )
//   );
//   let players_info = await Promise.all(promises);
//   return extractRelevantPlayerData(players_info);
// }

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
  return extractRelevantPlayerData(players_info);
}



exports.getPlayersByNameAndTeam=getPlayersByNameAndTeam;
exports.extractRelevantPlayerData=extractRelevantPlayerData;
exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.extractPersonalPagePlayerData = extractPersonalPagePlayerData;
exports.getPlayerById = getPlayerById;



