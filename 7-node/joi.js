import express from "express";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const reqSchema = Joi.object({
  username: Joi.string().min(2).max(10).required(),

  email: Joi.string().email().required(),
});

app.post("/api/register", (req, res) => {
  const { username, email } = req.body;
  const result = reqSchema.validate(req.body);
  if (result.error) {
    res.status(400).json({ message: result.error.details[0].message });
  }
  res.status(201).json({ message: "user created successfuly" });
});

app.listen(3000, () => {
  console.log("server started");
});
