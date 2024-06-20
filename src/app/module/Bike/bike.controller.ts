import { Request, Response, NextFunction } from 'express';
import Bike from './bike.model';
import { AuthRequest } from '../../interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export const createBike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, pricePerHour, cc, year, model, brand } = req.body;

    const newBike = new Bike({
      name,
      description,
      pricePerHour,
      cc,
      year,
      model,
      brand,
    });

    const savedBike = await newBike.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Bike added successfully',
      data: savedBike,
    });
  } catch (error) {
    console.error('Error creating bike:', error);
    next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
  }
};


// ----------------- Get all bike -------------
export const getAllBikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bikes = await Bike.find();
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bikes retrieved successfully',
      data: bikes,
    });
  } catch (error) {
    next(error);
  }
};
// ----------------- Get all bike -------------


// ---------------------- Update Bike --------------------
// Controller function to update a bike
export const updateBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBike = await Bike.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBike) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'Bike not found',
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bike updated successfully',
      data: updatedBike,
    });
  } catch (error) {
    next(error);
  }
};
// ---------------------- Update Bike --------------------



// -----------Controller function to delete a bike-----------
export const deleteBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedBike = await Bike.findByIdAndDelete(id);

    if (!deletedBike) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'Bike not found',
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bike deleted successfully',
      data: deletedBike,
    });
  } catch (error) {
    next(error);
  }
};
// -----------Controller function to delete a bike-----------