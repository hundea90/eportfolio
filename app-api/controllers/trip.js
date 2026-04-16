const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model


//GET: /trips lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client

  // ... rest of the logic

const tripsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Fix: Ensure query is a clean empty object if search is empty
    const query = search.trim() !== '' 
      ? { $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]} 
      : {};

    const skipIndex = (page - 1) * limit;

    const q = await Trip
      .find(query)
      .skip(skipIndex)
      .limit(limit)
      .exec();

    // CHANGE THIS: Angular prefers a 200 status with an empty array [] 
    // over a 404 error when a search returns nothing.
    if (!q) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      return res.status(200).json(q); // Always return 200, even if q is []
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
const tripsFindByCode = async(req, res) => {
  const q = await Trip 
      .find({'code': req.params.tripCode}) // Return single record
    
      .exec();

  // Uncomment the following line to show results of querey
  // on the console
  // console.log(q);

  if (!q) {
     // Database returned no data
    return res
      .status(404)
      .json(err);
  } else { // Return resulting trip list
    return res
      .status(200)
      .json(q);
  }
};
// Existing functions (tripsList, tripsFindByCode...)

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(q);
    }
};

const tripsUpdateTrip = async(req, res) => {
// Uncomment for debugging
console.log(req.params);
console.log(req.body);
const q = await Trip 
.findOneAndUpdate(
{ 'code' : req.params.tripCode },
{
code: req.body.code,
name: req.body.name,
length: req.body.length,
start: req.body.start,
resort: req.body.resort,
perPerson: req.body.perPerson,
image: req.body.image,
description: req.body.description
}
)
.exec();
if(!q)
{ // Database returned no data
return res
.status(400)
.json(err);

} else { // Return resulting updated trip
return res
.status(201)
.json(q);
}
// Uncomment the following line to show results of
operation
// on the console
// console.log(q);
};
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Trip 
            .findOneAndDelete({ 'code': req.params.tripCode })
            .exec();

        if (!q) {
            // Trip not found in database
            return res.status(404).json({ message: "Trip not found" });
        } else {
            // Success: Return 204 (No Content) so Angular knows it's done
            return res.status(204).send();
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};
module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip, 
  tripsUpdateTrip,
  tripsDeleteTrip 

};
