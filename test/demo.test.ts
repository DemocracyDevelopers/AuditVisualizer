import { add } from "@/utils/demo";

describe("mathUtils", () => {
  it("should add two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(2, 9)).toBe(11);
  });
});
