const { sync } = require('./sync-notion');

console.log("Testing Notion sync...");
sync().then(() => {
    console.log("Test completed successfully!");
}).catch(error => {
    console.error("Test failed:", error);
});