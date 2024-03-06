import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/connectDB";
import User from "../../../database/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username } = req.body;
  connectDB();
  try {
    const data = await User.findOne({ username });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(404).send("No data found");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
