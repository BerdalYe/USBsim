// The one law of USB: it goes in on the third try.
// Try 1: plug in -> wrong. Try 2: flip -> still wrong. Try 3: flip again -> correct.
(function (root) {
  const STEPS = [
    { button: 'Plug in', flip: false, fits: false, message: 'It is wrong.' },
    { button: 'Flip it', flip: true, fits: false, message: 'Still wrong.' },
    { button: 'Flip it again', flip: true, fits: true, message: 'Correct.' },
  ];

  function createUsb() {
    let step = 0;
    let flips = 0;
    let connected = false;

    return {
      // Label for the next action.
      get button() {
        return connected ? 'Unplug' : STEPS[step].button;
      },
      get connected() {
        return connected;
      },
      get flips() {
        return flips;
      },
      // Which side faces up. Note: it does not matter.
      get side() {
        return flips % 2 === 0 ? 'A' : 'B';
      },
      // Do the next action and return what happened.
      next() {
        if (connected) {
          step = 0;
          flips = 0;
          connected = false;
          return { flip: false, fits: false, unplugged: true, message: 'Unplugged.' };
        }
        const s = STEPS[step];
        if (s.flip) flips++;
        if (s.fits) connected = true;
        else step++;
        return { flip: s.flip, fits: s.fits, unplugged: false, message: s.message };
      },
    };
  }

  const api = { createUsb, STEPS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.UsbSim = api;
})(this);
