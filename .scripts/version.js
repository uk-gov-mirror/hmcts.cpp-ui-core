const path = require('path');
const fs = require('fs');
const buildDir = path.join(__dirname, '../dist');
const caretRangeRegex = /^\^0\.0\.0-PLACEHOLDER$/;

if (!process.env.npm_package_version) {
  throw new Error(
    '[Build] Failed to determine package version. ' +
      'Did you forget to supply an `npm_package_version` environment variable?'
  );
}

function updateCppPeerDependencies(packageJson, newVersion) {
  if (!packageJson.peerDependencies) {
    return;
  }
  for (const [depName, currentRange] of Object.entries(packageJson.peerDependencies)) {
    if (currentRange.match(caretRangeRegex)) {
      packageJson.peerDependencies[depName] = `^${newVersion}`;
      console.log(
        `[Build] Bumped ${depName} peer dependency: ${currentRange} to ${packageJson.peerDependencies[depName]}`
      );
    }
  }
}

try {
  const newVersion = process.env.npm_package_version.trim();
  const directoryNames = fs.readdirSync(buildDir).filter((item) => {
    const itemPath = path.join(buildDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  directoryNames.forEach((packageName) => {
    const pathToPackage = path.join(buildDir, packageName, 'package.json');
    const packageJson = {
      ...require(pathToPackage),
      version: newVersion
    };
    updateCppPeerDependencies(packageJson, newVersion);
    fs.writeFileSync(pathToPackage, JSON.stringify(packageJson, null, 2));
    console.log(`[Build] Bumped ${packageJson.name} to ${packageJson.version}.`);
  });
} catch (e) {
  console.log(`[Build] Versioning failed: ${e.toString()}`);
}
