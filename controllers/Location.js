
//location model to let database expect certain objects.
// const LocationSchema = new mongoose.Schema({
//   zip: {
//     type: Number,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   days: [],
//   checked: { type: Boolean, default: false },
// });

//default model 
// const DefaultSchema = new mongoose.Schema({
//   zip: {
//     type: Number,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   days: [],
//   checked: { type: Boolean, 
//              default: false },
// default : {
//     type : Boolean,
//     default: true
// }

// });




//lets fetches happen on server side? fetch w/ node.js
const fetch = require("node-fetch");

//passes the location of the expectations of the location model above  
const Locations = require("../models/Location");

//passes the location of the expectations of the default model above  
const Default = require('../models/Default')
// const moment = require("moment");






//export module expectations
module.exports = {
  getLocations: async (req, res) => {
    // console.log(req.user);
    try {
      //wait to hear user ID
      const aLocation = await Locations.find({ userId: req.user.id });
      const itemsLeft = await Locations.countDocuments({ userId: req.user.id });
      // console.log('this should be the default location');

      //we don't need to check the user ID to access the default, shoukd .find by something different 
      const defaultLocation = await Default.find({userId: req.user.id})
      // console.log(defaultLocation);
      res.render("location.ejs", {
        todos: aLocation,
        user: req.user,
        defaults: defaultLocation

      });
    } catch (err) {
      console.log(err);
    }
  },


  //
  createLocation: async (req, res) => {
    // console.log(req.body);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.body.zipLocation}?key=${process.env.API_KEY}`;
    // console.log(url)
    let response = await fetch(url);
    let data = await response.json();
    // console.log(moment().format("L"));
    console.log(data);
    // console.log(today);
    // let lastDate = today.add(13, "days").format("L");
    // console.log(lastDate);
    // console.log(data.days.length)
    let days = data.days.map((x) => x.datetime);
    console.log("this is the max " + data.days[0].tempmax);
    console.log("this is the min " + data.days[0].tempmin);
    try {
      await Locations.create({
        zip: req.body.zipLocation,
        userId: req.user.id,
        days: data.days,
      });
      console.log("Location has been added!");
      res.redirect("/location");
    } catch (err) {
      console.log(err);
    }
  },
  deleteLocation: async (req, res) => {
    // console.log(req.body.locationIdFromJSFile);
    try {
      await Locations.findOneAndDelete({ _id: req.body.locationIdFromJSFile });
      console.log("Deleted Location");
      res.json("Deleted It");
    } catch (err) {
      console.log(err);
    }
  },
  checked: async (req, res) => {
    console.log(req.body.locationIdFromJSFile);
    console.log(req.body.zipFromJSFile);
    try {
      await Locations.updateOne(
        {
          _id: req.body.locationIdFromJSFile,
          zip: req.body.zipFromJSFile,
        },
        {
          $set: {
            checked: true,
          },
        }
      );

      await Locations.updateMany(
        {
          _id: { $ne: req.body.locationIdFromJSFile },
        },
        {
          $set: {
            checked: false,
          },
        }
      );

      // await Locations.updateMany(
      //   {
      //     _id: { $not: req.body.locationIdFromJSFile },
      //     zip: { $not: req.body.zipLocation },
      //   },
      //   {
      //     $set: {
      //       checked: false,
      //     },
      //   }
      // );
      console.log("Location checked");
      res.json("Checked in");
    } catch (err) {
      console.log(err);
    }

    // try {
    //   await Locations.updateMany(
    //     {
    //       checked : true
    //     },
    //     {
    //       $set: {
    //         checked: true,
    //       },
    //     }
    //   );
    //   console.log("Location checked");
    //   res.json("Checked in");
    // } catch (err) {
    //   console.log(err);
    // }
  },
};
