// API Configuration for Frontend <-> Backend
const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080';
  }
  return 'https://bhaveshpatil-backend-production.up.railway.app';
};

export const API_BASE_URL = getBackendUrl().replace(/\/+$/, '');

/**
 * Intelligent local fallback QA engine with full portfolio knowledge
 */
export function getLocalAIReply(rawPrompt) {
  const prompt = (rawPrompt || '').toLowerCase().trim();

  // Normalize typos
  const clean = prompt
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');

  // 1. Greetings & Introductory queries
  if (
    clean === 'hi' || clean === 'hello' || clean === 'hey' || clean === 'yo' ||
    clean === 'hii' || clean === 'hiii' || clean === 'hola' || clean === 'namaste' ||
    clean.startsWith('hi ') || clean.startsWith('hello ') || clean.startsWith('hey ')
  ) {
    return "Hello! 👋 I am **Bhavesh's Portfolio AI Assistant**.\n\nI can help you explore:\n• 🚀 **Top Projects** (*Sparse, RivoCode-Cli, MailFlow, FacultyOne*)\n• 🛠️ **Tech Stack & Skills** (*React, Node.js, GSAP, Firebase, Supabase*)\n• 🎓 **Education Milestones** (*MIT-WPU BCA, Balmohan HSC 76.33%*)\n• 📬 **Direct Contact & Freelance Inquiries**\n\nWhat would you like to know about Bhavesh?";
  }

  // 2. Vague / Short / "What / Who / Help" queries (e.g. "what", "wwhat", "who", "help")
  if (
    clean === 'what' || clean === 'wwhat' || clean === 'who' || clean === 'help' ||
    clean === 'info' || clean === 'details' || clean === 'about' || clean === 'overview' ||
    clean.includes('who is') || clean.includes('who are you') || clean.includes('tell me about') ||
    clean.includes('what do you do') || clean.includes('about bhavesh') || clean.includes('introduction')
  ) {
    return "👤 **Bhavesh Patil** is a **Full-Stack Developer & Creative Engineer** from Maharashtra, currently pursuing his **BCA (Honours)** at **MIT-WPU, Pune**.\n\nHe specializes in building scalable web architectures, real-time social applications (*Sparse*), developer CLI tools (*RivoCode-Cli*), and smooth animated digital experiences.\n\n**Quick Links:**\n• Explore [Projects Showcase](/projects)\n• Review [Skills & Architecture](/tech-stack)\n• View [Education Timeline](/education)\n• Get in touch via [Contact Page](/contact)";
  }

  // 3. Resume / CV
  if (clean.includes('resume') || clean.includes('cv') || clean.includes('curriculum')) {
    return "📄 You can view and download Bhavesh's verified resume right here: [Download Bhavesh Patil Resume](/assets/bhavesh-patil-resume.png). You can also explore his [Projects Page](/projects) for live code repositories.";
  }

  // 4. 12th & HSC Education
  if (
    clean.includes('12th') || clean.includes('hsc') || clean.includes('12 th') ||
    clean.includes('twelfth') || clean.includes('balmohan') || clean.includes('pcmb') ||
    clean.includes('percentage') || clean.includes('score') || clean.includes('marks')
  ) {
    return "🎓 **12th HSC Education**:\n• **College**: Balmohan Jr. College, Chopda, Maharashtra (2023–2025)\n• **Stream**: PCMB (Physics, Chemistry, Math, Biology)\n• **Score**: **76.33%**\n\nCheck out his complete academic journey on the [Education Page](/education)!";
  }

  // 5. 10th & CBSE Schooling
  if (
    clean.includes('10th') || clean.includes('cbse') || clean.includes('10 th') ||
    clean.includes('tenth') || clean.includes('oxford') || clean.includes('school')
  ) {
    return "🏫 **10th CBSE Schooling**:\n• **School**: Oxford English Medium School, Chopda, Maharashtra\n• **Result**: Graduated with High Distinction (2023).";
  }

  // 6. College / University / BCA Degree
  if (
    clean.includes('college') || clean.includes('degree') || clean.includes('bca') ||
    clean.includes('university') || clean.includes('mit') || clean.includes('wpu') ||
    clean.includes('education') || clean.includes('study') || clean.includes('studying') || clean.includes('bachelor')
  ) {
    return "🏛️ **Undergraduate Studies**:\n• **Degree**: Bachelor of Computer Applications (BCA Honours)\n• **University**: **MIT-WPU (World Peace University), Pune, Maharashtra**\n• **Status**: 1st Year (2025–2026)\n• **Focus**: Data Structures, Web Systems, Cloud Services, and Database Design.";
  }

  // 7. Sparse (Flagship Project)
  if (clean.includes('sparse') || clean.includes('social') || clean.includes('social media')) {
    return "🌟 **Sparse** *(Flagship Social Platform)*:\n• **Concept**: A minimalist, distraction-free social network for mature users with zero addictive algorithms or short-form reels.\n• **Features**: Real-time WebSocket chat, chronological feeds, story sharing, in-chat AI assistance, and role-based permissions.\n• **Tech Stack**: Hybrid Supabase + Firebase Firestore, React, Tailwind CSS, Node.js.\n• **GitHub**: [github.com/bhaveshpatil-ks](https://github.com/bhaveshpatil-ks)";
  }

  // 8. RivoCode-Cli
  if (clean.includes('rivocode') || clean.includes('rivo') || clean.includes('cli') || clean.includes('terminal ai')) {
    return "⚡ **RivoCode-Cli** *(Autonomous Terminal AI Assistant)*:\n• **What it is**: An autonomous developer CLI tool that writes code, edits files, executes terminal commands, and searches web documentation straight from the terminal.\n• **Tech Stack**: TypeScript, Bun, Monorepo toolchain.\n• **GitHub**: [github.com/sanketpadhyal/RivoCode-Cli](https://github.com/sanketpadhyal/RivoCode-Cli)";
  }

  // 9. MailFlow
  if (clean.includes('mailflow') || clean.includes('mail flow') || clean.includes('email automation') || clean.includes('campaign')) {
    return "📧 **MailFlow** *(Email Automation & Campaign Engine)*:\n• **What it is**: Full-stack email marketing and deliverability platform for creating campaigns and managing subscriber lists.\n• **Tech Stack**: React, Node.js, Express, MongoDB, Nodemailer.\n• **GitHub**: [github.com/bhaveshpatil-ks/Mail-flow-](https://github.com/bhaveshpatil-ks/Mail-flow-)";
  }

  // 10. FacultyOne
  if (clean.includes('facultyone') || clean.includes('faculty') || clean.includes('educator')) {
    return "🏫 **FacultyOne** *(Educator Cloud Workspace)*:\n• **What it is**: Secure cloud platform allowing teachers to seamlessly manage and access teaching resources across classrooms using one-time session tokens.\n• **Tech Stack**: React, Node.js, Express, Firebase.\n• **GitHub**: [github.com/sanketpadhyal/FacultyOne](https://github.com/sanketpadhyal/FacultyOne)";
  }

  // 11. SweFace, Repart, Odoy, LocateAID
  if (clean.includes('sweface') || clean.includes('face') || clean.includes('recognition')) {
    return "👁️ **SweFace**: AI face recognition and computer vision pipeline for automated identity verification and access security.";
  }
  if (clean.includes('repart') || clean.includes('inventory') || clean.includes('hardware')) {
    return "📦 **Repart**: Smart hardware inventory and replacement tracking dashboard.";
  }
  if (clean.includes('odoy')) {
    return "💬 **Odoy**: Modern real-time social platform with chat, friend system, and AI features.";
  }
  if (clean.includes('locateaid') || clean.includes('blood') || clean.includes('emergency')) {
    return "🩸 **LocateAID-v3**: Emergency medical platform with AI assistance and real-time blood requests.";
  }

  // 12. General Projects query
  if (clean.includes('project') || clean.includes('work') || clean.includes('portfolio') || clean.includes('built') || clean.includes('app')) {
    return "🚀 **Bhavesh's Top Projects**:\n1. **Sparse** — Minimalist real-time social platform (*Flagship*)\n2. **RivoCode-Cli** — Autonomous developer terminal AI assistant\n3. **MailFlow** — Full-stack email campaign & automation system\n4. **FacultyOne** — Educator cloud workspace with token auth\n5. **SweFace** — AI facial recognition pipeline\n6. **Repart** — Hardware inventory tracking\n\nExplore them all in detail on the [Projects Page](/projects)!";
  }

  // 13. Tech Stack & Skills
  if (
    clean.includes('skill') || clean.includes('tech') || clean.includes('stack') ||
    clean.includes('language') || clean.includes('react') || clean.includes('node') ||
    clean.includes('frontend') || clean.includes('backend') || clean.includes('database') ||
    clean.includes('gsap') || clean.includes('tools') || clean.includes('framework')
  ) {
    return "🛠️ **Bhavesh's Technical Stack**:\n• **Frontend**: React 18, Vite 5, JavaScript (ESNext), TypeScript, GSAP Motion, Lenis Smooth Scroll, Tailwind CSS\n• **Backend & APIs**: Node.js, Express.js, RESTful APIs, WebSockets, JWT Authentication, WebAuthn Passkeys\n• **Databases & Cloud**: Firebase (Firestore, Auth, Functions), Supabase, MongoDB, Cloudinary CDN, Netlify, Render\n• **Tools**: Git/GitHub, VS Code, Bun, Postman, Linux Terminal\n\nCheck out his live interactive stack on the [Tech Stack Page](/tech-stack)!";
  }

  // 14. Contact & Hiring & Freelance
  if (
    clean.includes('contact') || clean.includes('reach') || clean.includes('hire') ||
    clean.includes('freelance') || clean.includes('job') || clean.includes('internship') ||
    clean.includes('email') || clean.includes('mail') || clean.includes('message') || clean.includes('phone')
  ) {
    return "📬 **Get in Touch with Bhavesh**:\n• **Email**: [bhaveshpatil4251@gmail.com](mailto:bhaveshpatil4251@gmail.com)\n• **Contact Form**: Submit a ticket on the [Contact Page](/contact)\n• **Live DM**: Chat in real time via the [Chat Page](/chat)\n• **GitHub**: [github.com/bhaveshpatil-ks](https://github.com/bhaveshpatil-ks)\n\nHe is currently **Available for Work** (Freelance projects & Software Engineering internships)!";
  }

  // 15. Buy Me a Coffee & Support
  if (clean.includes('coffee') || clean.includes('support') || clean.includes('donate') || clean.includes('tip') || clean.includes('upi') || clean.includes('leaderboard')) {
    return "☕ **Support Bhavesh's Work**:\nYou can buy him a coffee via UPI (`bhaveshpatil4251@okaxis`) on the [Buy Me a Coffee Page](/buy-me-a-coffee) and get featured on the Live Supporter Leaderboard!";
  }

  // 16. Privacy, Cookies & Security
  if (
    clean.includes('privacy') || clean.includes('cookie') || clean.includes('data') ||
    clean.includes('security') || clean.includes('terms') || clean.includes('safe') || clean.includes('sell')
  ) {
    return "🛡️ **Security & Privacy Commitment**:\n• **Zero Data Selling**: We never sell, lease, or monetize visitor data.\n• **JWT Security**: Authenticated features are protected by cryptographically signed tokens.\n• **Essential Cookies Only**: Local storage is used strictly for UI themes and consent.\n\nRead our [Privacy Policy](/privacy) and [Terms of Service](/terms).";
  }

  // 17. Location
  if (clean.includes('where') || clean.includes('location') || clean.includes('city') || clean.includes('pune') || clean.includes('chopda') || clean.includes('live')) {
    return "📍 Bhavesh is originally from **Chopda, Maharashtra**, and is currently based in **Pune, Maharashtra** studying at MIT-WPU.";
  }

  // 18. GitHub
  if (clean.includes('github') || clean.includes('repo') || clean.includes('code') || clean.includes('commit')) {
    return "🐙 You can view Bhavesh's open-source repositories and 200+ commits on GitHub: [github.com/bhaveshpatil-ks](https://github.com/bhaveshpatil-ks).";
  }

  return "Hi! I am Bhavesh's Portfolio Assistant.\n\nI can answer anything about:\n1. 🚀 **Top Projects** (*Sparse, RivoCode-Cli, MailFlow, FacultyOne*)\n2. 🛠️ **Tech Stack** (*React, Node.js, GSAP, Firebase, Supabase*)\n3. 🎓 **Education** (*MIT-WPU BCA, Balmohan HSC 76.33%*)\n4. 📬 **Contact & Freelance Opportunities**\n\nWhat would you like to explore?";
}

/**
 * Send a chat prompt to the AI assistant endpoint (/ai)
 * @param {string} message 
 * @returns {Promise<{ reply: string }>}
 */
export async function sendChatMessage(message) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return { reply: data.reply || getLocalAIReply(message) };
  } catch (err) {
    console.warn('Backend AI fetch failed, using smart local QA engine:', err);
    return {
      reply: getLocalAIReply(message)
    };
  }
}

/**
 * Send a contact ticket/inquiry to the backend
 * @param {{ name: string, email: string, message: string }} formData
 */
export async function sendContactInquiry(formData) {
  try {
    const token = localStorage.getItem('bhavesh_user_jwt');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/tickets/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: `Inquiry from ${formData.name}`,
        details: formData.message,
        email: formData.email,
        name: formData.name,
      }),
    });

    const data = await res.json().catch(() => ({}));
    return { success: res.ok, data };
  } catch (err) {
    console.warn('Backend ticket creation failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submit Coffee Support payment entry with proof screenshots
 * @param {FormData} formData
 */
export async function submitCoffeeSupport(formData) {
  const res = await fetch(`${API_BASE_URL}/leaderboard/entry`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to submit support entry');
  return data;
}

/**
 * Fetch verified supporters leaderboard
 */
export async function fetchPublicLeaderboard(limit = 20) {
  try {
    const res = await fetch(`${API_BASE_URL}/leaderboard/success/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit })
    });
    const data = await res.json().catch(() => ({}));
    return data.leaderboard || [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// User / Firebase Auth Methods
// ----------------------------------------------------

/**
 * Exchange Firebase ID token for Backend session JWT token and user profile
 */
export async function syncFirebaseAuthToken(idToken) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: idToken })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Authentication sync failed');
  return data;
}

/**
 * Fetch all tickets/inquiries for the currently authenticated user
 */
export async function fetchUserTickets(jwtToken) {
  const res = await fetch(`${API_BASE_URL}/tickets/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    },
    body: JSON.stringify({})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load tickets');
  return data.tickets || [];
}

/**
 * Update user profile settings
 */
export async function updateUserProfile(jwtToken, updates) {
  const res = await fetch(`${API_BASE_URL}/auth/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data;
}

/**
 * Fetch current user profile info from backend
 */
export async function fetchUserProfile(jwtToken) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    },
    body: JSON.stringify({})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load user profile');
  return data.user || null;
}

/**
 * Permanently delete user account and clean up data
 */
export async function deleteUserAccount(jwtToken, { reasons, feedback }) {
  const res = await fetch(`${API_BASE_URL}/auth/delete-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ reasons, feedback })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete account');
  return data;
}

// ----------------------------------------------------
// Admin API Methods
// ----------------------------------------------------

/**
 * Standard admin credentials login
 */
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE_URL}/admin/auth-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

/**
 * Fetch passkey auth options for 1-click biometric login
 */
export async function adminPasskeyAuthOptions() {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/auth-options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to get passkey options');
  return data;
}

/**
 * Verify passkey auth response
 */
export async function adminPasskeyAuthVerify(credential, sessionId) {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/auth-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, sessionId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Passkey verification failed');
  return data;
}

/**
 * Get registration options to enroll current device as passkey
 */
export async function adminPasskeyRegisterOptions(token) {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/register-options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to initialize passkey registration');
  return data;
}

/**
 * Verify passkey registration for current device
 */
export async function adminPasskeyRegisterVerify(token, credential, deviceName) {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/register-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ credential, deviceName })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to complete passkey registration');
  return data;
}

/**
 * List registered passkey devices
 */
export async function adminGetPasskeyDevices(token) {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/devices`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch passkey devices');
  return data.devices || [];
}

/**
 * Remove a registered passkey device
 */
export async function adminRemovePasskeyDevice(token, deviceId) {
  const res = await fetch(`${API_BASE_URL}/admin/passkey/remove-device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ deviceId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to remove passkey device');
  return data;
}

/**
 * Fetch tickets/inquiries with filtering and search
 */
export async function adminGetTickets(token, { status = 'all', limit = 120, query = '' } = {}) {
  const res = await fetch(`${API_BASE_URL}/admin/tickets/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, limit, query })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch tickets');
  return data.tickets || [];
}

/**
 * Send admin reply to a ticket
 */
export async function adminReplyTicket(token, ticketId, reply) {
  const res = await fetch(`${API_BASE_URL}/admin/tickets/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ticketId, reply })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to send reply');
  return data;
}

/**
 * Update ticket status or seen state
 */
export async function adminUpdateTicketStatus(token, { ticketId, status, seen = null }) {
  const body = { ticketId, status };
  if (seen !== null) body.seen = seen;
  const res = await fetch(`${API_BASE_URL}/admin/tickets/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update ticket status');
  return data;
}

/**
 * Delete a ticket
 */
export async function adminDeleteTicket(token, ticketId) {
  const res = await fetch(`${API_BASE_URL}/admin/tickets/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ticketId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete ticket');
  return data;
}

/**
 * Fetch payments / leaderboard submissions
 */
export async function adminGetPayments(token, { status = 'all', limit = 200, query = '' } = {}) {
  const res = await fetch(`${API_BASE_URL}/admin/payments/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, limit, query })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch payments');
  return data.payments || [];
}

/**
 * Update payment verification status ('pending' | 'success' | 'failed')
 */
export async function adminUpdatePaymentStatus(token, paymentId, status) {
  const res = await fetch(`${API_BASE_URL}/admin/payments/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ paymentId, status })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update payment status');
  return data;
}

/**
 * Delete a payment record directly
 */
export async function adminDeletePayment(token, paymentId) {
  const res = await fetch(`${API_BASE_URL}/admin/payments/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ paymentId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete payment');
  return data;
}

/**
 * Delete a failed leaderboard payment entry (with Cloudinary cleanup)
 */
export async function adminDeleteLeaderboardEntry(token, entryId) {
  const res = await fetch(`${API_BASE_URL}/leaderboard/entry/${entryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete leaderboard entry');
  return data;
}

/**
 * Fetch the active leaderboard list
 */
export async function adminGetLeaderboard(token, { limit = 100, query = '' } = {}) {
  const res = await fetch(`${API_BASE_URL}/leaderboard/success/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ limit, query })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch leaderboard');
  return data.leaderboard || [];
}

/**
 * Fetch registered users directory and stats
 */
export async function adminGetUsers(token) {
  const res = await fetch(`${API_BASE_URL}/admin/users/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
  return data;
}
