import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/connectDB";
import User from "../../../database/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, animeId } = req.body;
  connectDB();
  try {
    const itemInLibrary = await User.findOne({
      username: username,
      "animeLibrary.animeId": animeId,
    });
    res.status(200).send(itemInLibrary !== null);
  } catch (error) {
    res.status(400).json({ error });
  }
}
