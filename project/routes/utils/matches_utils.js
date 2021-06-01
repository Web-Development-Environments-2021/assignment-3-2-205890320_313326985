const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const SEASON_ID = 17328;


// TODO : check why dont work
async function getAllMatchesID(){
  let matches_ids_list = [];
  const match = axios.get(`${api_domain}/seasons/${SEASON_ID}`, {
    params: {
      api_token: process.env.api_token,
      include: "fixtures",
    },
  });
  match.data.feaxtures.data.map((match) =>
    matches_ids_list.push(match.match_id)
  );
  return matches_ids_list
}

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

async function getMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
        DButils.execQuery(
            `select match_id,date_time,local_team_id,visitor_team_id,venue_id from dbo.Matches where match_id='${id}'`
        )
    )
  );
  return await Promise.all(promises);
}

async function getFavoriteMatches(user_id){
    const match_ids = await DButils.execQuery(
        `select match_id from dbo.FavoriteMatches where user_id='${user_id}'`
      );
    return match_ids;
}

async function getPastMatchesIDs(){
  const pastIDs = await DButils.execQuery(
    `select match_id from dbo.Matches where date_time < GETDATE()`
  );
  return pastIDs;
}

async function getPastMatchesWith3orMoreEventLogs(){
  const pastMatches = await DButils.execQuery(
    `select count(event_id) from dbo.Events group by match_id'`
  );
  
}


exports.getAllMatchesID = getAllMatchesID;
exports.getMatchesInfo = getMatchesInfo;
exports.getFavoriteMatches = getFavoriteMatches;
