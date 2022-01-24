import mongoose, { Schema } from "mongoose";

const reqString = {
    type: String,
    required: true,
};

const AFK_schema = new Schema({
    GuildID: reqString,
    UserID: reqString,
    afkMessage: reqString,
    Time: reqString,
})

const name = "AFK-message";

export default mongoose.models[name] ||
    mongoose.model(name, AFK_schema, name);
