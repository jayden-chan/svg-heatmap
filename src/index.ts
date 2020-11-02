import { generate } from "./svg";
import { GITHUB_PALETTE_OLD, GITHUB_PALETTE } from "./types";

function main() {
  const data = [2];
  for (let i = 0; i < 364; i++) {
    data.push(Math.floor(Math.random() * 5));
    // data.push(Math.sin(i / (364 / 3)) * 50);
  }
  console.log(generate(data, 2019, GITHUB_PALETTE));
}

main();
