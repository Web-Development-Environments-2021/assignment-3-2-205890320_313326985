const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/fixtures/${id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
  );
  return await Promise.all(promises);
}

// async function getMatchInfo(match_id) {
//   return axios.get(`${api_domain}/fixtures/FIXTURE_ID='${match_id}'`, {
//     params: {
//       api_token: process.env.api_token,
//     },
//   })
// }

// function extractRelevantPlayerData(players_info) {
//   return players_info.map((player_info) => {
//     const { fullname, image_path, position_id } = player_info.data.data;
//     const { name } = player_info.data.data.team.data;
//     return {
//       name: fullname,
//       image: image_path,
//       position: position_id,
//       team_name: name,
//     };
//   });
// }

// exports.getMatchInfo = getMatchInfo;