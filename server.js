require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Event Model
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Event = mongoose.model('Event', EventSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected Routes (JWT required)
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract "Bearer XYZ"
  console.log("Token received:", token); // Debug log

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message); // Log why verification failed
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Events API
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, price, image } = req.body;
    const event = new Event({ 
      title, 
      description, 
      date, 
      location, 
      price, 
      image, 
      createdBy: req.userId 
    });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));