const fs = require('fs');
const swaggerSpecs = require('./src/config/swagger');

fs.writeFileSync(
  './swagger.json',
  JSON.stringify(swaggerSpecs, null, 2),
  'utf-8'
);
console.log('Swagger JSON exported successfully to backend/swagger.json');
