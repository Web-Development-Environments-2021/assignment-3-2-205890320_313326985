const DButils = require("../utils/DButils");

async function getPastMatchesForStageMatches(){
    const oldMatches = await getPastMatches();
    // for each old match object
    // add if it has more than 2 event-logs
    const relevantMatchIDs=await getIDsOfMatchesWithThreeEventsOrMore();
    for(var i=0; i< oldMatches.length; i++){
      // remove non-relevant objects
      if(!(relevantMatchIDs.includes(oldMatches[i].match_id))){
        oldMatches.splice(i,1);
      }
      // add events to relevant objects
      else{
        oldMatches[i].events= await getEventsOfPastMatch(oldMatches[i].match_id);
      }
    }
    return oldMatches;
}

function validDate(date){
    var isDate;
    var currentdate = new Date();
    var matches = date.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    var date_time = Date.parse(date);
  
    if(matches == null){
      isDate = false;
    }
    else if(isNaN(date_time) || date_time <= currentdate){
      isDate = false;
    }
    else{
      isDate = true;
    }
    return isDate;
  }

  function formatDateTime(date_time){
    var datetime = new Date(date_time).toISOString().slice(0,19).replace('T', ' ');
    return datetime;
  }



function validResults(home, away){
  if(!Number.isInteger(home) || !Number.isInteger(away)){
    return false;
  }
  else if(home < 0 || away < 0){
    return false;
  }
  else{
    return true;
  }
}
async function sortMatches(sortType){
  const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );
    
    // sort by match id
    if (sort == 'none'){
      matches.sort((a,b) => a.match_id - b.match_id);
    }

    // sort by date time descending 
    else if (sort == 'Date'){
      matches.sort((a,b) => b.date_time - a.date_time);
    }

    // sort by local tam id ascending
    else if (sort == 'Teams'){
      matches.sort((a,b) => ((a.local_team_name).localeCompare(b.local_team_name)));
    }
    else{
        return false;
    }
    return matches;
}
async function validMatch(match_id){
  const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );
  if (matches.find((x) => x.match_id === match_id)){
      return true;
  }
  else{
      return false;
  }
}

async function addMatchDB(date_time, local_team_id, local_team_name, visitor_team_id, visitor_team_name, venue_id, venue_name, referee_id){
    await DButils.execQuery(
      `INSERT INTO dbo.Matches (date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id) VALUES ('${date_time}', '${local_team_id}','${local_team_name}', '${visitor_team_id}', '${visitor_team_name}','${venue_id}','${venue_name}','${referee_id}')`
  );
  }

  async function updateRefereeDB(referee_id, match_id){
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET referee_id = '${referee_id}'
      WHERE match_id = '${match_id}';`
    );
  }

  async function updateResultsDB(match_id, home_goals, away_goals){
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET home_goals = '${home_goals}', away_goals = '${away_goals}'
      WHERE match_id = '${match_id}';`
    );
  }

  
async function getFutureMatches(){
    var currentdate = new Date();
    var futureMatches = await DButils.execQuery(
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name
        from dbo.Matches`
    );
    futureMatches.forEach(function(match, i) {
        match.date_time = formatDateTime(match.date_time)

    })

    futureMatches = futureMatches.filter(function(match){
        return Date.parse(match.date_time) > Date.parse(currentdate);
    })
    return futureMatches;
  }


async function getPastMatches(){
    var currentdate = new Date();
    var pastMatches = await DButils.execQuery(
        `select match_id,date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,home_goals, away_goals
        from dbo.Matches`
    );
    pastMatches.forEach(function(match, i) {
        match.date_time = formatDateTime(match.date_time)

    })
    pastMatches = pastMatches.filter(function(match){
        return Date.parse(match.date_time) <= Date.parse(currentdate);
    })

    return pastMatches;

}
async function getPastMatchWithoutResult(){
    var MatchesWithoutResults = await getPastMatches();
    MatchesWithoutResults = MatchesWithoutResults.filter(function(match){
        return match.home_goals == null && match.away_goals == null;
    })
    return MatchesWithoutResults;
}

async function nextMatchPlanned(){
    var futureMatches = await getFutureMatches();
    next_match = futureMatches.sort((a,b) => a.date_time - b.date_time);

    return next_match[0];
}

async function getEventsOfPastMatch(match_id){
  return await DButils.execQuery(
    `select * 
     from dbo.Events 
     where match_id = ${match_id}`
  );
}

// get event matches with their info, to stage matches page
async function getIDsOfMatchesWithThreeEventsOrMore(){
  return await DButils.execQuery(
    `select match_id
     from dbo.Events
     where event_id in(
     select match_id
     from dbo.Events 
     group by match_id 
     having count(event_id)>2
     )`
  );
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

async function getFutureMatchesIDs(){
  const futureMatches = await getFutureMatches();
  let promises = [];
  futureMatches.map((futurematch) =>
    promises.push(futurematch.match_id)
  );
  return await Promise.all(promises);
}

exports.validDate = validDate;
exports.formatDateTime = formatDateTime;
exports.validResults = validResults;
exports.sortMatches = sortMatches;
exports.validMatch = validMatch;
exports.addMatchDB = addMatchDB;
exports.updateRefereeDB = updateRefereeDB;
exports.updateResultsDB = updateResultsDB;
exports.getFutureMatches=getFutureMatches;
exports.getPastMatchWithoutResult=getPastMatchWithoutResult
exports.getPastMatchesForStageMatches = getPastMatchesForStageMatches;
exports.getPastMatches=getPastMatches;
exports.getPastMatchWithoutResult=getPastMatchWithoutResult;
exports.nextMatchPlanned=nextMatchPlanned;
exports.getEventsOfPastMatch = getEventsOfPastMatch;
exports.getIDsOfMatchesWithThreeEventsOrMore = getIDsOfMatchesWithThreeEventsOrMore;
exports.getMatchesInfo=getMatchesInfo;
exports.getFutureMatchesIDs=getFutureMatchesIDs;