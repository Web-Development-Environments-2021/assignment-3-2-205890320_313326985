const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const SEASON_ID = 17328;



function extractRelevantPlayerData(players_info) {
    return players_info.map((player_info) => {
      const { fullname, image_path, position_id } = player_info.data.data;
      const { name } = player_info.data.data.team.data;
      return {
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: name,
      };
    });
}
