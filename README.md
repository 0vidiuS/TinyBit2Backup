# TinyBit-Pro MakeCode Extension

TinyBit-Pro is an enhanced version of the original TinyBit extension, offering new features...
BaSED on Extension for Yahboom Tiny:bit V2.0.3

An enhanced version of the TinyBit extension with additional features and improvements.
Made for personal tests by 0vi. NeoPixel is also Included,
here you can find a demo : https://github.com/0vidiuS/TinyBit2Backup/blob/main/test.ts

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

## Examples

Here are a few examples of how to use some of the blocks from the TinyBit-Pro extension:

**1. Slow Forward Movement**
Move forward slowly (speed 100) for 1 second.
```typescript
// Move forward slowly for 1 second
TinyBit_Pro.slow_move_forward(100, 1000);
```
*(Imagine a MakeCode block image here showing the "Slow move forward" block)*

**2. Timed Turn**
Turn left (speed 150) for half a second.
```typescript
// Turn left for half a second
TinyBit_Pro.turn_left_for_time(150, 500);
```
*(Imagine a MakeCode block image here showing the "Turn left for time" block)*

**3. Scanning on Point**
Scan to the left in 3 segments. Each segment spins for 200ms at speed 150.
```typescript
// Scan left in 3 segments
TinyBit_Pro.scan_on_point(TinyBit_Pro.ScanDirection.Left, 3, 200, 150);
```
*(Imagine a MakeCode block image here showing the "Scan on point" block)*
