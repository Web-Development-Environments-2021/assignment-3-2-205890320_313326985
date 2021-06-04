const users_utils = require("../utils/users_utils");

async function getFutureMatchesIDs(user_id){
    return await users_utils.getFavoriteMatches(user_id);
}

async function getInfoAboutMatches(match_ids_array){
    return await users_utils.getMatchesInfo(match_ids_array);
}

async function markFavorites(user_id, match_Id_from_body){
    return await users_utils.markMatchAsFavorite(user_id, match_Id_from_body);
}

exports.getFutureMatchesIDs = getFutureMatchesIDs;
exports.getInfoAboutMatches = getInfoAboutMatches;
exports.markFavorites = markFavorites;

