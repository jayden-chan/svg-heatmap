import { generate } from "./svg";
import { PalettePresets } from "./types";

function main() {
  const data = [2];
  for (let i = 0; i < 364; i++) {
    data.push(Math.floor(Math.random() * PalettePresets.gitHub.length));
  }
  console.log(generate(data, 2019, PalettePresets.gitHub));
}

main();
