var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const team_utils = require("./utils/teams_utils");


router.get("/Teams", async (req, res, next) => {
  const team_name_to_search = req.query.query;
  const sort_way = req.query.sort;
  const team_ids_list = await team_utils.getTeamsByName(team_name_to_search);
});



router.get("/Players", async (req, res, next) => {
  const player_name_to_search = req.query.query;
  const sort_way = req.query.sort;
});




module.exports = router;
