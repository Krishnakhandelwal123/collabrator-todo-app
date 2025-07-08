import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      type: {
        type: String,
        enum: ["create", "update", "delete", "assign", "status-change", "priority-change"],
        required: true,
      },
      task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      description: { type: String },
      metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // optional info
    },
    { timestamps: true }
  );
  
export default mongoose.model('Action', actionSchema);
  