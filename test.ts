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
basic.pause(500)
// Test scanning right
// Scan Right
basic.showString("SR")
TinyBit_Pro.scan_on_point(TinyBit_Pro.ScanDirection.Right, 3, 200, 150)
basic.pause(500)

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
basic.pause(500)
// Stop
TinyBit_Pro.controlMotors(0, 0)
basic.pause(500)

// --- New Comprehensive Tests Start Here ---

// RGB LEDs (Car Body) Tests
basic.showString("RGB")
basic.pause(200)
TinyBit_Pro.RGB_Car_Big(TinyBit_Pro.Color.Red)
basic.pause(500)
TinyBit_Pro.RGB_Car_Big(TinyBit_Pro.Color.Green)
basic.pause(500)
TinyBit_Pro.RGB_Car_Big(TinyBit_Pro.Color.Blue)
basic.pause(500)
TinyBit_Pro.RGB_Car_Big(TinyBit_Pro.Color.OFF)
basic.pause(500)
TinyBit_Pro.RGB_Car_Big2(255, 165, 0) // Orange
basic.pause(500)
TinyBit_Pro.RGB_Car_Big2(0, 0, 0) // Off
basic.pause(500)

// NeoPixel Strip Tests
basic.showString("NPX")
basic.pause(200)
let myStrip = TinyBit_Pro.RGB_Car_Program()
console.logValue("stripLength", myStrip.length())
myStrip.setPixelColor(0, TinyBit_Pro.NeoPixelColors.Red)
myStrip.setPixelColor(1, TinyBit_Pro.NeoPixelColors.Blue)
myStrip.show()
basic.pause(500)
myStrip.showColor(TinyBit_Pro.NeoPixelColors.Green)
basic.pause(500)
myStrip.showRainbow(1, 360)
basic.pause(500)
myStrip.shift(1)
myStrip.show()
basic.pause(500)
myStrip.rotate(1)
myStrip.show()
basic.pause(500)
myStrip.setBrightness(128)
myStrip.showColor(TinyBit_Pro.NeoPixelColors.White) // Should be dimmer
basic.pause(500)
myStrip.setBrightness(255) // Reset brightness
myStrip.showColor(TinyBit_Pro.NeoPixelColors.Purple)
basic.pause(500)
// Test easeBrightness
myStrip.easeBrightness()
myStrip.show() // Show with eased brightness
basic.pause(500)
// Test range
let subStrip = myStrip.range(0, 1)
console.logValue("subStripLength", subStrip.length())
subStrip.showColor(TinyBit_Pro.NeoPixelColors.Yellow) // Show yellow on first LED only
basic.pause(500)
myStrip.showBarGraph(50, 100) // Show bar graph on original strip
basic.pause(500)
console.logValue("stripPower", myStrip.power())
myStrip.clear()
myStrip.show()
basic.pause(500)

// Music Tests
basic.showString("MUS")
basic.pause(200)
TinyBit_Pro.Music_Car(TinyBit_Pro.Music.entertainer)
basic.pause(1000) // Allow some music to play
TinyBit_Pro.Music_Car(TinyBit_Pro.Music.punchline) // Play a short one
basic.pause(500)

// Car Control Tests (CarCtrl, CarCtrlSpeed, CarCtrlSpeed2, controlMotors variations)
basic.showString("MOT")
basic.pause(200)
// CarCtrl
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_Run)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_Back)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_Left)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_Right)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_SpinLeft)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_SpinRight)
basic.pause(500)
TinyBit_Pro.CarCtrl(TinyBit_Pro.CarState.Car_Stop)
basic.pause(500)

// CarCtrlSpeed
TinyBit_Pro.CarCtrlSpeed(TinyBit_Pro.CarState.Car_Run, 150)
basic.pause(500)
TinyBit_Pro.CarCtrlSpeed(TinyBit_Pro.CarState.Car_Back, 100)
basic.pause(500)
TinyBit_Pro.CarCtrlSpeed(TinyBit_Pro.CarState.Car_Stop, 0)
basic.pause(500)

// CarCtrlSpeed2
TinyBit_Pro.CarCtrlSpeed2(TinyBit_Pro.CarState.Car_Run, 200, 100) // Faster left
basic.pause(500)
TinyBit_Pro.CarCtrlSpeed2(TinyBit_Pro.CarState.Car_Run, 100, 200) // Faster right
basic.pause(500)
TinyBit_Pro.CarCtrlSpeed2(TinyBit_Pro.CarState.Car_Back, 150, 150)
basic.pause(500)
TinyBit_Pro.CarCtrlSpeed2(TinyBit_Pro.CarState.Car_Stop, 0, 0)
basic.pause(500)

// controlMotors variations
TinyBit_Pro.controlMotors(-100, -100) // Backwards
basic.pause(500)
TinyBit_Pro.controlMotors(150, -150) // Spin Left
basic.pause(500)
TinyBit_Pro.controlMotors(-150, 150) // Spin Right
basic.pause(500)
TinyBit_Pro.controlMotors(0, 0) // Stop
basic.pause(500)


// Sensor Tests
basic.showString("SEN")
basic.pause(200)
let distance = TinyBit_Pro.Ultrasonic_Car()
console.logValue("distance", distance)
basic.showNumber(distance) 
basic.pause(200) // Increased pause slightly

let distanceV2 = TinyBit_Pro.Ultrasonic_CarV2()
console.logValue("distanceV2", distanceV2)
basic.showNumber(distanceV2)
basic.pause(200)

let soundLevel = TinyBit_Pro.Voice_Sensor()
console.logValue("sound", soundLevel)
// Displaying sound level might be tricky if it's very dynamic,
// but showing it for a moment is fine.
basic.showNumber(soundLevel)
basic.pause(200)

let leftLineBlack = TinyBit_Pro.Line_Sensor(TinyBit_Pro.TrackSensorPosition.LeftState, TinyBit_Pro.LineValue.Black)
console.logValue("LBlack", leftLineBlack ? 1 : 0)
if (leftLineBlack) {
    basic.showLeds(`
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        `)
} else {
    basic.showLeds(`
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        `)
}
basic.pause(500)

let rightLineWhite = TinyBit_Pro.Line_Sensor(TinyBit_Pro.TrackSensorPosition.RightState, TinyBit_Pro.LineValue.White)
console.logValue("RWhite", rightLineWhite ? 1 : 0)
if (rightLineWhite) {
    basic.showLeds(`
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        `)
} else {
    basic.showLeds(`
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        `)
}
basic.pause(500)
basic.clearScreen()


// Test complete
basic.showIcon(IconNames.Happy)
basic.showString("DONE")
