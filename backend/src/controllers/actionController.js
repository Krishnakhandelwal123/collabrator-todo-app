import Action from "../models/actionModel.js";

export const getLast20Actions = async (req, res) => {
    try {
      const actions = await Action.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("user", "name email")   // who did the action
        .populate("task", "title");       // which task was involved
  
      res.status(200).json(actions);
    } catch (error) {
      console.error("Fetch Actions Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  