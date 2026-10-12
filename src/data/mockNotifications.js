// Sample notifications for student dashboard and alerts center

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "High Confidence Item Match Found!",
    message: "A Space Gray MacBook Air 13\" (M2) reported found at 'Library 2nd Floor' matches your lost report #REP-2026-1043 with a 96% confidence score.",
    type: "match",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    read: false,
    link: "/matches",
    itemId: "REP-2026-1042",
    actionLabel: "Compare & Claim"
  },
  {
    id: "notif-2",
    title: "Claim Under Admin Review",
    message: "Your ownership verification response for 'Brown Leather Bi-fold Wallet' (#REP-2026-1033) is currently being reviewed by Campus Security.",
    type: "claim",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: false,
    link: "/claims",
    claimId: "CLM-2026-3190",
    actionLabel: "Track Status"
  },
  {
    id: "notif-3",
    title: "Item Report Successfully Published",
    message: "Your lost report for 'Space Gray MacBook Air M2' is verified and broadcasting to all campus security kiosks.",
    type: "report",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    link: "/my-reports",
    itemId: "REP-2026-1043",
    actionLabel: "View Report"
  },
  {
    id: "notif-4",
    title: "Item Successfully Returned 🎉",
    message: "Case resolved: Set of 3 Brass Keys on Marvel Keychain was reunited with student Sneha K. at North Hostel Block.",
    type: "resolved",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    link: "/items/REP-2026-0994",
    itemId: "REP-2026-0994",
    actionLabel: "View Details"
  }
];

export const MOCK_CLAIMS = [
  {
    id: "CLM-2026-3190",
    itemId: "REP-2026-1033",
    itemTitle: "Brown Leather Bi-fold Wallet",
    itemCategory: "Accessories",
    itemLocation: "Student Center / Cafeteria",
    claimant: {
      name: "Aarav Sharma",
      studentId: "STU-2024-8842",
      email: "aarav.s@campus.edu",
      phone: "+91 98765 43842"
    },
    submittedAt: "2026-10-10T14:20:00Z",
    status: "pending", // 'pending' | 'approved' | 'rejected' | 'action_needed'
    identifyingDetails: "The metro pass has my student name 'Aarav Sharma' and valid till 2027. Inside pocket has an emergency ₹500 note tucked behind the card sleeve.",
    answers: [
      { questionId: "q1", question: "What student name is printed on the metro pass inside?", answer: "Aarav Sharma" },
      { questionId: "q2", question: "What brand or logo is embossed on the leather?", answer: "Fossil (bottom right corner)" }
    ],
    timeline: [
      { step: "Claim Submitted", timestamp: "2026-10-10 14:20", done: true },
      { step: "Security Desk Verification", timestamp: "2026-10-10 16:00", current: true },
      { step: "Claimant Identity Check", timestamp: "Pending", done: false },
      { step: "Physical Handover at Admin Desk", timestamp: "Pending", done: false }
    ],
    adminNotes: "Answers match finder notes closely. Student requested to bring student RFID badge to Desk 2."
  },
  {
    id: "CLM-2026-2811",
    itemId: "REP-2026-0994",
    itemTitle: "Set of 3 Brass Keys on Marvel Keychain",
    itemCategory: "Keys & Cards",
    itemLocation: "Hostel Blocks",
    claimant: {
      name: "Sneha Kapoor",
      studentId: "STU-2024-5519",
      email: "sneha.k@campus.edu",
      phone: "+91 98765 12519"
    },
    submittedAt: "2026-10-06T19:30:00Z",
    status: "approved",
    identifyingDetails: "One key is room 204 key, two smaller keys are for the study table drawer and cycle lock.",
    answers: [],
    timeline: [
      { step: "Claim Submitted", timestamp: "2026-10-06 19:30", done: true },
      { step: "Warden Verification", timestamp: "2026-10-07 10:15", done: true },
      { step: "Identity Confirmed", timestamp: "2026-10-07 11:00", done: true },
      { step: "Item Handed Over", timestamp: "2026-10-07 11:15", done: true }
    ],
    adminNotes: "Warden confirmed key matched room 204 cylinder."
  }
];
