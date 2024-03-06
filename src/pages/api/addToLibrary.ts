import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/connectDB";
import User from "../../../database/models/User";

export type UserModel = {
  username: string;
  animeLibrary: {
    animeId: number;
    episodesCompleted: number;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const reqBody: UserModel = req.body;
  connectDB();
  try {
    const user = new User(reqBody);
    await user.save();
    res.status(201).send("Sucessfully added to library");
  } catch (error) {
    res.status(400).json({ error });
  }
}
