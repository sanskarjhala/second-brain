import mongoose, { Schema } from "mongoose";
//---------------------  user schema   ---------------------
const UserSchema = new Schema({
  emailID: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, unique: false },
  isDemo: { type: Boolean, default: false },

  // TTL logic – only triggers if this field is set
  expireAt: {
    type: Date,
    default: null,
    expires: 0, // MongoDB auto-deletes only when expireAt is a real date
  },
});

//----------------------  content schema -------------------------
const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  userId: { type: mongoose.Types.ObjectId, required: true },
  content: String,
  embedding: { type: [Number], default: undefined },
  status: {
    type: String,
    enum: ["pending", "retrying", "ready", "failed"],
    default: "pending",
  },
  retryCount: {
    type: Number,
    default: 0,
  },
});

//------------------------  link table- schema. -------------------------
const LinkSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  }, //it refers user table..in populating
  hash: String,
});

//----------------------  resume schema -------------------------
const MessageSchema = new Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ResumeSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  // raw extracted text from PDF
  resumeText: { type: String, required: true },
  // JD
  jobDescription: { type: String, required: true },
  jdSummary: { type: String }, // LLM-summarized JD
  analysis: {
    skills: [String],
    experience: String,
    projects: String,
    education: String,
    summary: String,
    matchScore: Number,
    missingSkills: [String],
    suggestions: [String],
  },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
});

export const ResumeModel = mongoose.model("resume", ResumeSchema);
export const linkModel = mongoose.model("link", LinkSchema);
export const ContentModel = mongoose.model("content", ContentSchema);
export const UserModel = mongoose.model("user", UserSchema);
