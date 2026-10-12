import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, KeyRound } from 'lucide-react';

export default function OtpInput({
  length = 6,
  onComplete,
  onResend,
  isLoading = false,
  demoCode = '482910',
}) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    // Focus first input automatically
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return; // numbers only

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto move to next input if digit entered
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Trigger onComplete when full
    if (newOtp.every((val) => val !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    if (pastedData.length === length) {
      onComplete(pastedData);
    } else {
      inputsRef.current[pastedData.length]?.focus();
    }
  };

  const handleQuickFill = () => {
    const codeArr = demoCode.split('');
    setOtp(codeArr);
    onComplete(demoCode);
  };

  const handleResendClick = () => {
    setTimer(60);
    setOtp(new Array(length).fill(''));
    if (inputsRef.current[0]) inputsRef.current[0].focus();
    if (onResend) onResend();
  };

  return (
    <div className="space-y-6">
      {/* 6 Individual Input Boxes */}
      <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all text-slate-900 dark:text-white"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Demo helper badge */}
      <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-300">
          <KeyRound className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>Demo verification code: <strong className="font-mono font-bold tracking-wider">{demoCode}</strong></span>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800"
        >
          Auto Fill
        </button>
      </div>

      {/* Timer & Resend */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>
          {timer > 0 ? (
            <>Code expires in <strong className="text-slate-800 dark:text-slate-200 font-bold">{timer}s</strong></>
          ) : (
            'Code expired'
          )}
        </span>
        <button
          type="button"
          disabled={timer > 0 || isLoading}
          onClick={handleResendClick}
          className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:pointer-events-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resend OTP
        </button>
      </div>
    </div>
  );
}
