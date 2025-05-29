//% color="#006400" weight=20 icon="\uf1b9"
namespace TinyBit_Pro {

    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01
    
    // Store the neopixel strip object globally
    let yahStrip: Strip; // Changed from neopixel.Strip to Strip

    /**
     * Well known colors for a NeoPixel strip
     */
    export enum NeoPixelColors {
        //% block=red
        Red = 0xFF0000,
        //% block=orange
        Orange = 0xFFA500,
        //% block=yellow
        Yellow = 0xFFFF00,
        //% block=green
        Green = 0x00FF00,
        //% block=blue
        Blue = 0x0000FF,
        //% block=indigo
        Indigo = 0x4b0082,
        //% block=violet
        Violet = 0x8a2be2,
        //% block=purple
        Purple = 0xFF00FF,
        //% block=white
        White = 0xFFFFFF,
        //% block=black
        Black = 0x000000
    }

    /**
     * Different modes for RGB or RGB+W NeoPixel strips
     */
    export enum NeoPixelMode {
        //% block="RGB (GRB format)"
        RGB = 0,
        //% block="RGB+W"
        RGBW = 1,
        //% block="RGB (RGB format)"
        RGB_RGB = 2
    }


    export enum Color {

        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow,

    }
    export enum Music {

        //% blockId="dadadum" block="dadadum"
        dadadum = 0,
        //% blockId="entertainer" block="entertainer"
        entertainer,
        //% blockId="prelude" block="prelude"
        prelude,
        //% blockId="ode" block="ode"
        ode,
        //% blockId="nyan" block="nyan"
        nyan,
        //% blockId="ringtone" block="ringtone"
        ringtone,
        //% blockId="funk" block="funk"
        funk,
        //% blockId="blues" block="blues"
        blues,
        //% blockId="birthday" block="birthday"
        birthday,
        //% blockId="wedding" block="wedding"
        wedding,
        //% blockId="funereal" block="funereal"
        funereal,
        //% blockId="punchline" block="punchline"
        punchline,
        //% blockId="baddy" block="baddy"
        baddy,
        //% blockId="chase" block="chase"
        chase,
        //% blockId="ba_ding" block="ba_ding"
        ba_ding,
        //% blockId="wawawawaa" block="wawawawaa"
        wawawawaa,
        //% blockId="jump_up" block="jump_up"
        jump_up,
        //% blockId="jump_down" block="jump_down"
        jump_down,
        //% blockId="power_up" block="power_up"
        power_up,
        //% blockId="power_down" block="power_down"
        power_down

    }
    export enum TrackSensorPosition {

        //% blockId="LeftState" block="LeftState"
        LeftState = 0,
        //% blockId="RightState" block="RightState"
        RightState = 1
    }

    export enum LineValue {
        //% blockId="White" block="White Line"
        White = 0,
        //% blockId="Black" block="Black Line"
        Black = 1
    }
    
    export enum ScanDirection {
        //% block="Left"
        Left = 0,
        //% block="Right"
        Right = 1
    }
    
    export enum CarState {
        //% blockId="Car_Run" block="Run"
        Car_Run = 1,
        //% blockId="Car_Back" block="Back"
        Car_Back = 2,
        //% blockId="Car_Left" block="Left"
        Car_Left = 3,
        //% blockId="Car_Right" block="Right"
        Car_Right = 4,
        //% blockId="Car_Stop" block="Stop"
        Car_Stop = 5,
        //% blockId="Car_SpinLeft" block="SpinLeft"
        Car_SpinLeft = 6,
        //% blockId="Car_SpinRight" block="SpinRight"
        Car_SpinRight = 7
    }

    function setPwmRGB(red: number, green: number, blue: number): void {

        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;
        
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    let car_flag_old = 0; //0: Both motors forward, 1: Both motors reverse, 2: Left turn, 3: Right turn
    let car_flag_new = 0; //0: Both motors forward, 1: Both motors reverse, 2: Left turn, 3: Right turn
    function setPwmMotor(mode: number, speed1: number, speed2: number): void {
        if (mode < 0 || mode > 6)
            return;
        
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        switch (mode) { 
            case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;              //stop
            case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;    //run
            case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; car_flag_new = 1; break;    //back
            case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0;      break;    //left
            case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; car_flag_new = 0;      break;    //right
            case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; car_flag_new = 2; break;    //tleft
            case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; car_flag_new = 3; break;    //tright
        }
        if(car_flag_new != car_flag_old) //If the state changes, stop for 100ms to protect the motor
        {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, bufff); // Send stop command
            basic.pause(100);
            car_flag_old = car_flag_new;
        }
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    function Car_run(speed1: number, speed2: number) {


        setPwmMotor(1, speed1, speed2);
    }

    function Car_back(speed1: number, speed2: number) {

        setPwmMotor(2, speed1, speed2);
    }

    function Car_left(speed1: number, speed2: number) {

        setPwmMotor(3, speed1, speed2);
    }

    function Car_right(speed1: number, speed2: number) {

        setPwmMotor(4, speed1, speed2);
    }

    function Car_stop() {
       
        setPwmMotor(0, 0, 0);
    }

    function Car_spinleft(speed1: number, speed2: number) {

        setPwmMotor(5, speed1, speed2);
    } 

    function Car_spinright(speed1: number, speed2: number) {

        setPwmMotor(6, speed1, speed2);
    }

    /**
     * *****************************************************************
     * @param index
     */   

    //% blockId=TinyBit_Pro_RGB_Car_Program block="Get RGB LEDs strip"
    //% weight=99
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Program(): Strip { // Changed from neopixel.Strip
         
        if (!yahStrip) {
            yahStrip = create(DigitalPin.P12, 2, NeoPixelMode.RGB); // Changed from neopixel.create
        }
        return yahStrip;  
    }  

    //% blockId=TinyBit_Pro_RGB_Car_Big block="Set all RGB LEDs to %value"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Big(value: Color): void {

        switch (value) {
            case Color.OFF: {
                setPwmRGB(0, 0, 0);
                break;
            }
            case Color.Red: {
                setPwmRGB(255, 0, 0);
                break;
            }
            case Color.Green: {
                setPwmRGB(0, 255, 0);
                break;
            }
            case Color.Blue: {
                setPwmRGB(0, 0, 255);
                break;
            }
            case Color.White: {
                setPwmRGB(255, 255, 255);
                break;
            }
            case Color.Cyan: {
                setPwmRGB(0, 255, 255);
                break;
            }
            case Color.Pinkish: {
                setPwmRGB(255, 0, 255);
                break;
            }
            case Color.Yellow: {
                setPwmRGB(255, 255, 0);
                break;
            }
        }
    }
    //% blockId=TinyBit_Pro_RGB_Car_Big2 block="Set all RGB LEDs to R:%value1 G:%value2 B:%value3"
    //% weight=97
    //% blockGap=10
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Big2(value1: number, value2: number, value3: number): void {

        setPwmRGB(value1, value2, value3);

    }
    //% blockId=TinyBit_Pro_Music_Car block="Play song %index"
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Car(index: Music): void {
        switch (index) {
            case Music.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case Music.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case Music.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case Music.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case Music.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case Music.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case Music.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case Music.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case Music.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case Music.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case Music.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case Music.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case Music.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case Music.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case Music.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case Music.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case Music.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case Music.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case Music.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case Music.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }
    
    
    
    //% blockId=TinyBit_Pro_CarCtrl block="Car action %index"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState): void {
        CarCtrlSpeed2(index, 255, 255);
    }
    
    //% blockId=TinyBit_Pro_CarCtrlSpeed block="Car action %index at speed %speed"
    //% weight=92
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed(index: CarState, speed: number): void {
        CarCtrlSpeed2(index, speed, speed);
    }
    
    //% blockId=TinyBit_Pro_CarCtrlSpeed2 block="Car state %index Left speed %speed1 Right speed %speed2"
    //% weight=91
    //% blockGap=10
    //% speed1.min=0 speed1.max=255 speed2.min=0 speed2.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed2(index: CarState, speed1: number, speed2: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed1, speed2); break;
            case CarState.Car_Back: Car_back(speed1, speed2); break;
            case CarState.Car_Left: Car_left(0, speed2); break;
            case CarState.Car_Right: Car_right(speed1, 0); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed1, speed2); break;
            case CarState.Car_SpinRight: Car_spinright(speed1, speed2); break;
        }
    }    
        
    //% blockId=TinyBit_Pro_control_motors block="Control Motors|left_speed:%sp_L|right_speed:%sp_R"
    //% color="#006400"
    //% weight=87
    //% sp_L.min=-255 sp_L.max=255  sp_R.min=-255 sp_R.max=255
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function controlMotors(sp_L:number,sp_R:number)
    {
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;

        if (sp_L < 0)//Reverse
        {
            buf[1] = 0;
            buf[2] = -sp_L;
        }
        else //Forward
        {
            buf[1] = sp_L;
            buf[2] = 0;
        }

        if (sp_R < 0)//Reverse
        {
            buf[3] = 0;
            buf[4] = -sp_R;
        }
        else //Forward
        {
            buf[3] = sp_R;
            buf[4] = 0;
        }

        if(sp_L>=0 && sp_R>=0) //Forward, Left, Right
        {
            car_flag_new = 0;
        }
        else if(sp_L<0 && sp_R<0)//Reverse
        {
            car_flag_new = 1;
        }
        else if(sp_L>0 && sp_R<0)//Spin Left
        {
            car_flag_new = 2;
        }
        else if(sp_L<0 && sp_R>0)//Spin Right
        {
            car_flag_new = 3;
        }

        if(car_flag_new != car_flag_old) //If the state changes, stop for 100ms to protect the motor
        {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, bufff); // Send stop command
            basic.pause(100);
            car_flag_old = car_flag_new;
        }

        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    //% blockId="TinyBit_Pro_slow_move_forward" block="Slow move forward at speed %speed for %duration_ms ms"
    //% speed.min=0 speed.max=200
    //% duration_ms.min=0
    //% weight=85 blockGap=10 color="#006400"
    export function slow_move_forward(speed: number, duration_ms: number): void {
        Car_run(speed, speed);
        basic.pause(duration_ms);
        Car_stop();
    }

    //% blockId="TinyBit_Pro_slow_move_backward" block="Slow move backward at speed %speed for %duration_ms ms"
    //% speed.min=0 speed.max=200
    //% duration_ms.min=0
    //% weight=84 blockGap=10 color="#006400"
    export function slow_move_backward(speed: number, duration_ms: number): void {
        Car_back(speed, speed);
        basic.pause(duration_ms);
        Car_stop();
    }

    //% blockId="TinyBit_Pro_turn_left_for_time" block="Turn left at speed %turn_speed for %turn_duration_ms ms"
    //% turn_speed.min=0 turn_speed.max=255
    //% turn_duration_ms.min=0
    //% weight=83 blockGap=10 color="#006400"
    export function turn_left_for_time(turn_speed: number, turn_duration_ms: number): void {
        Car_spinleft(turn_speed, turn_speed);
        basic.pause(turn_duration_ms);
        Car_stop();
    }

    //% blockId="TinyBit_Pro_turn_right_for_time" block="Turn right at speed %turn_speed for %turn_duration_ms ms"
    //% turn_speed.min=0 turn_speed.max=255
    //% turn_duration_ms.min=0
    //% weight=82 blockGap=10 color="#006400"
    export function turn_right_for_time(turn_speed: number, turn_duration_ms: number): void {
        Car_spinright(turn_speed, turn_speed);
        basic.pause(turn_duration_ms);
        Car_stop();
    }

    //% blockId="TinyBit_Pro_scan_on_point" block="Scan on point %direction %segments times, each for %segment_duration_ms ms at speed %scan_speed"
    //% scan_speed.min=0 scan_speed.max=255
    //% segment_duration_ms.min=100
    //% segments.min=1 segments.max=10
    //% weight=81 blockGap=10 color="#006400"
    //% inlineInputMode=inline 
    export function scan_on_point(direction: ScanDirection, segments: number, segment_duration_ms: number, scan_speed: number): void {
        for (let i = 0; i < segments; i++) {
            if (direction == ScanDirection.Left) {
                Car_spinleft(scan_speed, scan_speed);
            } else { // ScanDirection.Right
                Car_spinright(scan_speed, scan_speed);
            }
            basic.pause(segment_duration_ms);
            Car_stop();
            if (i < segments - 1) { // Pause between segments, but not after the last one
                basic.pause(200); // Brief pause for potential sensor reading
            }
        }
    }
   
    //% blockId=TinyBit_Pro_Line_Sensor block="Line sensor at %direct sees %value"
    //% weight=89
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Line_Sensor(direct: TrackSensorPosition, value: LineValue): boolean {

        let temp: boolean = false;
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        switch (direct) {
            case TrackSensorPosition.LeftState: {
                if (pins.digitalReadPin(DigitalPin.P13) == value) {              
                    temp = true;                  
                }
                else {                  
                     temp = false;
                }
                break;
            }

            case TrackSensorPosition.RightState: {
                if (pins.digitalReadPin(DigitalPin.P14) == value) {              
                    temp = true;                  
                }
                else {
                    temp = false;
                }
                break;
            }
        }
        return temp;

    }

    //% blockId=TinyBit_Pro_Voice_Sensor block="Get sound level"
    //% weight=88
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Voice_Sensor(): number {
	    //pins.setPull(DigitalPin.P1, PinPullMode.PullUp);
        let temp  = 0;		
        temp = pins.analogReadPin(AnalogPin.P1);           
            
        return temp;

    }
        
    //% blockId=TinyBit_Pro_Ultrasonic_Car block="Get distance (cm)"
    //% color="#006400"
    //% weight=87
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Car(): number {

       	let list:Array<number> = [0, 0, 0, 0, 0];
				for (let i = 0; i < 5; i++)
				{
					pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
					pins.digitalWritePin(DigitalPin.P16, 0);
					control.waitMicros(2);
					pins.digitalWritePin(DigitalPin.P16, 1);
					control.waitMicros(15);
					pins.digitalWritePin(DigitalPin.P16, 0);
					let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
					list[i] = Math.floor(d / 40);
				}
				list.sort();
				let length = (list[1] + list[2] + list[3])/3;
				return  Math.floor(length);
    }
        
    // V2 is optimized for a specific hardware revision of the ultrasonic sensor.
    //% blockId=TinyBit_Pro_Ultrasonic_CarV2 block="Get distance V2 (cm)"
    //% color="#006400"
    //% weight=87
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_CarV2(): number {
		pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
		pins.digitalWritePin(DigitalPin.P16, 0);
		control.waitMicros(4);
		pins.digitalWritePin(DigitalPin.P16, 1);
		control.waitMicros(10);
		pins.digitalWritePin(DigitalPin.P16, 0);

		let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 500 * 58);
        return  Math.floor(d / 58);
    }

    // NeoPixel specific code, moved inside TinyBit_Pro namespace

    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
        // This function is implemented in assembly
    }

    /**
     * A NeoPixel strip
     */
    export class Strip {
        buf: Buffer;
        pin: DigitalPin;
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any
        _matrixChain: number; // the connection type of matrix chain
        _matrixRotation: number; // the rotation type of matrix

        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        showRainbow(startHue: number = 1, endHue: number = 360) {
            if (this._length <= 0) return;

            startHue = startHue >> 0;
            endHue = endHue >> 0;
            const saturation = 100;
            const luminance = 50;
            const steps = this._length;
            const direction = HueInterpolationDirection.Clockwise;

            const h1 = startHue;
            const h2 = endHue;
            const hDistCW = ((h2 + 360) - h1) % 360;
            const hStepCW = Math.idiv((hDistCW * 100), steps);
            const hDistCCW = ((h1 + 360) - h2) % 360;
            const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
            let hStep: number;
            if (direction === HueInterpolationDirection.Clockwise) {
                hStep = hStepCW;
            } else if (direction === HueInterpolationDirection.CounterClockwise) {
                hStep = hStepCCW;
            } else {
                hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
            }
            const h1_100 = h1 * 100;

            const s1 = saturation;
            const s2 = saturation;
            const sDist = s2 - s1;
            const sStep = Math.idiv(sDist, steps);
            const s1_100 = s1 * 100;

            const l1 = luminance;
            const l2 = luminance;
            const lDist = l2 - l1;
            const lStep = Math.idiv(lDist, steps);
            const l1_100 = l1 * 100;

            if (steps === 1) {
                this.setPixelColor(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
            } else {
                this.setPixelColor(0, hsl(startHue, saturation, luminance));
                for (let i = 1; i < steps - 1; i++) {
                    const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                    const s = Math.idiv((s1_100 + i * sStep), 100);
                    const l = Math.idiv((l1_100 + i * lStep), 100);
                    this.setPixelColor(i, hsl(h, s, l));
                }
                this.setPixelColor(steps - 1, hsl(endHue, saturation, luminance));
            }
            this.show();
        }

        showBarGraph(value: number, high: number): void {
            if (high <= 0) {
                this.clear();
                this.setPixelColor(0, NeoPixelColors.Yellow);
                this.show();
                return;
            }

            value = Math.abs(value);
            const n = this._length;
            const n1 = n - 1;
            let v = Math.idiv((value * n), high);
            if (v == 0) {
                this.setPixelColor(0, 0x666600);
                for (let i = 1; i < n; ++i)
                    this.setPixelColor(i, 0);
            } else {
                for (let i = 0; i < n; ++i) {
                    if (i <= v) {
                        const b = Math.idiv(i * 255, n1);
                        this.setPixelColor(i, rgb(b, 0, 255 - b)); // Using global rgb
                    }
                    else this.setPixelColor(i, 0);
                }
            }
            this.show();
        }

        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        setMatrixWidth(width: number, rotation: number, chain: number) {
            this._matrixWidth = Math.min(this._length, width >> 0);
            this._matrixRotation = rotation >> 0;
            this._matrixChain = chain >> 0;
        }
        
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; 
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;
            const cols = Math.idiv(this._length, this._matrixWidth);

            if (this._matrixRotation == 1) {
                let t = y;
                y = x;
                x = t;
            } else if (this._matrixRotation == 2) {
                x = this._matrixWidth - x - 1;
            }

            if (this._matrixChain == 1 && y % 2 == 1) {
                x = this._matrixWidth - x - 1;
            }
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;

            let i = x + y * this._matrixWidth;
            this.setPixelColor(i, rgb);
        }

        setPixelWhiteLED(pixeloffset: number, white: number): void {
            if (this._mode === NeoPixelMode.RGBW) {
                this.setPixelW(pixeloffset >> 0, white >> 0);
            }
        }

        show() {
            sendBuffer(this.buf, this.pin);
        }

        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        length() {
            return this._length;
        }

        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        easeBrightness(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = this.brightness;
            const buf = this.buf;
            const end = this.start + this._length;
            const mid = Math.idiv(this._length, 2);
            for (let i = this.start; i < end; ++i) {
                const k = i - this.start;
                const ledoffset = i * stride;
                const br_ease = k > mid
                    ? Math.idiv(255 * (this._length - 1 - k) * (this._length - 1 - k), (mid * mid))
                    : Math.idiv(255 * k * k, (mid * mid));
                //serial.writeLine(k + ":" + br_ease); // Assuming serial might not be available or desired here
                const r = (buf[ledoffset + 0] * br_ease) >> 8; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * br_ease) >> 8; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * br_ease) >> 8; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * br_ease) >> 8; buf[ledoffset + 3] = w;
                }
            }
        }

        range(start: number, length: number): Strip {
            start = start >> 0;
            length = length >> 0;
            let strip = new Strip();
            strip.buf = this.buf;
            strip.pin = this.pin;
            strip.brightness = this.brightness;
            strip.start = this.start + Math.clamp(0, this._length - 1, start);
            strip._length = Math.clamp(0, this._length - (strip.start - this.start), length);
            strip._matrixWidth = 0;
            strip._mode = this._mode;
            return strip;
        }

        shift(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.shift(-offset * stride, this.start * stride, this._length * stride)
        }

        rotate(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.rotate(-offset * stride, this.start * stride, this._length * stride)
        }

        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
        }

        power(): number {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const end = this.start + this._length;
            let p = 0;
            for (let i = this.start; i < end; ++i) {
                const ledoffset = i * stride;
                for (let j = 0; j < stride; ++j) {
                    p += this.buf[ledoffset + j]; // Corrected index from i+j to ledoffset+j
                }
            }
            return Math.idiv(this.length(), 2) 
                + Math.idiv(p * 433, 10000); 
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setAllW(white: number) {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            let end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                let ledoffset = i * 4;
                buf[ledoffset + 3] = white;
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
        private setPixelW(pixeloffset: number, white: number): void {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 4;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            buf[pixeloffset + 3] = white;
        }
    }

    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        let strip = new Strip();
        let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
        strip.buf = pins.createBuffer(numleds * stride);
        strip.start = 0;
        strip._length = numleds;
        strip._mode = mode;
        strip._matrixWidth = 0;
        strip.setBrightness(255)
        strip.setPin(pin)
        return strip;
    }

    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    // Renamed neopixel.colors to avoid conflict if it's a global MakeCode function
    // For now, we assume NeoPixelColors enum is used directly where needed.
    // If a block like %color was intended for the enum itself, that's handled by the enum's block definition.
    // export function colors(color: NeoPixelColors): number {
    //    return color;
    // }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); 
        let h1 = Math.idiv(h, 60);
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }
}

