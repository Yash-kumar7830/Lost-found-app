import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  HelpCircle,
  PackagePlus,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  X,
  Lock,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/mockItems';

export default function ReportItemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useData();
  const { user } = useAuth();
  const toast = useToast();

  // Determine initial type from URL route /report/lost or /report/found
  const initialType = location.pathname.includes('found') ? 'found' : 'lost';

  // Form State across steps
  const [step, setStep] = useState(1);
  const [itemType, setItemType] = useState(initialType);
  const [formData, setFormData] = useState(() => ({
    title: '',
    category: 'Electronics',
    description: '',
    location: 'Library 2nd Floor',
    roomDetails: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    distinguishingMarks: '',
    estimatedValue: '',
  }));

  // Photo uploads
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Found item secret verification questions (only for Found items)
  const [verificationQuestions, setVerificationQuestions] = useState([
    { id: 'q1', question: '', hint: '' },
    { id: 'q2', question: '', hint: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [errors, setErrors] = useState({});

  // Step 2 validation
  const validateStep2 = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Item title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.location) errs.location = 'Campus location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 2 && !validateStep2()) {
      toast.error('Missing Fields', 'Please complete the required item details.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Image upload simulator
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File Too Large', 'Maximum file size is 5MB.');
        return;
      }

      setUploadProgress(20);
      setTimeout(() => setUploadProgress(65), 300);
      setTimeout(() => {
        setUploadProgress(100);
        // Use reader or mock URL
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [event.target.result, ...prev]);
          setUploadProgress(0);
          toast.success('Photo Uploaded', 'Item photograph preview added.');
        };
        reader.readAsDataURL(file);
      }, 700);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setVerificationQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddQuestion = () => {
    if (verificationQuestions.length < 3) {
      setVerificationQuestions((prev) => [
        ...prev,
        { id: `q${prev.length + 1}`, question: '', hint: '' },
      ]);
    }
  };

  // Final Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const payload = {
        type: itemType,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: formData.location,
        roomDetails: formData.roomDetails.trim(),
        date: formData.date,
        time: formData.time,
        distinguishingMarks: formData.distinguishingMarks.trim(),
        estimatedValue: formData.estimatedValue.trim(),
        images,
        verificationQuestions:
          itemType === 'found'
            ? verificationQuestions.filter((q) => q.question.trim())
            : undefined,
        reportedBy: {
          name: user?.name || 'Aarav Sharma',
          department: user?.department || 'Student Body',
          idBadge: user?.studentId || 'STU-2024-8842',
          isCurrentUser: true,
          isVerified: true,
        },
      };

      const created = addItem(payload);
      setIsSubmitting(false);
      setSubmittedReport(created);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success(
        'Report Registered',
        `Successfully logged ${itemType.toUpperCase()} item #${created.id}`
      );
    }, 1000);
  };

  // Total steps: 5 (Type -> Details -> Photos -> Questions (found only) -> Review)
  const maxSteps = itemType === 'found' ? 5 : 4;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {itemType === 'lost' ? 'Report a Lost Item' : 'Turn in a Found Item'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide detailed clues to assist the campus matching engine and security desk.
        </p>
      </div>

      {submittedReport ? (
        /* SUCCESS SCREEN */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Registration Successful
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Report ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{submittedReport.id}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Your {submittedReport.type} report has been added to the campus directory. Matching algorithms will continuously compare this report against new turn-ins.
            </p>
          </div>

          {/* Quick Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Item Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedReport.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category / Location:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {submittedReport.category} • {submittedReport.location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <Badge type={submittedReport.status} size="sm" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/items/${submittedReport.id}`)}
              className="w-full sm:w-auto"
            >
              View in Marketplace
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        /* MULTI-STEP REPORTING FORM */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          {/* Progress Bar & Step Numbers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Step {step} of {maxSteps}:{' '}
                {step === 1 && 'Report Type'}
                {step === 2 && 'Item Details'}
                {step === 3 && 'Photos & Media'}
                {step === 4 && (itemType === 'found' ? 'Ownership Verification' : 'Review & Submit')}
                {step === 5 && 'Review & Submit'}
              </span>
              <span>{Math.round((step / maxSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300"
                style={{ width: `${(step / maxSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Select Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  What kind of report are you filing?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose whether you are reporting a missing personal item or submitting an item found on campus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setItemType('lost')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-4 ${
                    itemType === 'lost'
                      ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      I Lost Something
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Broadcast a missing item notice so the campus community and security desks can alert you.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setItemType('found')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-4 ${
                    itemType === 'found'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <PackagePlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      I Found Something
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Turn in or record an item found on campus and configure secure ownership questions.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Item Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enter Item Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Accurate details increase matching accuracy with campus security records.
                </p>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Item Name / Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Space Gray MacBook Air 13''"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                  {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  >
                    {ITEM_CATEGORIES.filter((c) => c !== 'All Items').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe color, size, brand, case, scratches or distinctive appearance..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-500">{errors.description}</p>
                )}
              </div>

              {/* Location & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Campus Zone / Building <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  >
                    {CAMPUS_LOCATIONS.filter((l) => l !== 'All Locations').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Specific Room / Spot
                  </label>
                  <input
                    type="text"
                    value={formData.roomDetails}
                    onChange={(e) => setFormData({ ...formData, roomDetails: e.target.value })}
                    placeholder="e.g. Study Cubicle 14, Quiet Wing"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Approximate Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Distinguishing Marks & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Distinguishing Marks
                  </label>
                  <input
                    type="text"
                    value={formData.distinguishingMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, distinguishingMarks: e.target.value })
                    }
                    placeholder="e.g. Octocat sticker, crack on upper left corner"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Estimated Value (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    placeholder="e.g. $1,100"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photos & Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upload Item Photos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Clear pictures drastically increase the speed of identification and claim validation.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <label
                htmlFor="photo-upload-input"
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Click to upload or drag & drop files
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supported: JPG, PNG, WEBP (Max 5MB each)
                </span>
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Upload Progress Bar */}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Uploading photo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Previews Grid */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Selected Images ({images.length})
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-xs"
                      >
                        <img
                          src={img}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Private Verification Setup (FOUND ITEMS ONLY) */}
          {step === 4 && itemType === 'found' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ownership Verification Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Define 2 to 3 secret verification questions. Only the rightful owner will know the answers.
                </p>
              </div>

              {/* Security Advisory */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Private Evaluation Signal:</strong> Questions are presented to claimants without revealing the expected answers. Correct answers remain strictly confidential to prevent false claims.
                </p>
              </div>

              {/* Questions Inputs */}
              <div className="space-y-4">
                {verificationQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>Verification Question {idx + 1}</span>
                      {idx >= 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setVerificationQuestions((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                      placeholder="e.g. What specific sticker or photo is inside the case?"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                    />

                    <input
                      type="text"
                      value={q.hint}
                      onChange={(e) => handleQuestionChange(idx, 'hint', e.target.value)}
                      placeholder="Helpful clue hint for claimant (optional, e.g. 'Sticker theme')"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                ))}

                {verificationQuestions.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestion}
                  >
                    + Add Question Clue
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 or 5: Review & Submit */}
          {((step === 4 && itemType === 'lost') || (step === 5 && itemType === 'found')) && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Review & Confirm Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Verify the information below before registering your report with campus dispatch.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Report Type:</span>
                  <Badge type={itemType} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-500 block">Item Name</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {formData.title}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Category</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {formData.category}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 block">Description</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {formData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-500 block">Location</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formData.location} {formData.roomDetails ? `(${formData.roomDetails})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Date & Time</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formData.date} {formData.time}
                    </span>
                  </div>
                </div>

                {formData.distinguishingMarks && (
                  <div>
                    <span className="font-bold text-slate-500 block">Unique Marks</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formData.distinguishingMarks}
                    </span>
                  </div>
                )}

                <div>
                  <span className="font-bold text-slate-500 block mb-1">Attached Images</span>
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                icon={ArrowLeft}
                onClick={handlePrevStep}
                disabled={isSubmitting}
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < maxSteps ? (
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleNextStep}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="md"
                icon={CheckCircle2}
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Submit Report to Campus Desk
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
