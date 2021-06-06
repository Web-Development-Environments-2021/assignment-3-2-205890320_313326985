const DButils = require("../utils/DButils");
const matches_domain = require("../domain/matches_domain");

async function getFavoriteMatchesIDs(user_id){
    await removeOldMatchesFromFavorites();
    const match_ids = await DButils.execQuery(
        `select match_id 
        from dbo.FavoriteMatches
        where user_id='${user_id}'`
      );
    return match_ids;
}

async function markFavorites(user_id, match_id,future_match_id_from_table){
    // if requested match is a future match
    if(future_match_id_from_table.includes(match_id)){
      const favoriteMatchIDs = await getFavoriteMatchesIDs(user_id);
      if(favoriteMatchIDs.includes(match_id)){
        return -1;
      }
      else{
        await DButils.execQuery(
          `insert into dbo.FavoriteMatches values ('${user_id}','${match_id}')`
          );
      }
    }
    else{
      return 0;
    }
}

async function removeOldMatchesFromFavorites(){
  var currentdate = new Date();
  // get all of the old matches
  var oldMatches = await DButils.execQuery(
    `select match_id,date_time
    from dbo.Matches`
  );
  // format date_time
  oldMatches.forEach(function(match, i) {
    match.date_time = matches_domain.formatDateTime(match.date_time)
  })
  // filter date_time by past to current date
  oldMatches = oldMatches.filter(function(match){
    return Date.parse(match.date_time) <= Date.parse(currentdate);
  })
    
  const oldMatchesIDs= getIDsFromMatches(oldMatches);

  // delete old matches from favorite
  for(var i=0; i<oldMatchesIDs.length; i++){
    await DButils.execQuery(
      `DELETE
      from dbo.FavoriteMatches
      where match_id = '${oldMatchesIDs[i]}'`
    );
  }
  
}

async function getIDsFromMatches(Matches){
// get all relevant oldmatches id's
  let MatchesIDs = [];
  Matches.map((Match) =>
  MatchesIDs.push(Match.match_id)
  );
  await Promise.all(MatchesIDs);
  return MatchesIDs;

}


exports.getFavoriteMatchesIDs = getFavoriteMatchesIDs;
exports.markFavorites = markFavorites;

