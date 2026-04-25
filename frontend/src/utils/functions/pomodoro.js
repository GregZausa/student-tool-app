export const fmt = (secs) => {
  {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
};

export const formatDuration = (secs) => {
  {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m}m`;
    return `${m}m ${s}s`;
  }
};

export const timeAgo = (date) => {
  {
    const diff = Math.floor((Date.now() - date) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  }
};

export const createAmbientEngine = (audioCtx) => {
  {
    let nodes = [];

    const stop = () => {
      nodes.forEach((n) => {
        try {
          n.stop?.();
          n.disconnect?.();
        } catch {}
      });
      nodes = [];
    };

    const play = (type, volume = 0.3) => {
      stop();
      if (!audioCtx || type === "none") return;

      const master = audioCtx.createGain();
      master.gain.value = volume;
      master.connect(audioCtx.destination);
      nodes.push(master);

      if (type === "white") {
        const bufSize = audioCtx.sampleRate * 2;
        const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1000;
        src.connect(filter);
        filter.connect(master);
        src.start();
        nodes.push(src, filter);
      }

      if (type === "rain") {
        for (let i = 0; i < 3; i++) {
          const bufSize = audioCtx.sampleRate * 3;
          const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
          const data = buf.getChannelData(0);
          for (let j = 0; j < bufSize; j++) data[j] = Math.random() * 2 - 1;
          const src = audioCtx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.loopStart = Math.random() * 2;
          const filter = audioCtx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 400 + i * 800;
          filter.Q.value = 0.5;
          const gain = audioCtx.createGain();
          gain.gain.value = 0.3 + Math.random() * 0.2;
          src.connect(filter);
          filter.connect(gain);
          gain.connect(master);
          src.start(0, Math.random() * 2);
          nodes.push(src, filter, gain);
        }
      }

      if (type === "waves") {
        const osc = audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 0.15;
        const gainMod = audioCtx.createGain();
        gainMod.gain.value = 0.5;
        const bufSize = audioCtx.sampleRate * 4;
        const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 600;
        src.connect(filter);
        filter.connect(master);
        src.start();
        nodes.push(src, filter);
      }

      if (type === "forest") {
        for (let i = 0; i < 2; i++) {
          const bufSize = audioCtx.sampleRate * 2;
          const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
          const data = buf.getChannelData(0);
          for (let j = 0; j < bufSize; j++) data[j] = Math.random() * 2 - 1;
          const src = audioCtx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          const filter = audioCtx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 1500 + i * 2000;
          filter.Q.value = 2;
          const gain = audioCtx.createGain();
          gain.gain.value = 0.15;
          src.connect(filter);
          filter.connect(gain);
          gain.connect(master);
          src.start(0, Math.random());
          nodes.push(src, filter, gain);
        }
      }

      if (type === "cafe") {
        const bufSize = audioCtx.sampleRate * 4;
        const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 300;
        filter.Q.value = 0.8;
        src.connect(filter);
        filter.connect(master);
        src.start();
        nodes.push(src, filter);
      }

      if (type === "lofi") {
        const notes = [261.63, 329.63, 392.0, 493.88];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.value = freq;
          const gain = audioCtx.createGain();
          gain.gain.value = 0.04;
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          nodes.push(osc, gain);
        });
      }
    };

    return { play, stop };
  }
};
