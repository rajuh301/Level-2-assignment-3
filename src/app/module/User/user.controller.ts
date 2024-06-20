import { NextFunction, Request, Response } from 'express';
import { userServeces } from './user.service';
import { userValidationSchema, userIdValidationSchema, userEmailValidationSchema, userLoginValidationSchema, updateUserValidationSchema } from './user.validation';
import { z } from 'zod';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import sendResponse from '../../utils/sendResponse';
import User from './user.model';
import { AuthRequest } from '../../interface';

dotenv.config()



export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate the request body using Zod
      const userData = userValidationSchema.parse(req.body);
  
      const { email } = userData;
  
      // Check if the user already exists
      const userExists = await userServeces.findUserByEmail(email);
  
      if (userExists) {
        res.status(400).json({
          success: false,
          message: 'User already exists',
        });
        return;
      }
  
      // Create the new user
      const createdUser = await userServeces.createUserInToDB(userData);
  
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: createdUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error);
        return next(new AppError(httpStatus.BAD_REQUEST, 'Validation error'));
      } else {
        console.error('Internal server error:', error);
        return next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
      }
    }
  };

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate the request params using Zod
        const params = userIdValidationSchema.parse(req.params);

        const { id } = params;
        const user = await userServeces.findUserById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        } else {
            throw new AppError(httpStatus.NOT_FOUND, 'Internal server error')
        }
    }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate the request params using Zod
        const params = userEmailValidationSchema.parse(req.params);

        const { email } = params;
        const user = await userServeces.findUserByEmail(email);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        } else {
            throw new AppError(httpStatus.NOT_FOUND, 'Internal server error')
        }
    }
};
// ------------------ Login----------------
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validate request body
        const validation = userLoginValidationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: validation.error.errors.map((err) => err.message).join(', '),
            });
        }



        // Find user by email
        const user = await userServeces.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // console.log('Stored Password:', user.password); // Log stored password

        // Check password
        const isMatch = await userServeces.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if JWT secrets are available
        const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!jwtAccessSecret || !jwtRefreshSecret) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: 'JWT secrets are not defined',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, jwtAccessSecret, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User logged in successfully',
            token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};
// ------------------ Login----------------

// ------------- Get profile ---------------


export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(httpStatus.NOT_FOUND, 'You are not athorized!')
        }


        const user = await userServeces.findUserById(userId);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'You are not athorized!')

        }

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User profile retrieved successfully',
            data: user,
        });


    } catch (error) {
        throw new AppError(httpStatus.EXPECTATION_FAILED, 'You are not athorized!')
    }
};
// ------------- Get profile ---------------

// -------------------------- Uldate profile ----------------------

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { name, phone } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(userId, { name, phone }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    }
  };
// -------------------------- Uldate profile ----------------------




export const userControllers = {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
