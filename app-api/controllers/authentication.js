const mongoose = require("mongoose");
const User = require("../models/user"); 
const passport = require('passport');

/**
 * Enhancement Three: Secure Data Persistence Workflow
 * Handles: Salt/Hash -> Save to DB -> Relational Check -> Update Reference -> JWT
 */
const register = async (req, res) => {
  // START: Validate input
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Instantiate User
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;

  // STEPS 1 & 2: Generate Salt & Apply Hash Algorithm
  // This triggers the bcrypt/crypto logic defined User model
  user.setPassword(req.body.password);

  try {
    // STEP 3: Save record to MongoDB
    await user.save();

    // STEP 4: Relational Check (Decision Diamond)
    const auditRecord = await mongoose.model("AuditLog").findOne({ email: user.email });

    if (auditRecord) {
      // STEP 5: Update Reference (If 'Yes' path in flowchart)
      console.log("Relational check: Match found. Linking user to audit log.");
      await mongoose.model("AuditLog").updateOne(
        { _id: auditRecord._id },
        { $set: { verified: true, linkedUserId: user._id } }
      );
    } else {
      console.log("Relational check: No match found. Moving to end.");
    }

    // STEP 6: END - Generate JWT and return to caller
    const token = user.generateJWT();
    return res.status(200).json({ token });

  } catch (err) {
    // Handle database or hashing errors
    return res.status(400).json(err);
  }
};

const login = (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ "message": "All fields required" });
  }

  // Delegate authentication to passport
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      // Auth succeeded - generate JWT
      const token = user.generateJWT();
      res.status(200).json({ token });
    } else {
      // Auth failed
       res.status(401).json(info);
    }
  })(req, res);
};

module.exports = {
  register,
  login,
};
