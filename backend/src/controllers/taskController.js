import Task from "../models/taskModel.js"
import Action from "../models/actionModel.js"
import User from "../models/userModel.js"
import { emitToAll } from "../lib/socket.js";

const create = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignees, smartAssigned } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    
    if (description.length < 15) {
      return res.status(400).json({ message: "Description must be at least 15 characters" });
    }
    
    // Check if title matches column names
    const columnNames = ['todo', 'in-progress', 'done'];
    if (columnNames.includes(title.toLowerCase())) {
      return res.status(400).json({ message: "Task title cannot match column names" });
    }
    
    const task = await Task.findOne({ title });
    if (task) {
      return res.status(400).json({ message: "Task with this title already exists" });
    }
    
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority: priority || "medium",
      status: status || "todo",
      assignees: assignees || [],
      createdBy: req.user._id,
      smartAssigned: smartAssigned || false,
    });
    await newTask.save();

    // Log the action
    const action = await Action.create({
      user: req.user._id,
      type: "create",
      task: newTask._id,
      description: `${req.user.name} created '${newTask.title}'`
    });

    // Emit real-time update
    emitToAll('taskCreated', { task: newTask, action });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { version, ...updateFields } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Conflict detection
    if (version && task.version !== version) {
      return res.status(409).json({ 
        message: "Task has been modified by another user",
        currentVersion: task.version,
        serverTask: task
      });
    }

    updateFields.version = task.version + 1;
    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Log the action
    const action = await Action.create({
      user: req.user._id,
      type: "update",
      task: updatedTask._id,
      description: `${req.user.name} updated '${updatedTask.title}'`
    });

    // Emit real-time update
    emitToAll('taskUpdated', { task: updatedTask, action });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Log the action
    const action = await Action.create({
      user: req.user._id,
      type: "delete",
      task: deletedTask._id,
      description: `${req.user.name} deleted '${deletedTask.title}'`
    });

    // Emit real-time update
    emitToAll('taskDeleted', { taskId: id, action });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignees', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get All Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await User.findById(assigneeId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    task.assignees = [assigneeId];
    task.version += 1;
    await task.save();

    // Log the action
    const action = await Action.create({
      user: req.user._id,
      type: "assign",
      task: task._id,
      description: `${req.user.name} assigned '${task.title}' to ${user.name}`
    });

    // Emit real-time update
    emitToAll('taskAssigned', { task, action });

    res.status(200).json(task);
  } catch (error) {
    console.error("Assign Task Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const smartAssignTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find user with fewest active tasks
    const users = await User.find({});
    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const activeTasks = await Task.countDocuments({
          assignees: user._id,
          status: { $in: ['todo', 'in-progress'] }
        });
        return { user, count: activeTasks };
      })
    );

    const leastBusyUser = userTaskCounts.reduce((min, current) => 
      current.count < min.count ? current : min
    );

    task.assignees = [leastBusyUser.user._id];
    task.smartAssigned = true;
    task.version += 1;
    await task.save();

    // Log the action
    const action = await Action.create({
      user: req.user._id,
      type: "assign",
      task: task._id,
      description: `${req.user.name} smart-assigned '${task.title}' to ${leastBusyUser.user.name}`
    });

    // Emit real-time update
    emitToAll('taskSmartAssigned', { task, action });

    res.status(200).json(task);
  } catch (error) {
    console.error("Smart Assign Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { create, update, deleteTask, getAllTasks, assignTask, smartAssignTask };