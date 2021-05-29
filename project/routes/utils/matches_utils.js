const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// async function getMatchesInfo(matches_ids_list) {
//   let promises = [];
//   matches_ids_list.map((id) =>
//     promises.push(
//       axios.get(`${api_domain}/matches/${id}`, {
//         params: {
//           api_token: process.env.api_token,
//           include: "team",
//         },
//       })
//     )
//   );
//   let match_info = await Promise.all(promises);
//   return extractRelevantPlayerData(players_info);
// }

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}


exports.getMatchesInfo = getMatchesInfo;
