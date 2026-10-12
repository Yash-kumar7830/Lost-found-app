import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Camera, CameraOff, AlertCircle, QrCode, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';

export default function QrScanner({ onScanSuccess, onManualSubmit }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [manualId, setManualId] = useState('');

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Initialize ZXing reader
  useEffect(() => {
    codeReaderRef.current = new BrowserQRCodeReader();

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((allDevices) => {
          const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
          setDevices(videoInputs);
          if (videoInputs.length > 0) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        })
        .catch(() => {
          // Camera enumeration fallback
        });
    }

    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleDetectedQr = useCallback((qrText) => {
    stopCamera();
    onScanSuccess(qrText);
  }, [stopCamera, onScanSuccess]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by your browser.');
      }

      const constraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'environment' }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        if (codeReaderRef.current) {
          codeReaderRef.current.decodeFromVideoElement(
            videoRef.current,
            (result) => {
              if (result) {
                handleDetectedQr(result.getText());
              }
            }
          );
        }
      }
    } catch (err) {
      console.warn('Camera start error:', err);
      setCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings or use manual ID entry below.'
          : 'Unable to start camera stream. You can simulate scan or enter your ID manually.'
      );
    }
  };

  const handleSimulateScan = () => {
    stopCamera();
    const demoPayload = JSON.stringify({
      studentId: "STU-2024-8842",
      name: "Aarav Sharma",
      department: "Computer Science & Eng.",
      validThru: "2027",
      institutionCode: "CAMPUS-TECH"
    });
    onScanSuccess(demoPayload);
  };

  const handleManualForm = (e) => {
    e.preventDefault();
    if (manualId.trim()) {
      onManualSubmit(manualId.trim());
    }
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Security Note:</strong> Scanning a student card extracts credential parameters only. Full identity verification requires entering the one-time security password (OTP) in Step 4.
        </p>
      </div>

      {/* Camera Preview Area */}
      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border-2 border-slate-800 shadow-inner">
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            {/* Target reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 border-2 border-indigo-400/80 rounded-2xl relative animate-pulse">
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
                <div className="absolute inset-x-2 top-1/2 h-0.5 bg-indigo-500/60 -translate-y-1/2 shadow-xs" />
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Scanning student card...</span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-indigo-400 flex items-center justify-center mx-auto border border-slate-800 shadow-lg">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Student Card QR Scanner</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Point your device camera at the QR code on the back of your official student ID card.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={Camera}
                onClick={startCamera}
              >
                Start Live Camera
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSimulateScan}
              >
                Simulate Demo Scan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls & Device Selector */}
      {cameraActive && (
        <div className="flex items-center justify-between gap-3 pt-1">
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                stopCamera();
              }}
              className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300"
            >
              {devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={CameraOff}
            onClick={stopCamera}
            className="ml-auto"
          >
            Stop Camera
          </Button>
        </div>
      )}

      {/* Error Feedback */}
      {cameraError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{cameraError}</p>
        </div>
      )}

      {/* Manual ID Entry Fallback */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
        <form onSubmit={handleManualForm} className="space-y-2">
          <label
            htmlFor="manual-student-id"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Camera not working? Enter Student ID Manually
          </label>
          <div className="flex gap-2">
            <input
              id="manual-student-id"
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="e.g. STU-2024-8842"
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!manualId.trim()}
            >
              Verify ID
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
