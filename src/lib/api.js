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
  const prompt = (rawPrompt || '').toLowerCase();

  // 1. 12th & HSC Education
  if (prompt.includes('12th') || prompt.includes('hsc') || prompt.includes('12 th') || prompt.includes('twelfth') || prompt.includes('balmohan')) {
    return "Bhavesh completed his **12th HSC** in the **PCMB stream** scoring **76.33%** from **Balmohan Jr. College, Chopda**.";
  }

  // 2. 10th & CBSE Schooling
  if (prompt.includes('10th') || prompt.includes('cbse') || prompt.includes('10 th') || prompt.includes('tenth') || prompt.includes('oxford')) {
    return "Bhavesh completed his **10th CBSE** schooling from **Oxford English Medium School, Chopda**.";
  }

  // 3. College / University / Degree
  if (prompt.includes('college') || prompt.includes('degree') || prompt.includes('bca') || prompt.includes('university') || prompt.includes('mit') || prompt.includes('education') || prompt.includes('study') || prompt.includes('studying')) {
    return "Bhavesh is currently in his **1st Year** pursuing a **Bachelor of Computer Applications (Honours)** at **MIT-WPU (World Peace University), Pune**.";
  }

  // 4. Projects (Sparse, MailFlow, FacultyOne, etc.)
  if (prompt.includes('sparse')) {
    return "**Sparse** is Bhavesh's flagship project: a minimal, distraction-free social media platform featuring real-time chat, AI integration, post/stories feeds, and a Firebase + Supabase hybrid backend.";
  }

  if (prompt.includes('mailflow') || prompt.includes('mail flow') || prompt.includes('email automation')) {
    return "**MailFlow** is a full-stack email campaign automation platform built with React, Node.js, Express, MongoDB, and Nodemailer for managing contacts and scheduling campaigns.";
  }

  if (prompt.includes('facultyone') || prompt.includes('faculty')) {
    return "**FacultyOne** is a secure cloud workspace built for educators to manage and access teaching resources across classrooms using one-time session tokens.";
  }

  if (prompt.includes('project') || prompt.includes('work') || prompt.includes('portfolio') || prompt.includes('built') || prompt.includes('app')) {
    return "Bhavesh's top builds include **Sparse** (minimal real-time social platform), **MailFlow** (email automation system), **FacultyOne** (educator cloud workspace), and **LocateAID-v3** (emergency blood assistance network). Explore them on the [Projects Page](/projects)!";
  }

  // 5. Skills & Tech Stack
  if (prompt.includes('skill') || prompt.includes('tech') || prompt.includes('stack') || prompt.includes('language') || prompt.includes('react') || prompt.includes('node') || prompt.includes('frontend') || prompt.includes('backend')) {
    return "Bhavesh specializes in Full-Stack Web Development: **React.js, Node.js, Express, Tailwind CSS, GSAP Motion, Firebase Firestore/Auth, MongoDB, Supabase, and Passkey Authentication**.";
  }

  // 6. Contact & Hiring
  if (prompt.includes('contact') || prompt.includes('reach') || prompt.includes('hire') || prompt.includes('freelance') || prompt.includes('job') || prompt.includes('internship') || prompt.includes('email') || prompt.includes('mail')) {
    return "You can reach Bhavesh directly via email at **bhaveshpatil4251@gmail.com**, connect through the [Contact Page](/contact), or send a message via [Live DM Chat](/chat). He is open to freelance projects and software engineering internships!";
  }

  // 7. Coffee & Support
  if (prompt.includes('coffee') || prompt.includes('support') || prompt.includes('donate') || prompt.includes('tip') || prompt.includes('upi')) {
    return "You can support Bhavesh's open-source builds on the [Buy Me a Coffee Page](/buy-me-a-coffee) with UPI QR code (`bhaveshpatil4251@okaxis`) and get featured on the Live Leaderboard!";
  }

  // 8. Who is Bhavesh / Intro
  if (prompt.includes('who is') || prompt.includes('who are you') || prompt.includes('about bhavesh') || prompt.includes('intro') || prompt.includes('tell me about')) {
    return "Bhavesh Patil is a Full-Stack Developer and 1st-year BCA student at MIT-WPU Pune, building scalable, high-performance web applications with clean modern architectures.";
  }

  // 9. Location
  if (prompt.includes('where') || prompt.includes('location') || prompt.includes('city') || prompt.includes('pune') || prompt.includes('chopda')) {
    return "Bhavesh is originally from Chopda, Maharashtra, and is currently based in **Pune, Maharashtra** studying at MIT-WPU.";
  }

  return "Hi! I am Bhavesh's AI Assistant. Feel free to ask me anything about Bhavesh's education (10th/12th/BCA), projects (like Sparse & MailFlow), tech stack, or how to contact him!";
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
    const res = await fetch(`${API_BASE_URL}/tickets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
