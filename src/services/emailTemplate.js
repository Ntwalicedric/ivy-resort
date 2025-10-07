// New minimal, reliable confirmation template (fresh)
export function buildConfirmationEmail(reservation) {
  const amountDisplay = reservation.totalAmountDisplay || (
    reservation.currency === 'RWF'
      ? new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(reservation.totalAmountInCurrency || reservation.totalAmount)
      : new Intl.NumberFormat('en-US', { style: 'currency', currency: reservation.currency || 'USD' }).format(reservation.totalAmountInCurrency || reservation.totalAmount)
  );

  const subject = `Ivy Resort Booking Confirmation • ${reservation.confirmationId}`;

  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Booking Confirmation</title>
  <style>body{margin:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#101828}
  .wrap{max-width:640px;margin:0 auto;padding:24px}
  .card{background:#fff;border:1px solid #e6e7eb;border-radius:16px;box-shadow:0 6px 20px rgba(16,24,40,.06);overflow:hidden}
  .hdr{background:linear-gradient(135deg,#10b981,#0ea5e9);padding:28px 24px;color:#fff;text-align:center}
  .hdr h1{margin:0;font-size:22px;letter-spacing:.3px}
  .hdr p{margin:6px 0 0;font-size:13px;opacity:.95}
  .section{padding:20px 24px}
  .key{display:inline-block;min-width:140px;color:#667085}
  .val{font-weight:600;color:#101828}
  .row{margin:8px 0}
  .badge{display:inline-block;background:#ecfdf3;color:#047857;border:1px solid #bbf7d0;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700;letter-spacing:.3px}
  .muted{color:#667085}
  .footer{padding:16px 24px;border-top:1px solid #eef0f3;background:#fafbff;color:#667085;font-size:12px}
  </style></head><body>
  <div class="wrap">
    <div class="card">
      <div class="hdr">
        <h1>Booking Confirmed</h1>
        <p>Confirmation ID: <strong>${reservation.confirmationId}</strong></p>
      </div>
      <div class="section">
        <div class="row"><span class="key">Guest</span><span class="val">${reservation.guestName}</span></div>
        <div class="row"><span class="key">Room</span><span class="val">${reservation.roomName}</span></div>
        <div class="row"><span class="key">Check‑in</span><span class="val">${new Date(reservation.checkIn).toLocaleDateString()}</span></div>
        <div class="row"><span class="key">Check‑out</span><span class="val">${new Date(reservation.checkOut).toLocaleDateString()}</span></div>
        <div class="row"><span class="key">Amount to be Paid</span><span class="val">${amountDisplay}</span></div>
        ${reservation.specialRequests ? `<div class="row"><span class="key">Requests</span><span class="val">${reservation.specialRequests}</span></div>` : ''}
        <div class="row"><span class="badge">CONFIRMED</span></div>
      </div>
      <div class="section muted">
        <p>• A confirmation email has been sent to <strong>${reservation.email}</strong>. If you don’t see it, check your spam folder.</p>
        <p>• Show this email with your Confirmation ID at check‑in for faster service.</p>
        <p>• Check‑in from 3:00 PM at the resort reception.</p>
      </div>
      <div class="footer">
        Ivy Resort • +250 787 061 278 • ivyresort449@gmail.com • www.ivyresort.com
      </div>
    </div>
  </div>
  </body></html>`;

  const text = `Booking Confirmed\n\nConfirmation ID: ${reservation.confirmationId}\nGuest: ${reservation.guestName}\nRoom: ${reservation.roomName}\nCheck-in: ${new Date(reservation.checkIn).toLocaleDateString()}\nCheck-out: ${new Date(reservation.checkOut).toLocaleDateString()}\nAmount to be Paid: ${amountDisplay}\n${reservation.specialRequests ? `Requests: ${reservation.specialRequests}\n` : ''}\nNext Steps:\n- This email has been sent to ${reservation.email}. If not found, check spam.\n- Show this email with your Confirmation ID at check-in.\n- Check-in from 3:00 PM at the resort reception.\n\nIvy Resort • +250 787 061 278 • ivyresort449@gmail.com • www.ivyresort.com`;

  return { subject, html, text };
}



