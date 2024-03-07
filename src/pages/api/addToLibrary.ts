import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/connectDB";
import User from "../../../database/models/User";

export type UserModel = {
  username: string;
  animeLibrary: AnimeLibrary[];
};

type AnimeLibrary = {
  animeId: number;
  animeName: string;
  imageURL: string;
  totalEpisodes: number;
  episodesCompleted: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const reqBody: UserModel = req.body;

  connectDB();

  // Get username from request body and query database if user already exists
  const { username } = reqBody;
  const existingLibrary: UserModel | null = await User.findOne({ username });

  if (!existingLibrary) {
    // User entry does not exist, so create new one
    try {
      const user = new User(reqBody);
      await user.save();
      res.status(201).send("Successfully added to library");
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    // User entry already exist, so update previous one
    const existingAnimeLibrary: AnimeLibrary[] = existingLibrary.animeLibrary;
    const newAnimeLibrary: AnimeLibrary[] = reqBody.animeLibrary;

    if (newAnimeLibrary.length !== 1) {
      res.status(400).send("Can only update one entry at a time");
      return;
    }

    const newAnimeLibraryElement = newAnimeLibrary[0]; // Store the first member of request body in a variable

    let updatedAnimeLibrary: AnimeLibrary[] = []; // Initialize an empty array to store the updated data

    let existingAnimeLibraryUpdated = false; // Used to keep track if existing array was updated

    // Iterate over existing array to check and update if newAnimeLibraryElement already exists there
    for (let index = 0; index < existingAnimeLibrary.length; index++) {
      if (
        existingAnimeLibrary[index].animeId === newAnimeLibraryElement.animeId
      ) {
        existingAnimeLibrary[index] = newAnimeLibraryElement;
        updatedAnimeLibrary = [...existingAnimeLibrary];
        existingAnimeLibraryUpdated = true;
        break;
      }
    }

    if (!existingAnimeLibraryUpdated) {
      updatedAnimeLibrary = [...existingAnimeLibrary, ...newAnimeLibrary];
    }

    try {
      await User.updateOne(
        { username },
        { $set: { animeLibrary: updatedAnimeLibrary } },
      );
      res.status(200).send("Successfully updated the library");
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
