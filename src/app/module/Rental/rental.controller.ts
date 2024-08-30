import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import Rental from './rental.model';
import Bike from '../Bike/bike.model';
import { AuthRequest } from '../../interface';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';

export const createRental = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { bikeId, startTime } = req.body;

        if (!req.user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated !',
                data: [],
            });
        }
        

        const userId = req.user._id;

        if (!bikeId || !startTime) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Bike ID and start time are required',
            });
        }

        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: 'Bike not found',
            });
        }

        if (!bike.isAvailable) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Bike is not available for rent',
            });
        }

        const rental = new Rental({
            userId,
            bikeId,
            startTime,
            returnTime: null,
            totalCost: 0,
            isReturned: false,
        });

        await rental.save();

        bike.isAvailable = false;
        await bike.save();

        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: 'Rental created successfully',
            data: rental,
        });
    } catch (error) {
        next(error);
    }
};



// ---------------------- Return bike------------------
export const returnBike = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const rentalId = req.params.id;
        const rental = await Rental.findById(rentalId);

        if (!rental) {
            return next(new AppError(httpStatus.NOT_FOUND, 'Rental not found !!'));
        }

        if (rental.isReturned) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Bike has already been returned',
            });
        }

        const bike = await Bike.findById(rental.bikeId);
        if (!bike) {
            return next(new AppError(httpStatus.NOT_FOUND, 'Rental not found'));
        }

        const returnTime = new Date();
        const startTime = new Date(rental.startTime);
        const durationHours = Math.ceil((returnTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)); // Calculate the duration in hours
        const totalCost = durationHours * bike.pricePerHour;

        rental.returnTime = returnTime;
        rental.totalCost = totalCost;
        rental.isReturned = true;
        await rental.save();

        bike.isAvailable = true;
        await bike.save();

        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: 'Bike returned successfully',
            data: rental,
        });
    } catch (error) {
        // console.error('Error returning bike:', error);
        next(error);
    }
};

// ---------------------- Return bike------------------



//--------- Get all rentals for authenticated user-----------

export const getAllRentalsForUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated',
                data: [],
            });
        }
        

        const userId = new mongoose.Types.ObjectId(req.user._id);
     
    
        const rentals = await Rental.find({ userId })
            .populate('bikeId', '-__v')
            .populate('userId', '-password -__v');


        if (rentals.length === 0) {
            return res.status(httpStatus.OK).json({
                success: false,
                message: 'No Data Found',
                data: [],
            });
        }

        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: 'Rentals retrieved successfully',
            data: rentals,
        });
    } catch (error:any) {
       
        next(new AppError(500, 'Error retrieving rentals:', [{ path: '', message: error.message }]));
    }
};
//--------- Get all rentals for authenticated user-----------