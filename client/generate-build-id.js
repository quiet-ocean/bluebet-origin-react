/**
 * Build versioning system to ensure latest
 * client version. Used to mitigate browser
 * caching issues.
 *
 * Author: Leevi Halme <leevi@bountyscripts.com> (https://leevihal.me)
 */

// Require Dependencies
const fs = require("fs");

console.log("Incrementing build number...");

// Read the metadata file
fs.readFile("src/metadata.json", (error, content) => {
  // If error, throw it
  if (error) throw error;

  // Read and parse metadata from file contents
  const metadata = JSON.parse(content);

  // Get fields from parsed data
  const version = metadata.build;
  const appName = version.split("@")[0];
  const buildNumber = version.split("@")[1];
  const newBuildNumber = parseInt(buildNumber) + 1;

  // Increment build number
  const newBuildId = appName + "@" + newBuildNumber;

  // Apply changes
  metadata.build = newBuildId;

  // Re-write the file
  fs.writeFile("src/metadata.json", JSON.stringify(metadata), error => {
    // If error, throw it
    if (error) throw error;
    console.log("Current build id: " + newBuildId);
  });
});
