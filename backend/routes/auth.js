const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

JWT_SECRET = "TheOnlyWayToGoIsUp"

// Create a user using: POST "/api/auth/createuser" NO login required
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be of minimum 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // check if user with same email exits already

    try {
        let user= await User.findOne({email: req.body.email})
        if (user){
            return res.status(400).json({error: "Sorry, User with same email already exists"})
        }
    
        
        // Hashing, salt and pepper

        const salt= await bcrypt.genSalt(10)
        secPassword= await bcrypt.hash(req.body.password,salt) 
        

        // create a new user
        user= await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
          })
        
        const data={
          user:{
          id:user.id
        }
        }

        const authToken= jwt.sign(data, JWT_SECRET);
        res.json(authToken)

    
        // res.json(user)
      }
      catch(error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
      }

      

  }
);

module.exports = router;
