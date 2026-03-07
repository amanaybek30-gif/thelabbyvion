import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { render as renderSvgToPng } from "https://deno.land/x/resvg_wasm@0.2.0/mod.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CertificateRequest {
  name: string;
  email: string;
  awardTitle?: string;
  teamName?: string;
  eventDate?: string;
  isGroup?: boolean;
  businessName?: string;
  tagline?: string;
}

const generateCertificateSvg = (name: string, label: string, sublabel: string | undefined, eventDate: string) => {
  const escapeSvg = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n = escapeSvg(name);
  const l = escapeSvg(label);
  const sl = sublabel ? escapeSvg(sublabel) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1748" height="1228" viewBox="0 0 1748 1228">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060810"/>
      <stop offset="30%" stop-color="#0d1220"/>
      <stop offset="60%" stop-color="#10162a"/>
      <stop offset="100%" stop-color="#060810"/>
    </linearGradient>
    <radialGradient id="glowCenter" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#d7ab46" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#d7ab46" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowTop" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#f3d88d" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#f3d88d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBottom" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#b9892b" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#b9892b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e6b8"/>
      <stop offset="25%" stop-color="#f3d88d"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="75%" stop-color="#c49b30"/>
      <stop offset="100%" stop-color="#b9892b"/>
    </linearGradient>
    <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fcedc4"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="100%" stop-color="#9a7520"/>
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="30%" stop-color="#d7ab4680"/>
      <stop offset="50%" stop-color="#f3d88d"/>
      <stop offset="70%" stop-color="#d7ab4680"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="lineShort" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#d7ab4660"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="0.8" fill="#d7ab46" opacity="0.12"/>
    </pattern>
    <clipPath id="innerClip">
      <rect x="64" y="64" width="1620" height="1100" rx="16"/>
    </clipPath>
  </defs>

  <!-- Background layers -->
  <rect width="1748" height="1228" fill="url(#bg)"/>
  <rect width="1748" height="1228" fill="url(#glowCenter)"/>
  <rect width="1748" height="1228" fill="url(#glowTop)"/>
  <rect width="1748" height="1228" fill="url(#glowBottom)"/>
  <rect width="1748" height="1228" fill="url(#dots)"/>

  <!-- Outer triple border -->
  <rect x="30" y="30" width="1688" height="1168" rx="20" fill="none" stroke="#8f6a24" stroke-opacity="0.2" stroke-width="1"/>
  <rect x="48" y="48" width="1652" height="1132" rx="18" fill="none" stroke="url(#gold)" stroke-opacity="0.5" stroke-width="2"/>
  <rect x="64" y="64" width="1620" height="1100" rx="16" fill="none" stroke="url(#gold)" stroke-opacity="0.85" stroke-width="3"/>

  <!-- Inner decorative border -->
  <rect x="90" y="90" width="1568" height="1048" rx="12" fill="none" stroke="#d7ab46" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="8,6"/>

  <!-- Corner ornaments - top left -->
  <g opacity="0.6" transform="translate(100,100)">
    <path d="M0 60 L0 0 L60 0" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M10 50 L10 10 L50 10" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="#d7ab46"/>
    <path d="M0 0 Q30 15 60 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
    <path d="M0 0 Q15 30 0 60" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
  </g>
  <!-- Corner ornaments - top right -->
  <g opacity="0.6" transform="translate(1648,100) scale(-1,1)">
    <path d="M0 60 L0 0 L60 0" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M10 50 L10 10 L50 10" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="#d7ab46"/>
    <path d="M0 0 Q30 15 60 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
    <path d="M0 0 Q15 30 0 60" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
  </g>
  <!-- Corner ornaments - bottom left -->
  <g opacity="0.6" transform="translate(100,1128) scale(1,-1)">
    <path d="M0 60 L0 0 L60 0" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M10 50 L10 10 L50 10" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="#d7ab46"/>
    <path d="M0 0 Q30 15 60 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
    <path d="M0 0 Q15 30 0 60" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
  </g>
  <!-- Corner ornaments - bottom right -->
  <g opacity="0.6" transform="translate(1648,1128) scale(-1,-1)">
    <path d="M0 60 L0 0 L60 0" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M10 50 L10 10 L50 10" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="#d7ab46"/>
    <path d="M0 0 Q30 15 60 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
    <path d="M0 0 Q15 30 0 60" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.3"/>
  </g>

  <!-- Top center ornamental flourish -->
  <g opacity="0.5" transform="translate(874,140)">
    <path d="M-120 0 Q-80 -25 -40 0 Q0 25 40 0 Q80 -25 120 0" fill="none" stroke="url(#gold)" stroke-width="1.8"/>
    <path d="M-80 0 Q-40 -15 0 0 Q40 15 80 0" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="3" fill="#f3d88d"/>
    <circle cx="-120" cy="0" r="2" fill="#d7ab46"/>
    <circle cx="120" cy="0" r="2" fill="#d7ab46"/>
  </g>

  <!-- Bottom center ornamental flourish -->
  <g opacity="0.5" transform="translate(874,1088)">
    <path d="M-120 0 Q-80 25 -40 0 Q0 -25 40 0 Q80 25 120 0" fill="none" stroke="url(#gold)" stroke-width="1.8"/>
    <path d="M-80 0 Q-40 15 0 0 Q40 -15 80 0" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="3" fill="#f3d88d"/>
    <circle cx="-120" cy="0" r="2" fill="#d7ab46"/>
    <circle cx="120" cy="0" r="2" fill="#d7ab46"/>
  </g>

  <!-- Side decorative lines -->
  <rect x="120" y="400" width="1.5" height="428" fill="url(#lineShort)" opacity="0.4" transform="rotate(0)"/>
  <rect x="1626" y="400" width="1.5" height="428" fill="url(#lineShort)" opacity="0.4"/>

  <!-- Star/diamond accent top -->
  <g opacity="0.35" transform="translate(874, 195)">
    <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#f3d88d"/>
  </g>

  <!-- Certificate of Membership heading -->
  <text x="874" y="260" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#c8cfe0" letter-spacing="10" text-decoration="none">CERTIFICATE OF MEMBERSHIP</text>

  <!-- Decorative line under heading -->
  <rect x="574" y="282" width="600" height="1.5" fill="url(#line)"/>

  <!-- Presented to -->
  <text x="874" y="340" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#b0bcd0" letter-spacing="6">PRESENTED TO</text>

  <!-- Recipient name -->
  <text x="874" y="420" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="url(#goldShine)">${n}</text>

  <!-- Decorative line under name -->
  <rect x="524" y="448" width="700" height="2" fill="url(#line)"/>
  
  <!-- Small diamonds flanking the line -->
  <g opacity="0.5">
    <path d="M504 448 L514 443 L524 448 L514 453 Z" fill="#d7ab46"/>
    <path d="M1224 448 L1234 443 L1244 448 L1234 453 Z" fill="#d7ab46"/>
  </g>

  <!-- Official member text -->
  <text x="874" y="510" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#c8cfe0" letter-spacing="8">OFFICIAL MEMBER OF</text>

  <!-- The Elite Circle -->
  <text x="874" y="600" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="80" font-weight="700" fill="url(#gold)" letter-spacing="6">THE ELITE CIRCLE</text>

  <!-- Tagline -->
  <text x="874" y="650" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#9aa5be" letter-spacing="6">ELEGANCE • EXCELLENCE • IMPACT</text>

  <!-- Decorative separator -->
  <g opacity="0.6" transform="translate(874,690)">
    <rect x="-200" y="-0.75" width="400" height="1.5" fill="url(#line)"/>
    <circle cx="0" cy="0" r="4" fill="none" stroke="#d7ab46" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="1.5" fill="#f3d88d"/>
    <circle cx="-210" cy="0" r="2" fill="#d7ab46" opacity="0.5"/>
    <circle cx="210" cy="0" r="2" fill="#d7ab46" opacity="0.5"/>
  </g>

  <!-- Award/Business label in ornate pill -->
  <rect x="${874 - (l.length * 8 + 80)}" y="720" width="${l.length * 16 + 160}" height="70" rx="35" fill="#0a0f1a" fill-opacity="0.8" stroke="url(#gold)" stroke-opacity="0.5" stroke-width="1.5"/>
  <rect x="${874 - (l.length * 8 + 76)}" y="724" width="${l.length * 16 + 152}" height="62" rx="31" fill="none" stroke="#d7ab46" stroke-opacity="0.15" stroke-width="1"/>
  <text x="874" y="766" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="url(#gold)" font-weight="700" letter-spacing="3">${l.toUpperCase()}</text>

  ${sl ? `<text x="874" y="850" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#b0b8c8" font-style="italic">"${sl}"</text>` : ''}

  <!-- Bottom section -->
  <rect x="674" y="${sl ? 895 : 840}" width="400" height="1.5" fill="url(#line)" opacity="0.6"/>

  <!-- Date -->
  <text x="874" y="${sl ? 945 : 895}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#b0bcd0" letter-spacing="3">Issued on ${escapeSvg(eventDate)}</text>

  <!-- Bottom decorative stars -->
  <g opacity="0.25" transform="translate(874, ${sl ? 990 : 945})">
    <path d="M-30 0 L-27 -3 L-24 0 L-27 3 Z" fill="#d7ab46"/>
    <path d="M0 0 L3 -4 L6 0 L3 4 Z" fill="#f3d88d"/>
    <path d="M24 0 L27 -3 L30 0 L27 3 Z" fill="#d7ab46"/>
  </g>
</svg>`;
};
async function svgToPng(svgString: string): Promise<Uint8Array> {
  return await renderSvgToPng(svgString);
}
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { name, email, awardTitle, teamName, eventDate = 'March 28, 2026', isGroup, businessName, tagline }: CertificateRequest = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'name and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const certLabel = isGroup ? (businessName || '') : (awardTitle || '');
    const certSublabel = isGroup ? (tagline || '') : undefined;

    if (!certLabel) {
      return new Response(
        JSON.stringify({ error: isGroup ? 'businessName is required for group' : 'awardTitle is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate SVG then convert to PNG attachment
    const certificateSvg = generateCertificateSvg(name, certLabel, certSublabel, eventDate);
    const pngBytes = await svgToPng(certificateSvg);

    let binary = '';
    for (let i = 0; i < pngBytes.length; i++) {
      binary += String.fromCharCode(pngBytes[i]);
    }

    const attachmentContent = btoa(binary);
    const attachmentFilename = `Elite-Circle-${name.replace(/\s+/g, '-')}.png`;
    const attachmentType = 'image/png';

    const emailHtml = isGroup
      ? buildGroupEmailHtml(name, businessName!, tagline!, eventDate)
      : buildIndividualEmailHtml(name, awardTitle!, teamName, eventDate);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Elite Circle <theelitecircle@vionevents.com>',
        to: [email],
        subject: isGroup
          ? `Welcome to The Elite Circle — ${businessName}`
          : 'Welcome to The Elite Circle — The Lab by VION',
        html: emailHtml,
        attachments: [
          {
            filename: attachmentFilename,
            content: attachmentContent,
            type: attachmentType,
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error sending certificate email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildGroupEmailHtml(name: string, businessName: string, tagline: string, eventDate: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background-color:#111118;border-radius:12px;border:1px solid #1a1a24;">
        <tr><td style="padding:48px 40px;text-align:center;">
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#c49b30;margin:0 0 8px 0;font-weight:700;">
            Welcome to The Elite Circle
          </h1>
          <p style="font-size:12px;color:#707070;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px 0;">
            The Lab by VION — First Edition
          </p>
          <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 32px auto;"></div>
          <p style="font-size:16px;color:#e0e0e0;line-height:1.6;margin:0 0 24px 0;">
            Congratulations, <strong style="color:#c49b30;">${name}</strong>!
          </p>
          <p style="font-size:14px;color:#a0a0a0;line-height:1.8;margin:0 0 24px 0;">
            You have been recognized as an official member of <strong style="color:#e0e0e0;">The Elite Circle</strong>.
          </p>
          <div style="display:inline-block;padding:12px 28px;border:1px solid #c49b3040;border-radius:30px;margin:0 0 12px 0;">
            <span style="font-size:14px;color:#c49b30;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
              ${businessName}
            </span>
          </div>
          <p style="font-size:13px;color:#a0a0a0;font-style:italic;margin:0 0 24px 0;">
            "${tagline}"
          </p>
          <p style="font-size:13px;color:#707070;margin:0 0 24px 0;">${eventDate}</p>
          <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 24px auto;"></div>
          <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">
            Your reward is attached — download and share your achievements on your social medias!
          </p>
          <p style="font-size:13px;color:#e0e0e0;font-weight:600;line-height:1.8;margin:0 0 24px 0;">
            <em>"Proud to be part of The Elite Circle"</em>
          </p>
          <p style="font-size:11px;color:#c49b30;font-weight:600;letter-spacing:1.5px;margin:0 0 4px 0;">#VIONEVENTS #TheLab #EliteCircle</p>
          <p style="font-size:11px;color:#404050;margin:24px 0 0 0;">© 2026 VION Events. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildIndividualEmailHtml(name: string, awardTitle: string, teamName: string | undefined, eventDate: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background-color:#111118;border-radius:12px;border:1px solid #1a1a24;">
        <tr><td style="padding:48px 40px;text-align:center;">
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#c49b30;margin:0 0 8px 0;font-weight:700;">
            Welcome to The Elite Circle
          </h1>
          <p style="font-size:12px;color:#707070;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px 0;">
            The Lab by VION — First Edition
          </p>
          <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 32px auto;"></div>
          <p style="font-size:16px;color:#e0e0e0;line-height:1.6;margin:0 0 24px 0;">
            Congratulations, <strong style="color:#c49b30;">${name}</strong>!
          </p>
          <p style="font-size:14px;color:#a0a0a0;line-height:1.8;margin:0 0 24px 0;">
            You have been recognized as an official member of <strong style="color:#e0e0e0;">The Elite Circle</strong> for your outstanding achievement:
          </p>
          <div style="display:inline-block;padding:12px 28px;border:1px solid #c49b3040;border-radius:30px;margin:0 0 32px 0;">
            <span style="font-size:14px;color:#c49b30;text-transform:uppercase;letter-spacing:2px;font-weight:600;">${awardTitle}</span>
          </div>
          ${teamName ? `<p style="font-size:13px;color:#707070;margin:0 0 24px 0;">Team: <strong style="color:#a0a0a0;">${teamName}</strong></p>` : ''}
          <p style="font-size:13px;color:#707070;margin:0 0 24px 0;">${eventDate}</p>
          <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 24px auto;"></div>
          <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">Your certificate is attached — download and share it!</p>
          <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">Share your achievement on social media!</p>
          <p style="font-size:12px;color:#707070;line-height:1.6;margin:0 0 24px 0;">
            <em>"Proud to be part of The Elite Circle 🏆 — ${awardTitle} at The Lab by VION #VIONEVENTS #TheLab #EliteCircle"</em>
          </p>
          <p style="font-size:11px;color:#c49b30;font-weight:600;letter-spacing:1.5px;margin:0 0 8px 0;">#VIONEVENTS</p>
          <p style="font-size:11px;color:#404050;margin:24px 0 0 0;">© 2026 VION Events. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
