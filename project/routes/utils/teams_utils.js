const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getTeamsByName(team_name) {
  let team_info_list = [];
  const teams = await axios.get(`${api_domain}/teams/search/${team_name}`, {
    params: {
      api_token: process.env.api_token,
      include:'season'
    },
  });
  teams.data.data.map((team_info) =>
    team_info_list.push(team_info)
  );
  return team_info_list;
}

// async function getTeamsInfo(team_ids_list) {
//   let promises = [];
//   players_ids_list.map((id) =>
//     promises.push(
//       axios.get(`${api_domain}/teams/${id}`, {
//         params: {
//           api_token: process.env.api_token,
//         },
//       })
//     )
//   );
//   let teams_info = await Promise.all(promises);
//   return extractRelevantTeamData(teams_info);
// }

function extractRelevantTeamData(teams_info) {
  return teams_info.map((team) => {
    const { name, logo_path} = team;
    return {
      "team name": name,
      "logo path": logo_path,
    };
  });
}

// async function getPlayersByTeam(team_id) {
//   let player_ids_list = await getPlayerIdsByTeam(team_id);
//   let players_info = await getPlayersInfo(player_ids_list);
//   return players_info;
// }

// exports.getPlayersByTeam = getPlayersByTeam;
// exports.getPlayersInfo = getPlayersInfo;
exports.getTeamsByName=getTeamsByName;
exports.extractRelevantTeamData=extractRelevantTeamData;
