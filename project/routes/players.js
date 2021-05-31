var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const player_utils = require("./utils/players_utils");

// gets all relevant (extended) details for specific player id
router.get("/playerFullDetails/:playerId", async (req, res, next) => {
try{
  const player_id = req.params.playerId;
  const player_info = await player_utils.getPlayerById(player_id);
  const results = await player_utils.extractPersonalPagePlayerData(player_info.data.data);
  // returning 0 means error from help function
  if (results==0){
    throw{status:401, message: "This player id is not in our league!"}
  }
  res.status(200).send(results);
}
catch (error) {
  next(error);
}
});
module.exports = router;