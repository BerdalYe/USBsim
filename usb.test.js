const test = require('node:test');
const assert = require('node:assert');
const { createUsb } = require('./usb.js');

test('plug in, wrong; flip, still wrong; flip again, correct', () => {
  const usb = createUsb();

  assert.strictEqual(usb.button, 'Plug in');
  let r = usb.next();
  assert.deepStrictEqual([r.flip, r.fits, r.message], [false, false, 'It is wrong.']);
  assert.strictEqual(usb.side, 'A');

  assert.strictEqual(usb.button, 'Flip it');
  r = usb.next();
  assert.deepStrictEqual([r.flip, r.fits, r.message], [true, false, 'Still wrong.']);
  assert.strictEqual(usb.side, 'B');

  assert.strictEqual(usb.button, 'Flip it again');
  r = usb.next();
  assert.deepStrictEqual([r.flip, r.fits, r.message], [true, true, 'Correct.']);
  assert.strictEqual(usb.connected, true);
  // Back on the side that was "wrong" the first time.
  assert.strictEqual(usb.side, 'A');
});

test('unplug resets to the start', () => {
  const usb = createUsb();
  usb.next();
  usb.next();
  usb.next();
  assert.strictEqual(usb.button, 'Unplug');

  const r = usb.next();
  assert.strictEqual(r.unplugged, true);
  assert.strictEqual(usb.connected, false);
  assert.strictEqual(usb.flips, 0);
  assert.strictEqual(usb.button, 'Plug in');
  assert.strictEqual(usb.next().message, 'It is wrong.');
});
