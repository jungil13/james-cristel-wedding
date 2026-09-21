/**
 * Wedding RSVP Email Notification Service
 * Sends instant notifications to jamesandcristel@gmail.com whenever a guest submits an RSVP.
 */

const DEFAULT_TARGET_EMAIL = 'jamesandcristel@gmail.com';

/**
 * Send an RSVP email notification.
 * 
 * Strategy:
 * 1. If Web3Forms access key is configured (VITE_WEB3FORMS_ACCESS_KEY), uses Web3Forms.
 * 2. Defaults to FormSubmit AJAX endpoint (zero setup/API keys needed).
 *    Note: The first time a notification is sent to jamesandcristel@gmail.com,
 *    FormSubmit sends an activation link to the inbox. Once clicked, all future
 *    emails deliver seamlessly.
 *
 * @param {Object} rsvp
 * @param {string} rsvp.full_name - Guest full name
 * @param {string} [rsvp.email] - Guest email
 * @param {string} [rsvp.phone] - Guest phone number
 * @param {string} rsvp.attendance - 'accepted' | 'declined'
 * @param {number} [rsvp.guest_count] - Number of guests
 * @param {string} [rsvp.message] - Personal note / wishes
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendRsvpNotification(rsvp) {
  const targetEmail = import.meta.env.VITE_NOTIFICATION_EMAIL || DEFAULT_TARGET_EMAIL;
  const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  
  const isAccepted = rsvp.attendance === 'accepted';
  const attendanceLabel = isAccepted ? 'Accepted with Pleasure (Attending)' : 'Declined with Regret';
  const subject = `💍 New Wedding RSVP: ${rsvp.full_name} - ${isAccepted ? 'Attending' : 'Declined'}`;
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Manila', // Wedding local timezone
  });

  // 1. If Web3Forms key is set, use Web3Forms
  if (web3FormsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: subject,
          from_name: 'James & Cristel Wedding RSVP',
          to_email: targetEmail,
          'Guest Name': rsvp.full_name,
          'Attendance': attendanceLabel,
          'Total Guests': rsvp.guest_count ?? (isAccepted ? 1 : 0),
          'Guest Email': rsvp.email || 'None provided',
          'Guest Phone': rsvp.phone || 'None provided',
          'Message / Wishes': rsvp.message || 'None',
          'Submitted At': timestamp + ' (PHT)',
          replyto: rsvp.email || targetEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return { success: true };
      }
      console.warn('Web3Forms returned unsuccessful response:', data);
    } catch (err) {
      console.warn('Web3Forms dispatch error, falling back to FormSubmit:', err);
    }
  }

  // 2. Default fallback: FormSubmit AJAX endpoint (No API key required)
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: rsvp.email || undefined,
        'Full Name': rsvp.full_name,
        'Attendance': attendanceLabel,
        'Number of Guests': rsvp.guest_count ?? (isAccepted ? 1 : 0),
        'Email Address': rsvp.email || 'None provided',
        'Phone Number': rsvp.phone || 'None provided',
        'Message to Couple': rsvp.message || 'None',
        'Submitted At': timestamp + ' (Philippine Standard Time)',
      }),
    });

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Notification sent successfully',
    };
  } catch (error) {
    console.error('Error sending RSVP notification:', error);
    return {
      success: false,
      message: error.message || 'Failed to dispatch email notification',
    };
  }
}
