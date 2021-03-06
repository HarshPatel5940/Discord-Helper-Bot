/**
                Copyright [2022] [HarshPatel5940]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License. */

import mongoose, { Schema } from "mongoose";

const reqString = {
    type: String,
    require: true,
};

const reqArray = {
    type: [String],
    require: true,
};

const TicketConfigSchema = new Schema({
    _id: reqString,
    GuildID: reqString,
    GuildTicketCount: reqString,
    ChannelID: reqString,
    TranscriptID: reqString,
    OpenCategoryID: reqString,
    EveryoneRoleID: reqString,
    SupportRoleID: reqString,
    Title: reqString,
    Description: reqString,
    ButtonsName: reqArray,
    ButtonsEmoji: reqArray,
});

const name = "guild-ticket-config";

export default mongoose.models[name] ||
    mongoose.model(name, TicketConfigSchema, name);
