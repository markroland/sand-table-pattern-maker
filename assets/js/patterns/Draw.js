class Draw {

  constructor() {

    this.key = "draw";

    this.name = "Free Draw";

    this.config = {
    };

    this.path = [[0,0]];
  }


  draw() {

    let x;
    let y;
    let plotter_x, plotter_y;

    if (mouseIsPressed) {

        // Translate Canvas coordinates to table coordinates
        x = mouseX - width/2;
        y = -(mouseY - height/2);

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