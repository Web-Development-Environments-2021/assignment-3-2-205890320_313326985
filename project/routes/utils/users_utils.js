const DButils = require("./DButils");

// help function to add new favorite match
async function markMatchAsFavorite(user_id, match_id) {
    const match_id_from_table = await DButils.execQuery(
      `select match_id from dbo.Matches where match_id='${match_id}'`
    );
    if (match_id_from_table.length > 0){
      // insert match to favoritematches table
      await DButils.execQuery(
      `insert into dbo.FavoriteMatches values ('${user_id}','${match_id}')`
      );
    }
    else{
      return 0;
    }
  }

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

async function getFavoriteMatches(user_id){
  removeOldMatchesFromFavorites();
  const match_ids = await DButils.execQuery(
      `select match_id 
      from dbo.FavoriteMatches
      where user_id='${user_id}'`
    );
  return match_ids;
}

exports.markMatchAsFavorite=markMatchAsFavorite;
exports.getMatchesInfo = getMatchesInfo;
exports.getFavoriteMatches = getFavoriteMatches;
