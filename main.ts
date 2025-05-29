/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"TinyBit-Pro": "file:../pxt-Tinybit"
*/

//% color="#006400" weight=20 icon="\uf1b9"
namespace TinyBit_Pro {

    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01
    
    let yahStrip: neopixel.Strip;

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

    //% blockId=TinyBit_Pro_RGB_Car_Program block="RGB_Car_Program"
    //% weight=99
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Program(): neopixel.Strip {
         
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 2, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }  

    //% blockId=TinyBit_Pro_RGB_Car_Big block="RGB_Car_Big|value %value"
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
    //% blockId=TinyBit_Pro_RGB_Car_Big2 block="RGB_Car_Big2|value1 %value1|value2 %value2|value3 %value3"
    //% weight=97
    //% blockGap=10
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Big2(value1: number, value2: number, value3: number): void {

        setPwmRGB(value1, value2, value3);

    }
    //% blockId=TinyBit_Pro_Music_Car block="Music_Car|%index"
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
    
    
    
    //% blockId=TinyBit_Pro_CarCtrl block="CarCtrl|%index"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState): void {
        CarCtrlSpeed2(index, 255, 255);
    }
    
    //% blockId=TinyBit_Pro_CarCtrlSpeed block="CarCtrlSpeed|%index|speed %speed"
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
   
    //% blockId=TinyBit_Pro_Line_Sensor block="Line_Sensor|direct %direct|value %value"
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

    //% blockId=TinyBit_Pro_Voice_Sensor block="Voice Sensor return"
    //% weight=88
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Voice_Sensor(): number {
	    //pins.setPull(DigitalPin.P1, PinPullMode.PullUp);
        let temp  = 0;		
        temp = pins.analogReadPin(AnalogPin.P1);           
            
        return temp;

    }
        
    //% blockId=TinyBit_Pro_Ultrasonic_Car block="ultrasonic return distance(cm)"
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
    //% blockId=TinyBit_Pro_Ultrasonic_CarV2 block="ultrasonic for V2 return distance(cm)"
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
}

