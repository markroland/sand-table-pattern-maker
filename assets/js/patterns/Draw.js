class Draw {

  constructor() {

    this.key = "draw";

    this.name = "Free Draw";

    this.config = {
    };

    this.path = [];
  }

  setup() {
    path = [0,0]
  }

  draw() {

    if (mouseIsPressed) {
        path.push([
            mouseX-width/2,
            -(mouseY-height/2)
        ])
    }

    return path;
  }
}