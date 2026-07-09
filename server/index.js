import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateItineraryRoute from './routes/api/generateItinerary.js';
import searchAccommodationsRoute from './routes/api/searchAccommodations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', generateItineraryRoute);
app.use('/api', searchAccommodationsRoute);

// Basic health check
app.get('/', (req, res) => {
  res.send('BackpackerIQ API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
