TinyBit_Pro.slow_move_forward(100, 1000)
// Test slow backward
TinyBit_Pro.slow_move_backward(100, 1000)
// Test timed turn left
TinyBit_Pro.turn_left_for_time(150, 500)
// Test timed turn right
TinyBit_Pro.turn_right_for_time(150, 500)
// Test scanning left
// Scan Left
basic.showString("SL")
TinyBit_Pro.scan_on_point(TinyBit_Pro.ScanDirection.Left, 3, 200, 150)
// Test scanning right
// Scan Right
basic.showString("SR")
TinyBit_Pro.scan_on_point(TinyBit_Pro.ScanDirection.Right, 3, 200, 150)
// Test existing function (controlMotors)
// Diamond for motors
basic.showLeds(`
    . . # . .
    . # . # .
    # . . . #
    . # . # .
    . . # . .
    `)
TinyBit_Pro.controlMotors(100, 100)
// Stop
TinyBit_Pro.controlMotors(0, 0)
// Test complete
basic.showIcon(IconNames.Happy)
