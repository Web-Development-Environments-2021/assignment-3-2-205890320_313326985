const DButils = require("./DButils");

async function markMatchAsFavorite(user_id, match_id) {
  // check if match id is not in full match table, else append to it.
  const match_ids = await DButils.execQuery(
    `select match_id from RealMatches where match_id='${match_id}'`
  );
  if (match_ids.length == 0){
    await DButils.execQuery(
      `insert into RealMatches values (${match_id})`
    );
  }

  // now, insert match to favoritematches table
  await DButils.execQuery(
    `insert into FavoriteMatches values ('${user_id}',${match_id})`
  );
}

async function getFavoriteMatches(user_id) {
  const match_ids = await DButils.execQuery(
    `select match_id from FavoriteMatches where user_id='${user_id}'`
  );
  return match_ids;
}

exports.markMatchAsFavorite = markMatchAsFavorite;
exports.getFavoriteMatches = getFavoriteMatches;
