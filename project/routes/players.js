var express = require("express");
var router = express.Router();
const player_domain = require("../routes/domain/players_domain");


// gets all relevant (extended) details for specific player id
router.get("/playerFullDetails/:playerId", async (req, res, next) => {
try{
  const player_id = req.params.playerId;
  // sanity check
  if(!(/^[0-9]+$/.test(player_id))){
    throw{status:400, message: "This is not a valid player id!"}
  }
  // const player_info = await player_utils.getPlayerById(player_id);
  const results = await player_domain.extractPersonalPagePlayerData(player_id);
  // returning 0 means error from help function
  if (results==0){
    throw{status:400, message: "This player id is not in our league!"}
  }
  res.status(200).send(results);
}
catch (error) {
  next(error);
}
});

module.exports = router;
