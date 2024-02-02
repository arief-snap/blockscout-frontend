/* eslint-disable no-console */
const { execSync } = require('child_process');
const dependencyTree = require('dependency-tree');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../../');

const TARGET_FILE = path.resolve(ROOT_DIR, './playwright/affected-tests.txt');

const NON_EXISTENT_DEPS = [];

const DIRECTORIES_WITH_TESTS = [
  path.resolve(ROOT_DIR, './ui/shared'),
];

function getAllPwFilesInDirectory(directory) {
  const files = fs.readdirSync(directory, { recursive: true });
  return files
    .filter((file) => file.endsWith('.pw.tsx'))
    .map((file) => path.join(directory, file));
}

function getFileDeps(filename) {
  return dependencyTree.toList({
    filename,
    directory: ROOT_DIR,
    filter: (path) => {
      return path.indexOf('node_modules') === -1;
    },
    tsConfig: path.resolve(ROOT_DIR, './tsconfig.json'),
    nonExistent: NON_EXISTENT_DEPS,
  });
}

async function getChangedFiles() {
  const command = process.env.CI ?
    `git diff --name-only origin/${ process.env.GITHUB_BASE_REF } ${ process.env.GITHUB_SHA } -- ${ ROOT_DIR }` :
    `git diff --name-only main $(git branch --show-current) -- ${ ROOT_DIR }`;

  console.log('Executing command: ', command);
  const files = execSync(command)
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  return files.map((file) => path.join(ROOT_DIR, file));
}

function checkChangesInChakraTheme(changedFiles) {
  const themeDir = path.resolve(ROOT_DIR, './theme');
  return changedFiles.some((file) => file.startsWith(themeDir));
}

function checkChangesInSvgSprite(changedFiles) {
  const iconDir = path.resolve(ROOT_DIR, './icons');
  const areIconsChanged = changedFiles.some((file) => file.startsWith(iconDir));

  if (!areIconsChanged) {
    return false;
  }

  const svgNamesFile = path.resolve(ROOT_DIR, './public/icons/name.d.ts');
  const isSvgNamesChanged = changedFiles.some((file) => file === svgNamesFile);

  if (!isSvgNamesChanged) {
    // If only the icons have changed and not the names in the SVG file, we will need to run all tests.
    // This is because we cannot correctly identify the test files that depend on these changes.
    return true;
  }

  // If the icon names have changed, then there should be changes in the components that use them.
  // Otherwise, typescript would complain about that.
  return false;
}

function createTargetFile(content) {
  fs.writeFileSync(TARGET_FILE, content);

}

async function run() {
  // NOTES:
  // - The absence of TARGET_FILE implies that all tests should be run.
  // - The empty TARGET_FILE implies that no tests should be run.

  fs.unlink(TARGET_FILE, () => {});

  const changedFiles = await getChangedFiles();

  if (!changedFiles.length) {
    createTargetFile('');
    console.log('No changed files found. Exiting...');
    return;
  }

  console.log('Changed files in the branch: ', changedFiles);

  if (checkChangesInChakraTheme(changedFiles)) {
    console.log('Changes in Chakra theme detected. It is advisable to run all test suites. Exiting...');
    return;
  }

  if (checkChangesInSvgSprite(changedFiles)) {
    console.log('There are some changes in the SVG sprite that cannot be linked to a specific component. It is advisable to run all test suites. Exiting...');
    return;
  }

  const start = Date.now();

  const allTestFiles = DIRECTORIES_WITH_TESTS.reduce((acc, dir) => {
    return acc.concat(getAllPwFilesInDirectory(dir));
  }, []);

  const testFilesToRun = allTestFiles
    .slice(0, 10)
    .map((file) => ({ file, deps: getFileDeps(file) }))
    .filter(({ deps }) => deps.some((dep) => changedFiles.includes(dep)));
  const testFileNamesToRun = testFilesToRun.map(({ file }) => path.relative(ROOT_DIR, file));

  if (!testFileNamesToRun.length) {
    createTargetFile('');
    console.log('No tests to run. Exiting...');
    return;
  }

  const end = Date.now();
  console.log('Total time: ', ((end - start) / 1_000).toLocaleString());

  console.log('Tests to run: ', testFileNamesToRun);
  console.log('Non existent deps: ', NON_EXISTENT_DEPS);

  createTargetFile(testFileNamesToRun.join('\n'));
}

run();
