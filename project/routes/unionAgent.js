var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_utils = require("./utils/teams_utils");
const unionAgent_utils = require("./utils/unionAgent_utils");

/**
 * Authenticate all incoming requests by middleware
 */
//  router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id, union_agent FROM dbo.Users WHERE union_agent=1")
//       .then((users) => {
//         if (users.find((x) => x.user_id === req.session.user_id)) {
//           req.user_id = req.session.user_id;
//           next();
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });


// send all matches of union agent
router.get("", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT * FROM dbo.Matches"
    );
    const sort = req.query.sort;
    
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
      throw { status: 400, message: "Wrong sort type" };
    }

    res.send(matches);  
  } catch (error) {
    next(error);
  }
});

///---------domain-------///



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


async function validTeam(local_team, visitor_team){
  const teams = await teams_utils.getTeamsBySeason();
  const local_team_id = teams.find(x => x.name === local_team)
  const visitor_team_id = teams.find(x => x.name === visitor_team)

  if(local_team_id == null || visitor_team_id == null || local_team_id.id == visitor_team_id.id){
    return false;
  }
  else{
    return {"local": local_team_id.id, "visitor": visitor_team_id.id}
  }

}


async function validVenue(venue){
  const venues = await unionAgent_utils.getVenuesBySeason();
  const venue_id = venues.find(x => x.name === venue)
  if(venue_id == null){
    return false;
  }
  else{
    return venue_id.id;
  }

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

async function validReferee(referee){
  const referees = await DButils.execQuery(
    "SELECT referee_id FROM dbo.Referees"
  );
  if (referees.find((x) => x.referee_id === referee) == null){
    false;
  }
  else{
    true;
  }

}


// add new match to matches table in DB
router.post("/addMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    var incorect_value = ""

    // check if the date is valid (only a future date)
    if(!validDate(req.body.date_time)){
      incorect_value += " date"
    }
    
    // check if local_team and visitor_team exist -> and save the id
    const teams_id = await validTeam(req.body.local_team_name, req.body.visitor_team_name);
    if(teams_id == false){
      incorect_value += " teams"
    }

    // check if venue exist -> and save the id
    const venue_id = await validVenue(req.body.venue_name);
    if(venue_id == false){
      incorect_value += " venue"    
    }

    // check if referee exist 
    if (!validReferee(req.body.referee_id)){
      incorect_value += " referee"  
    }

    if (message.length != 0){
      throw { status: 400, message: "Bad request:" + incorect_value };
    }

    // insert match to matches table
    await DButils.execQuery(
      `INSERT INTO dbo.Matches (date_time,local_team_id,local_team_name,visitor_team_id,visitor_team_name,venue_id,venue_name,referee_id) VALUES ('${req.body.date_time}', '${teams_id.local}','${req.body.local_team_name}', '${teams_id.visitor}', '${req.body.visitor_team_name}','${venue_id}','${req.body.venue_name}','${req.body.referee_id}')`
  );

    res.status(201).send("The match successfully saved to the system");
  } catch (error) {
    next(error);
  }
});

// add referee to matche from the matches table in DB
router.post("/ConnectRefereeToMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const referees = await DButils.execQuery(
      "SELECT referee_id FROM dbo.Referees"
    );
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.query.match_id);
    const referee_id = parseInt(req.query.referee_id);


    // Check if the match id and referee id exist in the match table
    if (matches.find((x) => x.match_id === match_id) && referees.find((x) => x.referee_id === referee_id)){
      // update the referee id in the matches table
      await DButils.execQuery(
        `UPDATE dbo.Matches
        SET referee_id = '${referee_id}'
        WHERE match_id = '${match_id}';`
      );
    }
    else{
      throw { status: 400, message: "it is not a valid match ID or not valid referee ID" };
    }
      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// add event log to match from the matches table in DB
router.post("/addEventsLog", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.query.match_id);
    const eventLogs = req.body;

    if (matches.find((x) => x.match_id === match_id)){
      for(var i = 0 ; i < eventLogs.length; i++){
        const x = req.body[i].date_and_time_happend;
        await DButils.execQuery(
          `INSERT INTO dbo.Events (match_id,date_and_time_happend,minute,type) VALUES ('${match_id}', '${eventLogs[i].date_and_time_happend}', '${eventLogs[i].minute}', '${eventLogs[i].type}')`
        );
      }
    }
    else{
      throw { status: 400, message: "	it is not a valid match ID" };
    }  

      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// update match score of a match in matches table in DB
router.put("/UpdateResultsToMatch", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    const matches = await DButils.execQuery(
      "SELECT match_id FROM dbo.Matches"
    );

    const match_id = parseInt(req.body.match_id);

    if (matches.find((x) => x.match_id === match_id)){
      await DButils.execQuery(
        `UPDATE dbo.Matches
        SET home_goals = '${req.body.home_goals}', away_goals = '${req.body.away_goals}'
        WHERE match_id = '${match_id}';`
      );
    }
    else{
      throw { status: 400, message: "	it is not a valid match ID" };
    }  

      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


module.exports = router;



