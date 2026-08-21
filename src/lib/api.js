// API Configuration for Frontend <-> Railway Backend
const DEFAULT_BACKEND_URL = 'https://bhaveshpatil-backend-production.up.railway.app';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  DEFAULT_BACKEND_URL
).replace(/\/+$/, '');

/**
 * Send a chat prompt to the AI assistant endpoint (/ai)
 * @param {string} message 
 * @returns {Promise<{ reply: string }>}
 */
export async function sendChatMessage(message) {
  if (!API_BASE_URL) {
    return {
      reply: `Hi! Thanks for reaching out. Bhavesh can be reached directly via email at bhaveshpatil4251@gmail.com or WhatsApp at +91 93076 01125.`
    };
  }

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
    return { reply: data.reply || 'No response from assistant.' };
  } catch (err) {
    console.warn('Backend AI fetch failed, using smart local fallback:', err);
    return {
      reply: `I received your message! For direct contact, Bhavesh can be reached at bhaveshpatil4251@gmail.com or WhatsApp +91 93076 01125.`
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
