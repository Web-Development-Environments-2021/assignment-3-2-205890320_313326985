const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./utils/DButils");

async function getMatchesInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
        DButils.execQuery(
            `select match_id,date_time,local_team_id,visitor_team_id,venue_id,referee_id,home_goals,away_goals from dbo.Matches where match_id='${id}'`
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

exports.getFavoriteMatches = getFavoriteMatches;
exports.getMatchesInfo = getMatchesInfo;