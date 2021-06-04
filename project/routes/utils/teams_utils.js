const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

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

async function getTeamsInfo() {
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

async function getTeamInfoById(id) {
  let teams_info = []
  let team_info = await axios.get(`${api_domain}/teams/${id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
  teams_info.push(team_info.data.data);
  return extractRelevantTeamData(teams_info);
}



exports.getTeamsByName=getTeamsByName;
exports.getTeamsInfo=getTeamsInfo;
exports.getTeamInfoById=getTeamInfoById;
