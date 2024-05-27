import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define the base User interface extending Document
interface UserBaseDocument extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  savedPlaylists: string[];
  otp : number;
  otpExpiry : number;

}

// Define the UserModel extending UserBaseDocument to include Mongoose model methods
interface UserModel extends UserBaseDocument {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the UserModelDocument type by combining UserModel and Document
type UserModelDocument = UserModel & Document;

const UserSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    savedPlaylists: [{ type: Schema.Types.ObjectId, ref: "PlayList" }],
    otp : { type: Number },
    otpExpiry : { type: Number }
  },
  { timestamps: true }
);

UserSchema.pre<UserModelDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Define the UserModel type using the Model interface and UserModelDocument
const User: Model<UserModelDocument> = mongoose.model<UserModelDocument>(
  "User",
  UserSchema
);

export default User;
export { UserModelDocument };
