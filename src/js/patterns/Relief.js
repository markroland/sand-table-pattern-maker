import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';

class Relief {

  constructor(env) {
    this.key = this.constructor.name.toLowerCase();
    this.name = this.constructor.name;
    this.env = env;

    this.max_r = 0.5 * Math.min(
      (env.table.x.max - env.table.x.min),
      (env.table.y.max - env.table.y.min)
    );

    this.config = {
      "lines": {
        "name": "Lines",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            10,
            200,
            100,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "relief": {
        "name": "Relief",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            50,
            5,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "reverse": {
        "name": "Reverse",
        "value": null,
        "input": {
          "type": "createCheckbox",
          "attributes" : [{
            "type" : "checkbox",
            "checked" : null
          }],
          "params": [0, 1, 0],
          "displayValue": false
        }
      }
    };

    this.path = [];

    this.canvas = new OffscreenCanvas(256, 256);
    this.ctx = this.canvas.getContext('2d');

    // draw a centered square with black fill and a 10px white stroke
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // fill whole canvas black (background)
    ctx.fillStyle = 'rgb(32,32,32)';
    ctx.fillRect(0, 0, w, h);

    // draw a centered black circle with diameter equal to the canvas width
    const cx = w / 2;
    const cy = h / 2;
    const radius = w / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();

    // square size and position (60% of the smallest canvas dimension)
    const strokeWidth = 10;
    const size = Math.min(w, h) * 0.4;
    const x = (w - size) / 2;
    const y = (h - size) / 2;

    ctx.save();

    // draw black-filled square (will blend with background) and stroke with white
    const angle = 30 * Math.PI / 180;
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, size, size);

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#fff';
    // inset stroke so the full 10px stroke is visible inside the canvas bounds
    ctx.strokeRect(x + strokeWidth / 2, y + strokeWidth / 2, size - strokeWidth, size - strokeWidth);

    ctx.restore();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    // Display the offscreen canvas
    const preview = document.createElement('canvas');
    preview.id = 'relief-preview-canvas';
    preview.style.width = `${this.canvas.width}px`;
    preview.style.height = `${this.canvas.height}px`;
    preview.style.cssText = 'display:block; margin:10px;';
    document.body.appendChild(preview);
    preview.width = this.canvas.width;
    preview.height = this.canvas.height;
    const preview_ctx = preview.getContext('2d');
    preview_ctx.drawImage(this.canvas, 0, 0);
  }

  draw() {

    // Update object
    this.config.lines.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.relief.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.lines.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.relief.value;

    // Calculate path for Circle at center
    // if (!this.path.length) {
      this.path = this.constructPath();
    // }

    return this.path;
  }

  /**
   * Calculate coordinates for a circle
   **/
  constructPath() {

    // Start path at far right
    let path = [];

    const PathHelp = new PathHelper();

    const max_r = 0.5 * Math.min(
      (this.env.table.x.max - this.env.table.x.min),
      (this.env.table.y.max - this.env.table.y.min)
    );

    const center = {
      x: (this.env.table.x.max + this.env.table.x.min) / 2,
      y: (this.env.table.y.max + this.env.table.y.min) / 2
    }

    path.push([max_r, 0]);

    // Move from required Sisyphus starting point at rho-theta [1,0] to top
    let i_max = 12;
    for (let i = 0; i <= i_max; i++) {
      path.push([
        max_r * Math.cos(i/i_max * (0.5 * Math.PI)),
        -max_r * Math.sin(i/i_max * (0.5 * Math.PI))
      ]);
    }

    // Draw horizontal lines
    const j_max = this.config.lines.value;
    for (let j = 1; j <= j_max; j++) {
      const direction = (j % 2 == 0) ? -1 : 1;
      const y = PathHelp.map(j, 1, j_max, -max_r, max_r);
      // max_r + j * (1 * this.env.ball.diameter);
      // const y = max_r * Math.exp(-(j/j_max) * 1.0);

      const x_start = direction * Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));
      const x_end = direction * -Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));

      let line = PathHelp.dividePathComplete(
        [
          [x_start, y],
          [x_end, y]
        ],
        0.5 * this.env.ball.diameter
      );

      // use the canvas as a lookup table: sample pixel for each point and append its normalized brightness
      const img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = img.data;
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const scale = (this.canvas.width / 2) / max_r; // pixels per unit

      line = line.map(([lx, ly]) => {
        const px = Math.round(cx + lx * scale);
        const py = Math.round(cy + ly * scale);

        // Return original point if pixel is outside canvas
        if (px < 0 || px >= this.canvas.width || py < 0 || py >= this.canvas.height) {
          return [lx, ly];
        }

        const idx = (py * this.canvas.width + px) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
        const brightness = (r + g + b) / (3 * 255); // 0..1

        ly += -(this.config.relief.value * brightness);

        const maxY = Math.sqrt(Math.max(0, Math.pow(this.max_r, 2) - Math.pow(lx, 2)));
        ly = PathHelp.clamp(ly, -maxY, maxY);

        // ly = PathHelp.clamp(ly, this.env.table.y.min, this.env.table.y.max);

        return [lx, ly];
      });

      path = path.concat(line);
    }

    // Return to Sisyphus "Home" [1, 0]
    path = path.concat(
      Utilities.arcBetweenPoints(
        path[path.length - 1][0],
        path[path.length - 1][1],
        max_r,
        0,
        this.env.ball.diameter
      )

    )
    /*
    path = path.concat(this.#arcToHome(
      path[path.length - 1][0],
      path[path.length - 1][1],
      max_r,
      -1
    ));
    //*/

    path = PathHelp.reflectPath(path, "y");

    // Update object
    // this.path = path;

    return path;
  }
}

export default Relief;