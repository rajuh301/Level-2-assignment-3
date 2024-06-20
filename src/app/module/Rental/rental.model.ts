import mongoose, { Document, Schema } from 'mongoose';

export interface IRental extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  bikeId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  returnTime?: Date;
  totalCost: number;
  isReturned: boolean;
}

const rentalSchema = new Schema<IRental>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
  startTime: { type: Date, required: true },
  returnTime: { type: Date, default: null },
  totalCost: { type: Number, default: 0 },
  isReturned: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Rental = mongoose.model<IRental>('Rental', rentalSchema);

export default Rental;
