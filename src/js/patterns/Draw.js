class Draw {

  constructor(env) {

    this.key = "draw";

    this.name = "Free Draw";

    this.env = env;

    this.config = {
    };

    this.path = [[0,0]];
  }


  draw() {

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;
    const mouseX = this.env.mouse.x;
    const mouseY = this.env.mouse.y;

    let x;
    let y;
    let plotter_x, plotter_y;

    let path = [];

    if (this.env.mouse.pressed) {

        // Translate Canvas coordinates to table coordinates
        x = mouseX - this.env.canvas.width/2;
        y = -(mouseY - this.env.canvas.height/2);

        // Translate "centered" coordinates to plotter position
        plotter_x = x + ((max_x - min_x)/2);
        plotter_y = y + ((max_y - min_y)/2);

        // Add to path if within plotter bounds
        if (plotter_x > min_x && plotter_x < max_x && plotter_y > min_y && plotter_y < max_y) {

            // On first press replace [0,0] initial value with x,y
            if (path.length == 1 && path[0][0] == 0 && path[0][1] == 0) {
                this.path = [[x,y]];
            } else {
                this.path.push([x,y]);
            }
        }
    }

    return this.path;
  }
}

export default Draw;