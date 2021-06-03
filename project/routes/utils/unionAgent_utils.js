const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const league_utils = require("./league_utils");

async function getVenuesBySeason() {
    let venues_list = [];
    const season_id = await league_utils.getCurrentSeasonID();
    const venues = await axios.get(`${api_domain}/venues/season/${season_id}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    venues.data.data.map((venue_info) =>
        venues_list.push({"id":venue_info.id, "name":venue_info.name})
    );
    return venues_list;
  }

exports.getVenuesBySeason = getVenuesBySeason;