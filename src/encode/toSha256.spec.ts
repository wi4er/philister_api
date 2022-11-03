import { toSha256 } from "./toSha256";

describe("To sha 256", () => {
  test("Should crypt", () => {
    const hash = toSha256("qwerty");

    expect(hash).toBe("65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5");
  });
})