const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getTeamsByName(team_name) {
  let team_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  team.data.map((team) =>
    team_ids_list.push(team.team_id)
  );
  return team_ids_list;
}

async function getTeamsInfo(team_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/teams/${id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
  );
  let teams_info = await Promise.all(promises);
  return extractRelevantTeamData(teams_info);
}

// function extractRelevantTeamData(teams_info) {
//   return teams_info.map((teams_info) => {
//     const { fullname, image_path, position_id } = teams_info.data.data;
//     const { name } = player_info.data.data.team.data;
//     return {
//       name: fullname,
//       image: image_path,
//       position: position_id,
//       team_name: name,
//     };
//   });
// }

// async function getPlayersByTeam(team_id) {
//   let player_ids_list = await getPlayerIdsByTeam(team_id);
//   let players_info = await getPlayersInfo(player_ids_list);
//   return players_info;
// }

// exports.getPlayersByTeam = getPlayersByTeam;
// exports.getPlayersInfo = getPlayersInfo;
exports.getTeamsByName=getTeamsByName;
