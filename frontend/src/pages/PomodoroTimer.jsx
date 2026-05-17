import { useState, useEffect, useRef, useCallback } from "react";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import Header from "../components/layout/Header";
import { Lightbulb, RotateCcw, SkipForward, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AMBIENT_SOUNDS,
  MODES,
  SUBJECT_OPTIONS,
} from "../utils/constants/pomodoro-config";
import CircularTimer from "../components/CircularTimer";
import {
  createAmbientEngine,
  fmt,
  formatDuration,
} from "../utils/functions/pomodoro";
import SessionItem from "../components/SessionItem";
import Button from "../components/ui/Button";
import TipBox from "../components/TipBox";
import { useTheme } from "../context/ThemeContext";

function playAlarm(audioCtx, type = "focus") {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.value = 0.5;
  master.connect(audioCtx.destination);

  const configs = {
    focus: [
      { freq: 523.25, start: 0, dur: 0.15 },
      { freq: 659.25, start: 0.18, dur: 0.15 },
      { freq: 783.99, start: 0.36, dur: 0.25 },
      { freq: 1046.5, start: 0.64, dur: 0.4 },
    ],
    shortBreak: [
      { freq: 880, start: 0, dur: 0.2 },
      { freq: 1108, start: 0.3, dur: 0.3 },
    ],
    longBreak: [
      { freq: 698.46, start: 0, dur: 0.2 },
      { freq: 783.99, start: 0.25, dur: 0.2 },
      { freq: 880, start: 0.5, dur: 0.35 },
    ],
  };

  (configs[type] || configs.focus).forEach(({ freq, start, dur }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.6, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

const PomodoroTimer = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [mode, setMode] = useState("focus");
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [sessions, setSessions] = useState([]);

  const [ambientSound, setAmbientSound] = useState("none");
  const [volume, setVolume] = useState(0.3);

  const [showSettings, setShowSettings] = useState(false);
  const [tempDurations, setTempDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const audioCtxRef = useRef(null);
  const ambientRef = useRef(null);
  const intervalRef = useRef(null);
  const completingRef = useRef(false);

  const modeRef = useRef(mode);
  const durationsRef = useRef(durations);
  const subjectRef = useRef(subject);
  const customSubjRef = useRef(customSubject);
  const cycleCountRef = useRef(cycleCount);
  const pomodoroRef = useRef(pomodoroCount);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);
  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);
  useEffect(() => {
    customSubjRef.current = customSubject;
  }, [customSubject]);
  useEffect(() => {
    cycleCountRef.current = cycleCount;
  }, [cycleCount]);
  useEffect(() => {
    pomodoroRef.current = pomodoroCount;
  }, [pomodoroCount]);

  const totalFocusToday = sessions
    .filter((s) => s.mode === "focus" && s.completed)
    .reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.filter(
    (s) => s.mode === "focus" && s.completed,
  ).length;

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
      ambientRef.current = createAmbientEngine(audioCtxRef.current);
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
  }, []);

  useEffect(() => {
    if (!ambientRef.current) return;
    ambientRef.current.play(ambientSound, volume);
  }, [ambientSound, volume]);

  const handleSessionComplete = useCallback(
    (completedMode, logSession = true) => {
      const durs = durationsRef.current;

      const subj =
        subjectRef.current === "Other"
          ? customSubjRef.current
          : subjectRef.current;

      let cycle = cycleCountRef.current;

      if (logSession) {
        setSessions((prev) => [
          {
            id: crypto.randomUUID(),
            mode: completedMode,
            subject: subj,
            duration: durs[completedMode] * 60,
            completedAt: Date.now(),
            completed: true,
          },
          ...prev,
        ]);
      }

      playAlarm(audioCtxRef.current, completedMode);

      let nextMode;
      let nextCycle = cycle;

      if (completedMode === "focus") {
        nextCycle = cycle + 1;

        setPomodoroCount((c) => c + 1);

        if (nextCycle >= 4) {
          nextMode = "longBreak";
          nextCycle = 0;
        } else {
          nextMode = "shortBreak";
        }

        setCycleCount(nextCycle);
      } else if (completedMode === "shortBreak") {
        nextMode = "focus";
      } else if (completedMode === "longBreak") {
        setCycleCount(0);
        setMode("focus");
        setTimeLeft(durs.focus * 60);
        setIsRunning(false);
        return;
      }

      setMode(nextMode);
      setTimeLeft(durs[nextMode] * 60);
      setIsRunning(false);
      setTimeout(() => setIsRunning(true), 0);

      if (Notification.permission === "granted") {
        new Notification(
          completedMode === "focus"
            ? "Focus session done! 🎉"
            : "Break over! 💪",
        );
      }
    },
    [],
  );

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    completingRef.current = false;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (completingRef.current) return 0;
        completingRef.current = true;

        clearInterval(intervalRef.current);

        setTimeout(() => {
          handleSessionComplete(modeRef.current, true);
        }, 0);

        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, handleSessionComplete]);

  useEffect(() => {
    document.title = isRunning
      ? `${fmt(timeLeft)} — ${MODES[mode].label} | Pomodoro`
      : "Pomodoro Timer | PH Study Tools";
  }, [timeLeft, isRunning, mode]);

  const handleStart = () => {
    initAudio();
    setIsRunning((v) => !v);
    if (Notification.permission === "default") Notification.requestPermission();
  };

  const handleReset = () => {
    setIsRunning(false);
    completingRef.current = false;
    setTimeLeft(durations[mode] * 60);
  };

  const handleModeSwitch = (newMode) => {
    setIsRunning(false);
    completingRef.current = false;
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  };

  const handleSkip = () => {
    clearInterval(intervalRef.current);
    completingRef.current = true;

    if (isRunning) {
      const subj = subject === "Other" ? customSubject : subject;
      setSessions((prev) => [
        {
          id: crypto.randomUUID(),
          mode,
          subject: subj,
          duration: durations[mode] * 60 - timeLeft,
          completedAt: Date.now(),
          completed: false,
        },
        ...prev,
      ]);
    }
    setIsRunning(false);
    setTimeout(() => {
      handleSessionComplete(mode, false);
    }, 0);
  };

  const applySettings = () => {
    setDurations(tempDurations);
    setTimeLeft(tempDurations[mode] * 60);
    setIsRunning(false);
    setShowSettings(false);
  };

  const progress = 1 - timeLeft / (durations[mode] * 60);
  const activeSubject = subject === "Other" ? customSubject : subject;

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="Pomodoro Timer"
        subHeader="Focus. Break. Repeat. — Para sa mga estudyante 🇵🇭"
        icon={<Timer size={20} className="text-purple-500" />}
        onClick={() => navigate("/")}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AdSenseAd />

        <div
          className={`flex gap-1 ${isDark ? "bg-slate-700" : "bg-slate-100"} rounded-xl p-1 mt-5 mb-5`}
        >
          {Object.entries(MODES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleModeSwitch(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                mode === key
                  ? isDark
                    ? "bg-slate-50 text-slate-700 shadow-sm"
                    : "bg-slate-800 text-slate-100 shadow-sm"
                  : "bg-transparent text-slate-400 hover:text-slate-700 hover:bg-white"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <div
          className={`${isDark ? "bg-slate-800" : "bg-slate-50"} rounded-2xl border ${MODES[mode].border} p-6 mb-4 flex flex-col items-center gap-5`}
        >
          <div className="flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < cycleCount ? "bg-indigo-500 scale-110" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <CircularTimer
            progress={progress}
            mode={mode}
            timeLeft={timeLeft}
            isRunning={isRunning}
          />

          {activeSubject && (
            <div
              className={`flex items-center gap-2 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}  rounded-xl px-3 py-1.5`}
            >
              <span className="text-xs text-slate-500">Studying:</span>
              <span
                className={`text-xs font-semibold ${isDark ? "text-slate-100" : "text-slate-700"}`}
              >
                {activeSubject}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button icon={RotateCcw} onClick={handleReset} label="Reset" />
            <Button
              variant="excel"
              onClick={handleStart}
              label={
                isRunning
                  ? "Pause"
                  : timeLeft === durations[mode] * 60
                    ? "Start"
                    : "Resume"
              }
            />
            <Button
              label="Skip"
              icon={SkipForward}
              onClick={handleSkip}
              variant="secondary"
            />
          </div>
        </div>

        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl  p-4 mb-4`}
        >
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Session setup
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Subject
              </div>
              <SelectBox
                options={SUBJECT_OPTIONS}
                value={subject}
                onChange={setSubject}
                placeholder="Pick a subject"
                searchable={false}
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Ambient sound
              </div>
              <SelectBox
                options={AMBIENT_SOUNDS}
                value={ambientSound}
                onChange={(val) => {
                  initAudio();
                  setAmbientSound(val);
                }}
                placeholder="No sound"
                searchable={false}
              />
            </div>
          </div>

          {subject === "Other" && (
            <div className="mb-3">
              <FloatingLabelInput
                type="text"
                label="Custom subject name"
                value={customSubject}
                onChange={(val) => setCustomSubject(val)}
              />
            </div>
          )}

          {ambientSound !== "none" && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider w-14">
                Volume
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  initAudio();
                }}
                className="flex-1 h-1.5 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            {
              label: "Focus sessions",
              value: totalSessions,
              color: "text-indigo-500",
            },
            {
              label: "Focus time",
              value:
                totalFocusToday > 0 ? formatDuration(totalFocusToday) : "0m",
              color: "text-emerald-500",
            },
            {
              label: "Pomodoros",
              value: `${pomodoroCount} 🍅`,
              color: "text-orange-500",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-3.5  text-center`}
            >
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">
                {label}
              </div>
              <div className={`text-xl font-bold font-mono ${color}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl  mb-4 overflow-hidden`}
        >
          <button
            onClick={() => {
              setTempDurations(durations);
              setShowSettings((v) => !v);
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold ${isDark ? "text-slate-100 hover-bg-slate-700" : "text-slate-700 hover:bg-slate-100"}  transition-colors cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              ⚙️ Custom timer durations
            </span>
            <span
              className={`text-slate-400 transition-transform ${showSettings ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          {showSettings && (
            <div className="px-4 pb-4 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { key: "focus", label: "Focus (min)" },
                  { key: "shortBreak", label: "Short break (min)" },
                  { key: "longBreak", label: "Long break (min)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <FloatingLabelInput
                      label={label}
                      type="number"
                      min={1}
                      max={120}
                      value={tempDurations[key]}
                      onChange={(val) =>
                        setTempDurations((d) => ({
                          ...d,
                          [key]:
                            val === ""
                              ? ""
                              : Math.max(1, Math.min(120, Number(val))),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={applySettings}
                className="mt-3 w-full py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
              >
                Apply settings
              </button>
            </div>
          )}
        </div>

        <AdSenseAd />

        <div
          className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl  p-4 mb-40`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className={`text-sm font-semibold  ${isDark ? "text-slate-50" : "text-slate-800"}`}
            >
              📋 Session log
            </h3>
            {sessions.length > 0 && (
              <button
                onClick={() => setSessions([])}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-6 text-slate-300">
              <div className="text-3xl mb-2">🍅</div>
              <div className="text-sm">
                No sessions yet. Start your first pomodoro!
              </div>
            </div>
          ) : (
            <div>
              {sessions.slice(0, 8).map((s) => (
                <SessionItem key={s.id} session={s} />
              ))}
              {sessions.length > 8 && (
                <div className="text-center text-xs text-slate-400 pt-2">
                  +{sessions.length - 8} more sessions
                </div>
              )}
            </div>
          )}
        </div>

        <TipBox
          icon={Lightbulb}
          isDark={isDark}
          title="Pomodoro tips para sa mga Pinoy students"
          tips={[
            <>
              {" "}
              Subukan ang <strong>25 min focus + 5 min break</strong>—simple
              pero proven na effective para sa concentration.{" "}
            </>,
            <>
              {" "}
              Pagkatapos ng <strong>4 na sessions</strong>, mag-long break ng
              15–30 minuto para hindi ka ma-burnout.{" "}
            </>,
            <>
              {" "}
              <strong>Isang task lang bawat session</strong>—multitasking kills
              focus.{" "}
            </>,
            <>
              {" "}
              I-silent ang phone mo (or ilayo mo muna) habang naka-focus
              mode—biggest distraction yan.{" "}
            </>,
            <>
              {" "}
              Gamitin ang break para{" "}
              <strong>mag-stretch, uminom ng tubig, o lumabas</strong>—huwag
              mag-scroll agad.{" "}
            </>,
            <>
              {" "}
              <strong>Pro tip:</strong> Kahit 1–2 sessions lang matapos mo
              today, progress pa rin yan.{" "}
            </>,
          ]}
        />

        <AdSenseAd />

        <p className="text-center text-[11px] text-slate-500 mt-5">
          Pomodoro Timer · PH Study Tools 🇵🇭
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
