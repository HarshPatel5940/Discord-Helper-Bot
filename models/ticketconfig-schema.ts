import mongoose, { Schema } from "mongoose";

const reqString = {
    type: String,
    require: true,
};

// const reqBoolean = {
//     type: Boolean,
//     require: true,
// };

const reqArray = {
    type: [String],
    require: true,
};

const TicketConfigSchema = new Schema({
    GuildID: reqString,
    GuildTicketCount: reqString,
    ChannelID: reqString,
    TranscriptID: reqString,
    OpenCategoryID: reqString,
    CloseCategoryID: reqString,
    EveryoneRoleID: reqString,
    SupportRoleID: reqString,
    Description: reqString,
    Buttons: reqArray
});

const name = "guild-ticket-config";

export default mongoose.models[name] ||
    mongoose.model(name, TicketConfigSchema, name);