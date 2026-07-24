import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateItineraryRoute from './routes/api/generateItinerary.js';
import regenerateDayRoute from './routes/api/regenerateDay.js';
import searchAccommodationsRoute from './routes/api/searchAccommodations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', generateItineraryRoute);
app.use('/api', regenerateDayRoute);
app.use('/api', searchAccommodationsRoute);

// Basic health check
app.get('/', (req, res) => {
  res.send('BackpackerIQ API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
