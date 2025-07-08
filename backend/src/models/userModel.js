import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: function() { return this.authMethod === 'password'; }
  },

  profileImage: {
    type: String,
    default: ''
  },
  
  googleId: {
    type: String,
    unique: true, 
    sparse: true
  },
  
  authMethod: {
    type: String,
    enum: ['password', 'google'],
    required: true,
    default: 'password'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
