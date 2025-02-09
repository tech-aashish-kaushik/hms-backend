import { Date, Schema, model } from 'mongoose';

interface IUserSchema {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  createdOn: Date;
  updatedOn: Date;
}

const userSchema = new Schema<IUserSchema>({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user', 'superAdmin'], default: 'user' },
  refreshToken: { type: String, default: null },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

const User = model<IUserSchema>('User', userSchema);

export { User, IUserSchema };