import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import QrScanner from '../components/auth/QrScanner';
import OtpInput from '../components/auth/OtpInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Lock,
  ArrowLeft,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  // Authentication step (1: Scan QR, 2: Review ID, 3: Request OTP, 4: Enter OTP, 5: Success)
  const [step, setStep] = useState(1);
  const [extractedStudent, setExtractedStudent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle successful QR scan
  const handleScanSuccess = async (qrPayload) => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      let parsed = null;
      try {
        parsed = JSON.parse(qrPayload);
      } catch {
        parsed = { studentId: qrPayload, name: 'Aarav Sharma' };
      }

      // Call auth service
      const res = await authService.scanQr(parsed);
      if (res && res.student) {
        setExtractedStudent(res.student);
        setStep(2);
        toast.info('Credential Extracted', 'Student ID scanned. Verify credentials to request one-time passcode.');
      } else {
        throw new Error('Unable to extract student record from this code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'QR parsing error');
      toast.error('Scan Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (studentId) => {
    handleScanSuccess(JSON.stringify({ studentId, name: 'Aarav Sharma' }));
  };

  // Step 2 -> 3: Request OTP
  const handleRequestOtp = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await authService.sendOtp(
        extractedStudent.studentId,
        extractedStudent.email
      );
      setOtpInfo(res);
      setStep(4);
      toast.success('Passcode Sent', 'Demo verification OTP dispatched (Code: 482910)');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP');
      toast.error('Dispatch Failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Verify OTP
  const handleVerifyOtp = async (otpCode) => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await authService.verifyOtp(
        extractedStudent.studentId,
        otpCode
      );
      if (res.success && res.user) {
        login(res.user);
        setStep(5);
        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
        toast.success('Identity Verified', 'Welcome back to campus FindIt network.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid OTP code');
      toast.error('Verification Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* LEFT PANEL: Branding & Campus Visual Showcase */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white overflow-hidden border-r border-indigo-900/30">
        {/* Glow ambient circles */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <Logo size="lg" to="/" />
        </div>

        {/* Middle Visual Section */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Student Access Verification</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Your campus community,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
              connected & protected.
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            FindIt replaces disorganized chat groups with a cryptographic, verified lost & found ecosystem. Every report and claim is tied to verified institutional identity.
          </p>

          {/* Floating preview badge card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Smart Match Engine
              </span>
              <span className="text-slate-400">Campus Central Desk</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              "Items reported with high similarity index are matched automatically, notifying owners before classes end."
            </p>
          </div>
        </div>

        {/* Bottom Security Pledge */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-400 pt-6 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Zero Public PII Exposure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Security Integrated</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Step-Based Authentication Card */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo size="md" to="/" />
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors ml-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Center Auth Workflow Container */}
        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Step {step} of 5</span>
              <span>
                {step === 1 && 'Scan ID QR'}
                {step === 2 && 'Review Profile'}
                {step === 3 && 'OTP Request'}
                {step === 4 && 'Enter Passcode'}
                {step === 5 && 'Verified'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Scan QR Code */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Scan Your Student Card
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authenticate your university membership using the QR code on your student ID.
                </p>
              </div>

              <QrScanner
                onScanSuccess={handleScanSuccess}
                onManualSubmit={handleManualSubmit}
              />
            </div>
          )}

          {/* STEP 2: Review Extracted Identity */}
          {step === 2 && extractedStudent && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Student Record Extracted
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Please review your campus credentials before requesting a verification passcode.
                </p>
              </div>

              {/* Student ID Card Visual */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-900 to-slate-900 text-white shadow-xl space-y-4 border border-indigo-800/60 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                      Campus Student Card
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold">{extractedStudent.name}</div>
                  <div className="text-xs font-mono text-indigo-300">{extractedStudent.studentId}</div>
                  <div className="text-xs text-slate-300">{extractedStudent.department}</div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  <span>Registered: {extractedStudent.email}</span>
                  <span>Sem: {extractedStudent.semester}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => setStep(1)} className="flex-1">
                  Scan Again
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRequestOtp}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  Confirm & Request OTP
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Enter 6-digit OTP */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Enter Security Passcode
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We sent a 6-digit one-time code to <strong>{extractedStudent?.email}</strong>.
                </p>
              </div>

              <OtpInput
                onComplete={handleVerifyOtp}
                onResend={handleRequestOtp}
                isLoading={isProcessing}
                demoCode="482910"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Change Student ID
              </Button>
            </div>
          )}

          {/* STEP 5: Success & Transition */}
          {step === 5 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Identity Verified!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Welcome, <strong>{extractedStudent?.name}</strong>. Your session is signed with verified campus authorization.
                </p>
              </div>

              <Button
                variant="gradient"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Enter Student Dashboard
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Demo Credentials Fast Track */}
        <div className="max-w-md w-full mx-auto p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div>
            <strong className="font-semibold text-slate-900 dark:text-white block">
              Direct Demo Bypass
            </strong>
            <span className="text-[11px]">Instant test login as Aarav Sharma</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              login();
              toast.success('Demo Login', 'Signed in as student Aarav Sharma');
              navigate('/dashboard');
            }}
          >
            Quick Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
