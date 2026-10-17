import { config } from 'dotenv';
import app from './app';

config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Retain API listening on port ${PORT}`);
});