const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const SEASON_ID = 17328;


async function removeOldMatchesFromFavorites(){
  await DButils.execQuery(
    `DELETE
    from dbo.FavoriteMatches
    where match_id
    in(
      select match_id
      from dbo.Matches
      where date_time < GETDATE()
    )`
  );
}



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

async function getFutureMatches(){
  const futureMatches = await DButils.execQuery(
    `select match_id,date_time,local_team_id,visitor_team_id,venue_id 
    from dbo.Matches
    where date_time > GETDATE()`
  );
  return futureMatches;
}



exports.getPastMatchesWithInfoByIDsAndEvents = getPastMatchesWithInfoByIDsAndEvents;
exports.getFutureMatches=getFutureMatches;

