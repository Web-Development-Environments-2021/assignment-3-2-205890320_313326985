var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const unionAgent_domain = require("./domain/unionAgent_domain");


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
    const matches = await unionAgent_domain.sortMatches(req.query.sort)
    if( matches == false){
      throw { status: 400, message: "Wrong sort type" };
    }

    res.send(matches);  
  } catch (error) {
    next(error);
  }
});

// add new match to matches table in DB
router.post("/addMatch", async (req, res, next) => {
  try {
    var incorect_value = ""

    // check if the date is valid (only a future date)
    if(!unionAgent_domain.validDate(req.body.date_time)){
      incorect_value += " date"
    }
    
    // check if local_team and visitor_team exist -> and save the id
    const teams_id = await unionAgent_domain.validTeam(req.body.local_team_name, req.body.visitor_team_name);
    if(teams_id == false){
      incorect_value += " teams"
    }

    // check if venue exist -> and save the id
    const venue_id = await unionAgent_domain.validVenue(req.body.venue_name);
    if(venue_id == false){
      incorect_value += " venue"    
    }

    // check if referee exist 
    if (!unionAgent_domain.validReferee(req.body.referee_id)){
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
router.put("/UpdateRefereeMatch", async (req, res, next) => {
  try {
    var incorect_value = ""
    const match_id = parseInt(req.query.match_id);
    const referee_id = parseInt(req.query.referee_id);


    // Check if the match id and referee id exist in the match table
    if (!unionAgent_domain.validMatch(match_id)){
      incorect_value += " match"
    }

    if (!unionAgent_domain.validReferee(referee_id)){
      incorect_value += " referee"
    }

    if (incorect_value.length != 0){
      throw { status: 400, message: "Bad request:" + incorect_value };

    }

    // update the referee id in the matches table
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET referee_id = '${referee_id}'
      WHERE match_id = '${match_id}';`
    );
    
  
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// add event log to match from the matches table in DB
router.post("/addEventsLog", async (req, res, next) => {
  try {
    var incorect_value = "";
    const match_id = parseInt(req.query.match_id);
    const eventLogs = req.body;

    if (!unionAgent_domain.validMatch(match_id)){
      incorect_value += " match"
    }
    for(var i = 0 ; i < eventLogs.length; i++){
      // check if valid date

      // check valid minute

      // check type event

      
      await DButils.execQuery(
        `INSERT INTO dbo.Events (match_id,date_and_time_happend,minute,type) VALUES ('${match_id}', '${eventLogs[i].date_and_time_happend}', '${eventLogs[i].minute}', '${eventLogs[i].type}')`
      );
    }
    
    if (incorect_value.length != 0){
      throw { status: 400, message: "Bad request:" + incorect_value };
    }  

      
    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


// update match score of a match in matches table in DB
router.put("/UpdateResultsMatch", async (req, res, next) => {
  try {
    var incorect_value = "";

    if (!unionAgent_domain.validMatch(req.body.match_id)){
      incorect_value = " match";
    }

    if(!unionAgent_domain.validResults(req.body.home_goals, req.body.away_goals)){
      incorect_value = " results";
    }

    if (incorect_value.length != 0 ){
      throw { status: 400, message: "Bad request:" + incorect_value };
    }
    await DButils.execQuery(
      `UPDATE dbo.Matches
      SET home_goals = '${req.body.home_goals}', away_goals = '${req.body.away_goals}'
      WHERE match_id = '${req.body.match_id}';`
    );

    res.status(201).send("successful operation");
  } catch (error) {
    next(error);
  }
});


module.exports = router;



