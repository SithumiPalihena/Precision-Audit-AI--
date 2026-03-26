require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auditRoutes = require('./Router/audit');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/audit', auditRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
