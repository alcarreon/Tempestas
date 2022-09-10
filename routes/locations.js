const express = require("express");
const router = express.Router();
const locationController = require("../controllers/Location");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, locationController.getLocations);

router.post("/createLocation", locationController.createLocation);
//router.post("/getForecast", locationController.getForecast);

router.delete("/deleteLocation", locationController.deleteLocation);

router.put("/checkedLocation", locationController.checked);

module.exports = router;
