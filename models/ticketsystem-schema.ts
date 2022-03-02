import mongoose, { Schema } from "mongoose";

const reqString = {
    type: String,
    require: true,
};

const reqBoolean = {
    type: Boolean,
    require: true,
};

const reqArray = {
    type: Array,
    require: true,
};

const TicketSystemSchema = new Schema({
    GuildID: reqString,
    MembersID: reqString,
    ChannelID: reqString,
    Closed: reqBoolean,
    Locked: reqBoolean,
});

const name = "guild-ticket-system";

export default mongoose.models[name] ||
    mongoose.model(name, TicketSystemSchema, name);
