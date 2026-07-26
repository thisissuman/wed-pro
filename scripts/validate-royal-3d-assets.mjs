import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(
  process.cwd(),
  "public/media/royal-3d-cinema/v1",
);

const errors = [];

function fail(message) {
  errors.push(message);
}

function readUint24LE(buffer, offset) {
  return (
    buffer[offset] |
    (buffer[offset + 1] << 8) |
    (buffer[offset + 2] << 16)
  );
}

function getWebpDimensions(filePath) {
  const buffer = readFileSync(filePath);

  if (
    buffer.length < 30 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error("not a WebP RIFF file");
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (chunkType === "VP8 " && dataOffset + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
      };
    }

    if (chunkType === "VP8L" && dataOffset + 5 <= buffer.length) {
      if (buffer[dataOffset] !== 0x2f) {
        throw new Error("invalid VP8L signature");
      }
      const bits = buffer.readUInt32LE(dataOffset + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      };
    }

    if (chunkType === "VP8X" && dataOffset + 10 <= buffer.length) {
      return {
        width: readUint24LE(buffer, dataOffset + 4) + 1,
        height: readUint24LE(buffer, dataOffset + 7) + 1,
      };
    }

    offset = dataOffset + chunkSize + (chunkSize % 2);
  }

  throw new Error("no supported WebP image chunk found");
}

function assertNonEmpty(filePath) {
  try {
    if (!statSync(filePath).isFile() || statSync(filePath).size === 0) {
      fail(`${path.relative(ROOT, filePath)} is empty or not a file`);
    }
  } catch {
    fail(`${path.relative(ROOT, filePath)} is missing`);
  }
}

function assertWebp(filePath, expectedDimensions) {
  assertNonEmpty(filePath);
  try {
    const actual = getWebpDimensions(filePath);
    if (
      expectedDimensions &&
      (actual.width !== expectedDimensions.width ||
        actual.height !== expectedDimensions.height)
    ) {
      fail(
        `${path.relative(ROOT, filePath)} is ${actual.width}x${actual.height}; ` +
          `expected ${expectedDimensions.width}x${expectedDimensions.height}`,
      );
    }
  } catch (error) {
    fail(`${path.relative(ROOT, filePath)}: ${error.message}`);
  }
}

function assertSequence({
  directory,
  prefix,
  count,
  dimensions,
}) {
  const absoluteDirectory = path.join(ROOT, directory);
  let fileNames = [];

  try {
    fileNames = readdirSync(absoluteDirectory).sort();
  } catch {
    fail(`${directory} is missing`);
    return;
  }

  const expectedNames = Array.from(
    { length: count },
    (_, index) => `${prefix}_${String(index + 1).padStart(3, "0")}.webp`,
  );

  if (fileNames.length !== count) {
    fail(`${directory} contains ${fileNames.length} files; expected ${count}`);
  }

  for (const [index, expectedName] of expectedNames.entries()) {
    if (fileNames[index] !== expectedName) {
      fail(
        `${directory} numbering mismatch at position ${index + 1}: ` +
          `found ${fileNames[index] ?? "nothing"}, expected ${expectedName}`,
      );
    }
    assertWebp(path.join(absoluteDirectory, expectedName), dimensions);
  }
}

assertSequence({
  directory: "frames/low",
  prefix: "f",
  count: 181,
  dimensions: { width: 480, height: 640 },
});
assertSequence({
  directory: "frames/high",
  prefix: "f",
  count: 181,
  dimensions: { width: 1296, height: 1728 },
});
assertSequence({
  directory: "sacred",
  prefix: "s",
  count: 121,
  dimensions: { width: 648, height: 864 },
});

const requiredWebp = {
  "decor/arch.webp": { width: 1025, height: 1126 },
  "decor/diya.webp": { width: 500, height: 461 },
  "decor/elephant.webp": { width: 900, height: 708 },
  "decor/lotus.webp": { width: 800, height: 926 },
  "decor/toran.webp": { width: 1533, height: 444 },
  "decor/umbrella.webp": { width: 700, height: 1292 },
  "stills/couple.webp": { width: 1200, height: 1600 },
  "stills/ganesha.webp": { width: 1200, height: 1600 },
  "stills/map.webp": { width: 1000, height: 1072 },
  "stills/sanctum_start.webp": { width: 900, height: 1200 },
  "stills/scratch_reveal.webp": { width: 900, height: 1200 },
  "stills/varmala.webp": { width: 900, height: 1200 },
  "stills/venue_art.webp": { width: 1100, height: 1467 },
  "posters/film1_poster.webp": { width: 1280, height: 640 },
  "posters/film2_poster.webp": { width: 1280, height: 640 },
  "posters/film3_poster.webp": { width: 720, height: 1286 },
};

for (const [relativePath, dimensions] of Object.entries(requiredWebp)) {
  assertWebp(path.join(ROOT, relativePath), dimensions);
}

for (const filmName of ["film1", "film2", "film3"]) {
  assertNonEmpty(path.join(ROOT, "films", `${filmName}.mp4`));
  assertNonEmpty(path.join(ROOT, "posters", `${filmName}_poster.webp`));
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

for (const filePath of walk(ROOT)) {
  const relativePath = path.relative(ROOT, filePath).toLowerCase();
  if (
    relativePath.includes("world") ||
    relativePath.includes("three") ||
    relativePath.endsWith(".m4a") ||
    relativePath.endsWith(".mp3")
  ) {
    fail(`excluded asset entered production media: ${relativePath}`);
  }
}

if (errors.length > 0) {
  console.error("Royal 3D Cinema asset validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  "Royal 3D Cinema assets valid: 483 frames, 6 decor files, 7 stills, and 3 film/poster pairs.",
);
