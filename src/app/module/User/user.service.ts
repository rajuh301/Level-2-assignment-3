import { TUser } from "./user.interface";
import User from "./user.model";
import bcrypt from 'bcrypt'


const createUserInToDB = async (userData: TUser) => {
  const result = await User.create(userData);
  return result;
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select('+password'); // Ensure password is selected
};

export const comparePassword = async (enteredPassword: string, storedPassword: string) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

export const findUserById = async (id: string) => {
  return User.findById(id).select('-password');
};


// ----------------- Update profile ----------------
export const updateUserProfile = async (userId: string, updateData: any) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password'); 
  return updatedUser;
};
// ----------------- Update profile ----------------




export const userServeces = {
  createUserInToDB,
  findUserByEmail,
  findUserById,
  comparePassword,
  updateUserProfile

};
