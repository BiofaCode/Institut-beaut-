import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation({
  to,
  clientName,
  serviceName,
  date,
  time,
  staffName,
  price,
  bookingId,
}: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  staffName?: string;
  price: string;
  bookingId: string;
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Confirmation de votre réservation — ${serviceName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FEFCF9;">
        <h1 style="color: #8B7355; font-size: 28px; margin-bottom: 8px;">Votre réservation est confirmée</h1>
        <p style="color: #2C2C2C; font-size: 16px;">Bonjour ${clientName},</p>
        <p style="color: #2C2C2C;">Nous avons bien reçu votre réservation. Voici le récapitulatif :</p>

        <div style="background: #F5F0EB; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8B7355; font-weight: bold;">Service</td><td style="padding: 8px 0; color: #2C2C2C;">${serviceName}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B7355; font-weight: bold;">Date</td><td style="padding: 8px 0; color: #2C2C2C;">${date}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B7355; font-weight: bold;">Heure</td><td style="padding: 8px 0; color: #2C2C2C;">${time}</td></tr>
            ${staffName ? `<tr><td style="padding: 8px 0; color: #8B7355; font-weight: bold;">Praticienne</td><td style="padding: 8px 0; color: #2C2C2C;">${staffName}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #8B7355; font-weight: bold;">Prix total</td><td style="padding: 8px 0; color: #2C2C2C; font-weight: bold;">${price}</td></tr>
          </table>
        </div>

        <p style="color: #6B6B6B; font-size: 14px;">
          Pour annuler ou modifier votre rendez-vous, veuillez nous contacter au moins 24 heures à l'avance.
        </p>

        <p style="color: #2C2C2C; margin-top: 32px;">À très bientôt,<br><strong style="color: #8B7355;">L'équipe de l'Institut de Beauté</strong></p>
      </div>
    `,
  });
}

export async function sendBookingReminder({
  to,
  clientName,
  serviceName,
  date,
  time,
  address,
}: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  address?: string;
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Rappel — Votre rendez-vous demain : ${serviceName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FEFCF9;">
        <h1 style="color: #8B7355; font-size: 28px;">Rappel de votre rendez-vous</h1>
        <p style="color: #2C2C2C;">Bonjour ${clientName},</p>
        <p style="color: #2C2C2C;">Nous vous rappelons votre rendez-vous de demain :</p>
        <div style="background: #F5F0EB; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p><strong>${serviceName}</strong></p>
          <p>📅 ${date} à ${time}</p>
          ${address ? `<p>📍 ${address}</p>` : ""}
        </div>
        <p style="color: #6B6B6B; font-size: 14px;">Paiement accepté sur place : TWINT, espèces, carte bancaire.</p>
        <p style="color: #2C2C2C;">À demain !<br><strong style="color: #8B7355;">L'équipe de l'Institut de Beauté</strong></p>
      </div>
    `,
  });
}

export async function sendCancellationEmail({
  to,
  clientName,
  serviceName,
  date,
  time,
}: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Annulation de votre réservation — ${serviceName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FEFCF9;">
        <h1 style="color: #8B7355; font-size: 28px;">Réservation annulée</h1>
        <p style="color: #2C2C2C;">Bonjour ${clientName},</p>
        <p style="color: #2C2C2C;">Votre réservation a été annulée :</p>
        <div style="background: #F5F0EB; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p><strong>${serviceName}</strong> — ${date} à ${time}</p>
        </div>
        <p>N'hésitez pas à prendre un nouveau rendez-vous en ligne.</p>
        <p style="color: #2C2C2C;"><strong style="color: #8B7355;">L'équipe de l'Institut de Beauté</strong></p>
      </div>
    `,
  });
}
