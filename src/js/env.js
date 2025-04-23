var env = {
    "app": {
        "version": "0.1.0",
        "framerate": 10
    },
    "canvas": {
        "width": 648,
        "height": 648
    },
    "table" : {
        "format": "cartesian",
        "units": "mm",
        "x": {
            "min": 0.0,
            "max": 472.0
        },
        "y": {
            "min": 0.0,
            "max": 380.0
        }
    },
    "motor": {
        "speed": 4000.0
    },
    "ball": {
        "diameter": 19.0
    },
    "gcode": {
        "command": "G0"
    },
    "recalculate_pattern": true,
    "mouse": {
        "pressed": false,
        "x": null,
        "y": null
    }
};

export default env;