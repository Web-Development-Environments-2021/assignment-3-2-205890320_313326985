var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  try {
    // players details
    const players_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );

    // future and past matches
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "-"
                + currentdate.getMonth()  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
