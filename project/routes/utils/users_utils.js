const DButils = require("./DButils");
const matches_utils = require("./matches_utils");

// help function to add new favorite match
async function markMatchAsFavorite(user_id, match_id) {
    const future_match_id_from_table = await matches_utils.getFutureMatchesIDs();
    // if requested match is a future match
    if(match_id in future_match_id_from_table){
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
  await removeOldMatchesFromFavorites();
  const match_ids = await DButils.execQuery(
      `select match_id 
      from dbo.FavoriteMatches
      where user_id='${user_id}'`
    );
  return match_ids;
}

async function removeOldMatchesFromFavorites(){
  // await DButils.execQuery(
  //   `DELETE
  //   from dbo.FavoriteMatches
  //   where match_id
  //   in(
  //     select match_id
  //     from dbo.Matches
  //     where date_time < GETDATE()
  //   )`
  // );

  var currentdate = new Date();
  // get all of the old matches
  var oldMatches = await DButils.execQuery(
    `select match_id,date_time
    from dbo.Matches`
  );
  // format date_time
  oldMatches.forEach(function(match, i) {
    match.date_time = formatDateTime(match.date_time)
    
  })
  // filter date_time by past to current date
  oldMatches = oldMatches.filter(function(match){
    return Date.parse(match.date_time) <= Date.parse(currentdate);
  })
  // get all relevant oldmatches id's
  let oldMatchesIDs = [];
  oldMatchesIDs.map((oldMatch) =>
    promises.push(oldMatch.match_id)
  );
  await Promise.all(oldMatchesIDs);
  // delete old matches from favorite
  await DButils.execQuery(
    `DELETE
    from dbo.FavoriteMatches
    where match_id
    in(
      ${oldMatchesIDs}
    )`
  );
}





exports.markMatchAsFavorite=markMatchAsFavorite;
exports.getMatchesInfo = getMatchesInfo;
exports.getFavoriteMatches = getFavoriteMatches;
