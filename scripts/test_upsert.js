const { ENV } = require('./dist/env');
const { upsertUserLocation, getUserLocations } = require('./dist/db/tembo');
async function test() {
  await upsertUserLocation(6297262714, 55.75, 37.61);
  const locs1 = await getUserLocations(6297262714);
  console.log('After first upsert:', locs1);
  
  await upsertUserLocation(6297262714, 55.76, 37.62);
  const locs2 = await getUserLocations(6297262714);
  console.log('After second upsert:', locs2);
  
  process.exit(0);
}
test();
