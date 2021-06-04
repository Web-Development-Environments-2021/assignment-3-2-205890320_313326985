const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
//const SEASON_ID = 17328;

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


async function getMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
        DButils.execQuery(
            `select match_id,date_time,local_team_id,visitor_team_id,venue_id 
            from dbo.Matches 
            where match_id='${id}'`
        )
    )
  );
  return await Promise.all(promises);
}
//----------------------------------------------//



// get from list of match ids matches with their info, to stage matches page
async function getPastMatchesWithInfoByIDsAndEvents(){
  const pastmatches = await DButils.execQuery(
    `select * 
    from dbo.Matches 
    where date_time < GETDATE() and match_id 
    in(
      select match_id 
      from dbo.Events 
      group by match_id 
      having count(event_id)>2 
    )`
  );
  return pastmatches;
}


//----------------------------------------------//
// exports.getAllMatchesID = getAllMatchesID;
exports.getMatchesInfo = getMatchesInfo;
//----------------------------------------------//

exports.getPastMatchesWithInfoByIDsAndEvents = getPastMatchesWithInfoByIDsAndEvents;


