// Realistic mock dataset for campus lost & found items

export const MOCK_ITEMS = [
  {
    id: "REP-2026-1042",
    type: "found",
    title: "Space Gray MacBook Air 13\" (M2)",
    category: "Electronics",
    description: "Found on study desk #14 on the 2nd Floor Library quiet reading zone. Has a clear matte protective case and two tech stickers.",
    location: "Library 2nd Floor",
    roomDetails: "Study Cubicle 14, Quiet Wing",
    date: "2026-10-10",
    time: "16:30",
    distinguishingMarks: "GitHub Octocat sticker and Vite logo sticker on top shell. Small scratch near USB-C port.",
    estimatedValue: "$1,100",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
    ],
    status: "potential_match",
    reportedBy: {
      name: "Campus Security Desk",
      department: "Facility Services",
      idBadge: "FAC-SEC-09",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "What is the lock screen profile picture or user name?", hint: "Displayed on the login window" },
      { id: "q2", question: "What two sticker designs are affixed to the top case?", hint: "Developer / tech logos" },
      { id: "q3", question: "What color is the charging cable if left together?", hint: "MagSafe braided color" }
    ],
    potentialMatchId: "REP-2026-1043",
    matchScore: 96,
    matchReason: "Category 'Electronics', matching location 'Library', date proximity within 2 hours, and matching laptop model characteristics."
  },
  {
    id: "REP-2026-1043",
    type: "lost",
    title: "Space Gray MacBook Air M2 with Tech Stickers",
    category: "Electronics",
    description: "Accidentally left my laptop at the second floor library tables while rushing to an afternoon lab lecture.",
    location: "Library 2nd Floor",
    roomDetails: "Tables near east window aisle",
    date: "2026-10-10",
    time: "15:45",
    distinguishingMarks: "Has a GitHub sticker and a purple Vite lightning sticker. Username on login screen is 'aarav'.",
    estimatedValue: "$1,150",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    ],
    status: "potential_match",
    reportedBy: {
      name: "Aarav S.",
      department: "Computer Science & Eng.",
      idBadge: "STU-2024-8842",
      isVerified: true,
      isCurrentUser: true
    },
    potentialMatchId: "REP-2026-1042",
    matchScore: 96,
    matchReason: "Identical device, matched library floor, and description tags match item found at Security Desk."
  },
  {
    id: "REP-2026-1088",
    type: "found",
    title: "Pacific Blue Hydro Flask (32 oz)",
    category: "Accessories",
    description: "Found beside the bleachers at the main indoor basketball court after the evening inter-college tournament.",
    location: "Sports Complex",
    roomDetails: "Bleachers Row 3, Basketball Arena",
    date: "2026-10-09",
    time: "19:15",
    distinguishingMarks: "Dent on the bottom rim, flex straw lid with black boot, decorated with national park vinyl stickers.",
    estimatedValue: "$45",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
    ],
    status: "potential_match",
    reportedBy: {
      name: "Priya M.",
      department: "Physical Education Staff",
      idBadge: "STU-2023-4120",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "Which national park sticker is prominently displayed on the front?", hint: "Park name" },
      { id: "q2", question: "What color is the silicone bumper boot at the base?", hint: "Color" }
    ],
    potentialMatchId: "REP-2026-1089",
    matchScore: 92,
    matchReason: "Direct match on Pacific Blue 32oz bottle and Sports Complex bleachers location."
  },
  {
    id: "REP-2026-1089",
    type: "lost",
    title: "Blue 32oz Hydro Flask with Stickers",
    category: "Accessories",
    description: "Left my blue hydro flask near the sports arena seating area during volleyball practice.",
    location: "Sports Complex",
    roomDetails: "Seating court side",
    date: "2026-10-09",
    time: "18:40",
    distinguishingMarks: "Yosemite national park sticker and a small base dent.",
    estimatedValue: "$45",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
    ],
    status: "potential_match",
    reportedBy: {
      name: "Rohan D.",
      department: "Mechanical Engineering",
      idBadge: "STU-2024-1192",
      isVerified: true
    },
    potentialMatchId: "REP-2026-1088",
    matchScore: 92,
    matchReason: "Matched color, bottle size, and Yosemite sticker clue."
  },
  {
    id: "REP-2026-1055",
    type: "found",
    title: "Casio fx-991CW Scientific Calculator",
    category: "Electronics",
    description: "Found on desk 402 in the Advanced Calculus lecture room. The calculator has a black protective slide case.",
    location: "Science Block Lab 3",
    roomDetails: "Lecture Hall 402, 4th Floor",
    date: "2026-10-11",
    time: "11:20",
    distinguishingMarks: "Has a tiny silver sharpie initial 'N.K' inscribed on the back battery compartment.",
    estimatedValue: "$35",
    images: [
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80"
    ],
    status: "active",
    reportedBy: {
      name: "Dr. Alok Verma",
      department: "Mathematics Faculty",
      idBadge: "FAC-MATH-02",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "What two initials are written in silver marker on the battery hatch?", hint: "Two uppercase letters" }
    ]
  },
  {
    id: "REP-2026-1033",
    type: "found",
    title: "Brown Leather Bi-fold Wallet",
    category: "Accessories",
    description: "Turned into the cafeteria cash counter. Contains student meal card and transit card.",
    location: "Student Center / Cafeteria",
    roomDetails: "Cash counter counter #2",
    date: "2026-10-08",
    time: "13:10",
    distinguishingMarks: "Fossil embossed logo on front right corner, slightly distressed dark brown grain.",
    estimatedValue: "$60",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    status: "claim_pending",
    reportedBy: {
      name: "Cafeteria Manager",
      department: "Campus Dining",
      idBadge: "STAFF-DIN-14",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "What student name is printed on the metro pass inside?", hint: "Full name on card" },
      { id: "q2", question: "What brand or logo is embossed on the leather?", hint: "Watch/Leather brand" }
    ]
  },
  {
    id: "REP-2026-1021",
    type: "found",
    title: "Sony WH-1000XM4 Wireless Headphones",
    category: "Electronics",
    description: "Found in audio booth 3 inside the media lab. Black color with original zipper travel case.",
    location: "Auditorium",
    roomDetails: "Media Production Suite, Booth 3",
    date: "2026-10-07",
    time: "17:00",
    distinguishingMarks: "Small scratch on the left pivot hinge, contains a custom braided 3.5mm audio cable inside case.",
    estimatedValue: "$280",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    status: "active",
    reportedBy: {
      name: "Media Lab Assistant",
      department: "Journalism & Media",
      idBadge: "FAC-MED-04",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "What is the Bluetooth pairing name displayed on devices?", hint: "Device name" },
      { id: "q2", question: "What color is the auxiliary cable inside the carry case?", hint: "Cable color" }
    ]
  },
  {
    id: "REP-2026-1014",
    type: "found",
    title: "Student Campus RFID Smart Card",
    category: "ID Cards",
    description: "Found near the Central Bus Bay terminal turnstile. Belongs to a 2nd year BioTech student.",
    location: "Bus Bay",
    roomDetails: "Gate 2 Turnstile Scanner",
    date: "2026-10-11",
    time: "08:45",
    distinguishingMarks: "Student Name: Tanya V., Dept: Biotechnology. Lanyard has a purple NASA badge reel.",
    estimatedValue: "$15",
    images: [
      "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=800&q=80"
    ],
    status: "active",
    reportedBy: {
      name: "Transit Officer",
      department: "Campus Transit",
      idBadge: "TRANS-03",
      isVerified: true
    },
    verificationQuestions: [
      { id: "q1", question: "What is the 8-digit roll number on the card?", hint: "Roll / enrollment number" }
    ]
  },
  {
    id: "REP-2026-1002",
    type: "lost",
    title: "Black North Face Borealis Backpack",
    category: "Bags",
    description: "Lost during lunch hour at the Central Lawn benches. Contains spiral notebooks, pencil pouch, and a textbook.",
    location: "Central Lawn",
    roomDetails: "Benches facing the clock tower",
    date: "2026-10-08",
    time: "14:00",
    distinguishingMarks: "Has a small metal carabiner attached to the left shoulder strap and a yellow highlighter stain on front pouch.",
    estimatedValue: "$120",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    status: "active",
    reportedBy: {
      name: "Sneha K.",
      department: "Architecture",
      idBadge: "STU-2024-5519",
      isVerified: true
    }
  },
  {
    id: "REP-2026-0994",
    type: "found",
    title: "Set of 3 Brass Keys on Marvel Keychain",
    category: "Keys & Cards",
    description: "Found hanging on the fence near the North Campus Hostel Block B bicycle stands.",
    location: "Hostel Blocks",
    roomDetails: "Block B, Cycle Stand North",
    date: "2026-10-06",
    time: "18:20",
    distinguishingMarks: "Red & silver Captain America shield metal keychain with one brass Godrej key and two small locker keys.",
    estimatedValue: "$20",
    images: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    status: "resolved",
    reportedBy: {
      name: "Hostel Warden",
      department: "Student Housing",
      idBadge: "HOUS-WD-02",
      isVerified: true
    },
    resolvedDate: "2026-10-07"
  },
  {
    id: "REP-2026-0988",
    type: "lost",
    title: "Apple AirPods Pro (2nd Gen)",
    category: "Electronics",
    description: "Dropped somewhere between the Engineering Quad and the Student Center walkway.",
    location: "Student Center / Cafeteria",
    roomDetails: "Brick walkway outside entrance",
    date: "2026-10-05",
    time: "12:15",
    distinguishingMarks: "Case is in an olive green silicone sleeve with a lanyard loop.",
    estimatedValue: "$249",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    status: "active",
    reportedBy: {
      name: "Devansh P.",
      department: "Electrical Eng.",
      idBadge: "STU-2023-9031",
      isVerified: true
    }
  },
  {
    id: "REP-2026-0975",
    type: "found",
    title: "Olive Green Puffer Jacket (Size M)",
    category: "Clothing",
    description: "Left hanging on the chair in Auditorium Hall A after the orientation seminar.",
    location: "Auditorium",
    roomDetails: "Hall A, Row M, Seat 12",
    date: "2026-10-04",
    time: "16:00",
    distinguishingMarks: "Uniqlo Ultra Light Down, black zipper pulls, metro card left in left inner pocket.",
    estimatedValue: "$80",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    status: "resolved",
    reportedBy: {
      name: "Auditorium Caretaker",
      department: "Facility Services",
      idBadge: "FAC-AUD-01",
      isVerified: true
    },
    resolvedDate: "2026-10-06"
  }
];

export const CAMPUS_LOCATIONS = [
  "All Locations",
  "Library 2nd Floor",
  "Student Center / Cafeteria",
  "Science Block Lab 3",
  "Sports Complex",
  "Auditorium",
  "Central Lawn",
  "Bus Bay",
  "Hostel Blocks"
];

export const ITEM_CATEGORIES = [
  "All Items",
  "Electronics",
  "Accessories",
  "Books",
  "ID Cards",
  "Bags",
  "Clothing",
  "Keys & Cards",
  "Other"
];
