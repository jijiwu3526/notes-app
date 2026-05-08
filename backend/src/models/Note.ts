import mongoose, { Document, Schema } from 'mongoose';

// Define the Note document interface
export interface INote extends Document {
  title: string;
  content: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

// Define the Note schema
const noteSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v; // Remove version key from JSON output
      return ret;
    }
  }
});

// Indexes for better query performance
noteSchema.index({ userId: 1, createdAt: -1 }); // For getting user's notes sorted by creation date
noteSchema.index({ title: 'text', content: 'text' }); // For text search

// Export the model
export default mongoose.model<INote>('Note', noteSchema);