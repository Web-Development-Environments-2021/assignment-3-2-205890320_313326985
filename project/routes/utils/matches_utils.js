const DButils = require("./DButils");
const matches_domain = require("../domain/matches_domain");

//----------------------------------------------//
// TODO : check why dont work
// async function getAllMatchesID(){
//   let matches_ids_list = [];
//   const match = axios.get(`${api_domain}/seasons/${SEASON_ID}`, {
//     params: {
//       api_token: process.env.api_token,
//       include: "fixtures",
//     },
//   });
//   match.data.feaxtures.data.map((match) =>
//     matches_ids_list.push(match.match_id)
//   );
//   return matches_ids_list
// }


//----------------------------------------------//






//----------------------------------------------//
// exports.getAllMatchesID = getAllMatchesID;
exports.getMatchesInfo = getMatchesInfo;
//----------------------------------------------//
exports.getFutureMatchesIDs=getFutureMatchesIDs;


