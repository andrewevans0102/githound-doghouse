import test from "node:test";
import assert from "node:assert/strict";
import { DOGHOUSE_ASCII, printDoghouse } from "../src/index.js";

test("doghouse ASCII art is defined and non-empty", () => {
  assert.ok(DOGHOUSE_ASCII);
  assert.strictEqual(typeof DOGHOUSE_ASCII, "string");
  assert.ok(DOGHOUSE_ASCII.length > 50, "ASCII art should have sufficient content");
});

test("doghouse contains essential architectural features", () => {
  // Should have roof lines
  assert.ok(DOGHOUSE_ASCII.includes("/"), "ASCII art should include roof slopes");
  assert.ok(DOGHOUSE_ASCII.includes("\\"), "ASCII art should include roof slopes");

  // Should have walls and foundation
  assert.ok(DOGHOUSE_ASCII.includes("|"), "ASCII art should include walls");
  assert.ok(DOGHOUSE_ASCII.includes("="), "ASCII art should include foundation");

  // Should have doghouse indicator or door
  assert.ok(
    DOGHOUSE_ASCII.includes("DOGHOUSE") || DOGHOUSE_ASCII.includes("HARVEY"),
    "ASCII art should include a doghouse nameplate"
  );
});

test("printDoghouse executes without error", () => {
  let output = "";
  const originalLog = console.log;
  console.log = (msg) => {
    output += msg;
  };
  try {
    printDoghouse();
    assert.ok(output.length > 0, "printDoghouse should log output");
  } finally {
    console.log = originalLog;
  }
});
