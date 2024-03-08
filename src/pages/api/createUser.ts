import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/connectDB";
import User from "../../../database/models/User";
import { UserModel } from "./addToLibrary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  connectDB();

  const { username } = req.body;

  try {
    // Check if user entry already exists
    const existingUser: UserModel | null = await User.findOne({ username });

    // User entry does not exist, so create one
    if (!existingUser) {
      const userEntry = {
        username: username,
        animeLibrary: [],
      };
      const user = new User(userEntry);
      await user.save();

      res.status(201).send("User created successfully");
    }

    res.status(200).send("User already exists");
  } catch (error) {
    res.status(400).json({ error });
  }
}
