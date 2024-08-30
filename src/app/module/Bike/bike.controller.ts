import { Request, Response, NextFunction } from 'express';
import Bike from './bike.model';
import { AuthRequest } from '../../interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export const createBike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name,category, description, pricePerHour, cc, year, model, brand, image } = req.body;

    const newBike = new Bike({
      name,
      category,
      description,
      pricePerHour,
      cc,
      year,
      model,
      brand,
      image
    });

    const savedBike = await newBike.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Bike added successfully',
      data: savedBike,
    });
  } catch (error) {
    next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
  }
};




// ---------------------- get all Bike and search----------------


export const getAllBikes = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string;
    const category = req.query.category as string; // New parameter for category search
    let products: any;

    // Search by category if provided
    if (category) {
      products = await Bike.find({
        category: { $regex: new RegExp(category, 'i') },
        isDeleted: { $ne: true },
      });

      res.status(200).json({
        success: true,
        message: `Bikes in category '${category}' fetched successfully!`,
        data: products,
      });

    // Search by searchTerm if provided
    } else if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      products = await Bike.find({
        $or: [
          { name: { $regex: regex } },
          { brand: { $regex: regex } },
          { model: { $regex: regex } },
          { description: { $regex: regex } },
        ],
        isDeleted: { $ne: true },
      });

      res.status(200).json({
        success: true,
        message: `Bike matching search term '${searchTerm}' fetched successfully!`,
        data: products,
      });

    // Default to fetch all bikes if no searchTerm or category is provided
    } else {
      products = await Bike.find({ isDeleted: { $ne: true } });
      res.status(200).json({
        success: true,
        message: 'Bikes fetched successfully!',
        data: products,
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch products',
      error: error.message,
    });
  }
};

// ---------------------- get all Bike and search----------------


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