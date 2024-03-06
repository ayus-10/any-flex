import { model, models, Schema } from "mongoose";

const animeData = new Schema({
  animeId: {
    type: Number,
    required: true,
  },
  episodesCompleted: {
    type: Number,
    required: true,
  },
});

const userData = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  animeLibrary: [animeData],
});

const User = models.User || model("User", userData);

export default User;
