# svg-heatmap
Generate GitHub-style SVG heatmaps

## Install
```
yarn add svg-heatmap
```

## Usage
```javascript
import { generate, PalettePresets } from "svg-heatmap";

// Push some random data
const data = [];
for (let i = 0; i < 365; i++) {
  // For discrete palettes the range of the data should be [0, palette.length)
  // For the auto generated palette the data can be any non-negative number
  data.push(Math.floor(Math.random() * PalettePresets.gitHub.length));
}

const svg = generate(data, 2019, PalettePresets.gitHub);
```
## Palette Presets
### GitHub (`gitHub`)
![Example](./examples/github.svg)

### GitHub Old (`gitHubOld`)
![Example](./examples/github-old.svg)

### Blue (`blue`)
![Example](./examples/blue.svg)

### Auto Generated Palette
![Example](./examples/auto.svg)
