const router = require("express").Router();
const userRepository = require("../models/User");

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const user = await userRepository.getUserById(+id);
  try {
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

router.post("/", async (req, res) => {
  const userData = req.body;
  const newUser = await userRepository.addUser(userData);
  try {
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding User",
    });
  }
});

module.exports = router;