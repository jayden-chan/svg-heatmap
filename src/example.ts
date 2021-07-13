/**
 * Copyright © 2020, 2021 Jayden Chan. All rights reserved.
 *
 * svg-heatmap is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3
 * as published by the Free Software Foundation.
 *
 * svg-heatmap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with svg-heatmap. If not, see <https://www.gnu.org/licenses/>.
 */
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
