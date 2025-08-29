export function createWorker(): Worker {
  const workerCode = `
    // Drift-correcting timer worker for metronome ticks
    let timerID = null;
    let interval = 100; // ms
    let running = false;

    function startTimer() {
      if (timerID !== null) {
        clearTimeout(timerID);
        timerID = null;
      }
      running = true;
      // Use a self-adjusting timeout to reduce drift
      let expected = Date.now() + interval;
      function tick() {
        if (!running) return;
        postMessage("tick");
        expected += interval;
        const drift = Date.now() - expected;
        const next = Math.max(0, interval - drift);
        timerID = setTimeout(tick, next);
      }
      timerID = setTimeout(tick, interval);
    }

    function stopTimer() {
      running = false;
      if (timerID !== null) {
        clearTimeout(timerID);
        timerID = null;
      }
    }

    self.onmessage = (e) => {
      const data = e.data;

      // legacy string commands
      if (typeof data === 'string') {
        if (data === 'start') {
          startTimer();
          return;
        }
        if (data === 'stop') {
          stopTimer();
          return;
        }
        return;
      }

      // object commands: { cmd: 'start'|'stop'|'setInterval', interval?: number } or { interval: N }
      if (data && typeof data === 'object') {
        if ('interval' in data && data.interval != null) {
          const newInterval = Number(data.interval) || interval;
          interval = newInterval;
          // if running, restart to pick up new interval immediately
          if (running) {
            stopTimer();
            startTimer();
          }
        }

        if ('cmd' in data) {
          const cmd = String(data.cmd);
          if (cmd === 'start') {
            startTimer();
          } else if (cmd === 'stop') {
            stopTimer();
          } else if (cmd === 'setInterval' && 'interval' in data) {
            const newInterval = Number(data.interval) || interval;
            interval = newInterval;
            if (running) {
              stopTimer();
              startTimer();
            }
          }
        }
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const w = new Worker(workerUrl);
  // revoke the blob URL to avoid leaking; worker keeps running
  URL.revokeObjectURL(workerUrl);
  return w;
}
