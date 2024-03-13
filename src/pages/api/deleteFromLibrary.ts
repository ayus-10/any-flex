import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../database/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, animeId } = req.body;
  try {
    await User.updateOne(
      { username: username },
      { $pull: { animeLibrary: { animeId: animeId } } },
    );
    res.status(200).send("Anime successfully removed from library");
  } catch (error) {
    res.status(400).json({ error });
  }
}
