import Bike from './bike.model';
import { IBike } from './bike.interface';

export const createBikeService = async (bikeData: IBike) => {
  const newBike = new Bike(bikeData);
  return await newBike.save();
};
