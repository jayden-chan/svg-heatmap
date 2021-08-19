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
import { Coord } from "./types";
import { format } from "date-fns";

const SQUARE_SIZE = 20;
const SQUARE_RX = 2;
const SQUARE_MARGIN = 7;
const OUTLINE_RX = 18;
const OUTER_MARGIN = 10;
const X_OFFSET = 50;
const Y_OFFSET = 30;
const BOTTOM_ROW_HEIGHT = 40;
const LEGEND_X_OFFSET = 70;
const LEGEND_Y_OFFSET = 22;
const AUTO_PALETTE_SIZE = 100;
const WIDTH =
  (SQUARE_SIZE + SQUARE_MARGIN) * 53 +
  SQUARE_MARGIN +
  OUTER_MARGIN * 2 +
  X_OFFSET;
const HEIGHT =
  (SQUARE_SIZE + SQUARE_MARGIN) * 7 +
  SQUARE_MARGIN +
  OUTER_MARGIN * 2 +
  Y_OFFSET +
  BOTTOM_ROW_HEIGHT;

const HEADER = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
<!-- Generated by svg-heatmap -->
<!-- https://www.npmjs.com/package/svg-heatmap -->
`;

const FOOTER = "</svg>";

/**
 * @param {number[]} data The heatmap data, 0-indexed to Jan 1
 * @param {number} year The year of the data. Used for day-of-week alignment
 * @param {string[]} [palette] Optional color palette to use. If not specified a palette will be generated
 *
 * @return {string} The SVG heatmap string
 */
export function generate(
  data: number[],
  year: number,
  palette?: string[],
  darkMode?: boolean
): string {
  const svg = [];
  const p = palette ?? genPalette();
  const textColor = darkMode ?? false ? "#FFFFFF" : "#000000";
  svg.push(HEADER);
  svg.push(`<style>
  .outline { fill: none; stroke: #DDD; stroke-width: 2px }
  .lbl { font-family: sans-serif; fill: ${textColor} }\n`);
  svg.push(genPaletteClasses(p));
  svg.push("\n</style>\n");
  svg.push(outline());
  svg.push(legend(palette));

  const yLabelPad = SQUARE_SIZE * 0.78;
  svg.push(label([X_OFFSET, getSquareCoord(0)[1] + yLabelPad], "Sun", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(1)[1] + yLabelPad], "Mon", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(2)[1] + yLabelPad], "Tue", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(3)[1] + yLabelPad], "Wed", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(4)[1] + yLabelPad], "Thu", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(5)[1] + yLabelPad], "Fri", "end"));
  svg.push(label([X_OFFSET, getSquareCoord(6)[1] + yLabelPad], "Sat", "end"));

  for (let i = 0; i < 12; i++) {
    const date = new Date(year, i, 1);
    const [x] = getSquareCoord((Number(format(date, "w")) - 1) * 7);
    svg.push(label([x, Y_OFFSET], format(date, "MMM")));
  }

  const max = Math.max(...data);

  const paddingBefore = Number(format(new Date(year, 0, 1), "e")) - 1;
  Array(paddingBefore)
    .fill(0)
    .concat(data.concat(Array(53 * 7 - data.length - paddingBefore).fill(0)))
    .forEach((day, i) =>
      svg.push(
        dataSquare(
          getSquareCoord(i),
          palette ? day : Math.floor((day / max) * (AUTO_PALETTE_SIZE - 1)),
          i - paddingBefore,
          year,
          day
        )
      )
    );

  svg.push(FOOTER);
  return svg.join("");
}

function genPalette(): string[] {
  const palette = ["#eeeeee"];
  for (let i = 0; i < 99; i++) {
    palette.push(
      `hsl(${
        Math.floor(i ** 1.4 * (120 / AUTO_PALETTE_SIZE ** 1.4) + 300) % 360
      }, 100%, ${(i ** 0.2 * (50 / AUTO_PALETTE_SIZE ** 0.2)).toFixed(3)}%)`
    );
  }

  return palette;
}

function genPaletteClasses(palette: string[]): string {
  return palette
    .map((c, i) => `  .p${i} { fill: ${c}; stroke: none }`)
    .join("\n");
}

function legend(palette?: string[]): string {
  const svg = [];
  svg.push(label([WIDTH - LEGEND_X_OFFSET, HEIGHT - LEGEND_Y_OFFSET], "More"));
  svg.push(palette ? discreteLegend(palette) : gradientLegend());
  return svg.join("");
}

function gradientLegend(): string {
  const svg = [];
  const endX = WIDTH - LEGEND_X_OFFSET - SQUARE_MARGIN - SQUARE_SIZE;
  const height = HEIGHT - LEGEND_Y_OFFSET - 16;
  const width = 150;
  for (let i = 0; i < AUTO_PALETTE_SIZE; i++) {
    svg.push(
      `<rect x="${
        endX - width + (width / AUTO_PALETTE_SIZE) * i
      }" y="${height}" height="${SQUARE_SIZE}" width="${
        width / AUTO_PALETTE_SIZE
      }" class="p${i}" />`
    );
  }
  svg.push(
    label(
      [endX - width - SQUARE_MARGIN, HEIGHT - LEGEND_Y_OFFSET],
      "Less",
      "end"
    )
  );
  return svg.join("");
}

function discreteLegend(palette: string[]): string {
  const svg = [];
  palette.forEach((_, i) => {
    svg.push(
      pSquare(
        [
          WIDTH -
            LEGEND_X_OFFSET -
            SQUARE_MARGIN -
            SQUARE_SIZE -
            (SQUARE_MARGIN + SQUARE_SIZE) * i,
          HEIGHT - LEGEND_Y_OFFSET - 16,
        ],
        palette.length - i - 1
      )
    );
  });

  svg.push(
    label(
      [
        WIDTH -
          LEGEND_X_OFFSET -
          SQUARE_MARGIN -
          (SQUARE_MARGIN + SQUARE_SIZE) * palette.length,
        HEIGHT - LEGEND_Y_OFFSET,
      ],
      "Less",
      "end"
    )
  );
  return svg.join("");
}

function getSquareCoord(i: number): Coord {
  const xMultiple = Math.floor(i / 7);
  const yMultiple = i % 7;
  return [
    xMultiple * (SQUARE_MARGIN + SQUARE_SIZE) +
      SQUARE_MARGIN +
      OUTER_MARGIN +
      X_OFFSET,
    yMultiple * (SQUARE_MARGIN + SQUARE_SIZE) +
      SQUARE_MARGIN +
      OUTER_MARGIN +
      Y_OFFSET,
  ];
}

function label([x, y]: Coord, text: string, anchor?: string): string {
  return `<text x="${x}" y="${y}" class="lbl" text-anchor="${
    anchor ?? "start"
  }">${text}</text>`;
}

function dataSquare(
  [x, y]: Coord,
  p: number,
  i: number,
  year: number,
  day: number
): string {
  return `<rect onmouseover="svg_hm_h(${year}, ${i}, ${day})" x="${x}" y="${y}" width="${SQUARE_SIZE}" height="${SQUARE_SIZE}" rx="${SQUARE_RX}" class="p${p}"/>`;
}

function pSquare([x, y]: Coord, p: number): string {
  return `<rect x="${x}" y="${y}" width="${SQUARE_SIZE}" height="${SQUARE_SIZE}" rx="${SQUARE_RX}" class="p${p}"/>`;
}

function outline(): string {
  return `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="${OUTLINE_RX}" class="outline"/>`;
}
