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
      <stop offset="0%" stop-color="#050810"/>
      <stop offset="30%" stop-color="#0a0f1e"/>
      <stop offset="60%" stop-color="#0e1428"/>
      <stop offset="100%" stop-color="#050810"/>
    </linearGradient>
    <radialGradient id="glowCenter" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#d7ab46" stop-opacity="0.1"/>
      <stop offset="60%" stop-color="#d7ab46" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#d7ab46" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowTop" cx="50%" cy="0%" r="55%">
      <stop offset="0%" stop-color="#f3d88d" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#f3d88d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBottom" cx="50%" cy="100%" r="55%">
      <stop offset="0%" stop-color="#b9892b" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#b9892b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fcedc4"/>
      <stop offset="20%" stop-color="#f3d88d"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="80%" stop-color="#c49b30"/>
      <stop offset="100%" stop-color="#b9892b"/>
    </linearGradient>
    <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff5d6"/>
      <stop offset="30%" stop-color="#f3d88d"/>
      <stop offset="70%" stop-color="#d7ab46"/>
      <stop offset="100%" stop-color="#9a7520"/>
    </linearGradient>
    <linearGradient id="goldHoriz" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#fcedc4"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="100%" stop-color="#fcedc4"/>
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="#d7ab4650"/>
      <stop offset="50%" stop-color="#f3d88d"/>
      <stop offset="80%" stop-color="#d7ab4650"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="lineFade" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="30%" stop-color="#d7ab4640"/>
      <stop offset="50%" stop-color="#d7ab4680"/>
      <stop offset="70%" stop-color="#d7ab4640"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="sideGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="30%" stop-color="#d7ab4630"/>
      <stop offset="50%" stop-color="#d7ab4660"/>
      <stop offset="70%" stop-color="#d7ab4630"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.6" fill="#d7ab46" opacity="0.1"/>
    </pattern>
    <pattern id="filigree" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <circle cx="40" cy="40" r="0.4" fill="#d7ab46" opacity="0.06"/>
      <circle cx="0" cy="0" r="0.4" fill="#d7ab46" opacity="0.06"/>
      <circle cx="80" cy="0" r="0.4" fill="#d7ab46" opacity="0.06"/>
      <circle cx="0" cy="80" r="0.4" fill="#d7ab46" opacity="0.06"/>
      <circle cx="80" cy="80" r="0.4" fill="#d7ab46" opacity="0.06"/>
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
  <rect width="1748" height="1228" fill="url(#filigree)"/>

  <!-- Outer triple border -->
  <rect x="24" y="24" width="1700" height="1180" rx="22" fill="none" stroke="#8f6a24" stroke-opacity="0.15" stroke-width="1"/>
  <rect x="40" y="40" width="1668" height="1148" rx="20" fill="none" stroke="url(#gold)" stroke-opacity="0.4" stroke-width="1.5"/>
  <rect x="56" y="56" width="1636" height="1116" rx="18" fill="none" stroke="url(#gold)" stroke-opacity="0.8" stroke-width="2.5"/>
  <rect x="72" y="72" width="1604" height="1084" rx="14" fill="none" stroke="url(#gold)" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Inner decorative border with dash -->
  <rect x="96" y="96" width="1556" height="1036" rx="10" fill="none" stroke="#d7ab46" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="12,8"/>

  <!-- Corner ornaments - top left -->
  <g opacity="0.7" transform="translate(96,96)">
    <path d="M0 80 L0 0 L80 0" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M12 65 L12 12 L65 12" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="5" fill="#d7ab46"/>
    <circle cx="0" cy="0" r="2" fill="#fcedc4"/>
    <path d="M0 0 Q40 18 80 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M0 0 Q18 40 0 80" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M25 0 L25 25 L0 25" fill="none" stroke="#d7ab46" stroke-width="0.8" stroke-opacity="0.2"/>
  </g>
  <!-- Corner ornaments - top right -->
  <g opacity="0.7" transform="translate(1652,96) scale(-1,1)">
    <path d="M0 80 L0 0 L80 0" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M12 65 L12 12 L65 12" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="5" fill="#d7ab46"/>
    <circle cx="0" cy="0" r="2" fill="#fcedc4"/>
    <path d="M0 0 Q40 18 80 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M0 0 Q18 40 0 80" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M25 0 L25 25 L0 25" fill="none" stroke="#d7ab46" stroke-width="0.8" stroke-opacity="0.2"/>
  </g>
  <!-- Corner ornaments - bottom left -->
  <g opacity="0.7" transform="translate(96,1132) scale(1,-1)">
    <path d="M0 80 L0 0 L80 0" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M12 65 L12 12 L65 12" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="5" fill="#d7ab46"/>
    <circle cx="0" cy="0" r="2" fill="#fcedc4"/>
    <path d="M0 0 Q40 18 80 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M0 0 Q18 40 0 80" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M25 0 L25 25 L0 25" fill="none" stroke="#d7ab46" stroke-width="0.8" stroke-opacity="0.2"/>
  </g>
  <!-- Corner ornaments - bottom right -->
  <g opacity="0.7" transform="translate(1652,1132) scale(-1,-1)">
    <path d="M0 80 L0 0 L80 0" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M12 65 L12 12 L65 12" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="5" fill="#d7ab46"/>
    <circle cx="0" cy="0" r="2" fill="#fcedc4"/>
    <path d="M0 0 Q40 18 80 0" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M0 0 Q18 40 0 80" fill="none" stroke="#d7ab46" stroke-width="1" stroke-opacity="0.25"/>
    <path d="M25 0 L25 25 L0 25" fill="none" stroke="#d7ab46" stroke-width="0.8" stroke-opacity="0.2"/>
  </g>

  <!-- Top center ornamental flourish -->
  <g opacity="0.6" transform="translate(874,145)">
    <path d="M-160 0 Q-120 -30 -80 0 Q-40 30 0 0 Q40 -30 80 0 Q120 30 160 0" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <path d="M-100 0 Q-50 -18 0 0 Q50 18 100 0" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="4" fill="#fcedc4"/>
    <circle cx="-160" cy="0" r="2.5" fill="#d7ab46"/>
    <circle cx="160" cy="0" r="2.5" fill="#d7ab46"/>
    <path d="M-8 0 L0 -8 L8 0 L0 8 Z" fill="none" stroke="#f3d88d" stroke-width="1" stroke-opacity="0.5"/>
  </g>

  <!-- Bottom center ornamental flourish -->
  <g opacity="0.6" transform="translate(874,1085)">
    <path d="M-160 0 Q-120 30 -80 0 Q-40 -30 0 0 Q40 30 80 0 Q120 -30 160 0" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <path d="M-100 0 Q-50 18 0 0 Q50 -18 100 0" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-opacity="0.4"/>
    <circle cx="0" cy="0" r="4" fill="#fcedc4"/>
    <circle cx="-160" cy="0" r="2.5" fill="#d7ab46"/>
    <circle cx="160" cy="0" r="2.5" fill="#d7ab46"/>
    <path d="M-8 0 L0 -8 L8 0 L0 8 Z" fill="none" stroke="#f3d88d" stroke-width="1" stroke-opacity="0.5"/>
  </g>

  <!-- Side decorative lines -->
  <rect x="115" y="350" width="2" height="528" fill="url(#sideGlow)"/>
  <rect x="1631" y="350" width="2" height="528" fill="url(#sideGlow)"/>

  <!-- Side small diamond accents -->
  <g opacity="0.3">
    <path d="M116 340 L120 334 L124 340 L120 346 Z" fill="#d7ab46"/>
    <path d="M116 888 L120 882 L124 888 L120 894 Z" fill="#d7ab46"/>
    <path d="M1628 340 L1632 334 L1636 340 L1632 346 Z" fill="#d7ab46"/>
    <path d="M1628 888 L1632 882 L1636 888 L1632 894 Z" fill="#d7ab46"/>
  </g>

  <!-- Star/diamond accent top -->
  <g opacity="0.5" transform="translate(874, 200)">
    <path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#f3d88d"/>
    <path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" fill="#fcedc4" opacity="0.6"/>
  </g>

  <!-- Certificate of Membership heading -->
  <text x="874" y="268" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#FFFFFF" letter-spacing="12" font-weight="400">CERTIFICATE OF MEMBERSHIP</text>

  <!-- Decorative line under heading -->
  <rect x="524" y="292" width="700" height="2" fill="url(#line)"/>
  <rect x="574" y="298" width="600" height="1" fill="url(#lineFade)" opacity="0.5"/>

  <!-- Small ornament under line -->
  <g opacity="0.5" transform="translate(874,305)">
    <path d="M-6 0 L0 -6 L6 0 L0 6 Z" fill="#d7ab46"/>
  </g>

  <!-- Presented to -->
  <text x="874" y="365" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#FFFFFF" letter-spacing="8" opacity="0.85">PRESENTED TO</text>

  <!-- Recipient name -->
  <text x="874" y="455" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="url(#goldShine)">${n}</text>

  <!-- Decorative line under name -->
  <rect x="474" y="480" width="800" height="2.5" fill="url(#line)"/>
  <rect x="524" y="487" width="700" height="1" fill="url(#lineFade)" opacity="0.4"/>

  <!-- Small diamonds flanking the line -->
  <g opacity="0.6">
    <path d="M454 480 L466 474 L478 480 L466 486 Z" fill="#d7ab46"/>
    <path d="M1270 480 L1282 474 L1294 480 L1282 486 Z" fill="#d7ab46"/>
  </g>

  <!-- Official member text -->
  <text x="874" y="545" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#FFFFFF" letter-spacing="10" font-weight="400">OFFICIAL MEMBER OF</text>

  <!-- The Elite Circle -->
  <text x="874" y="640" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" fill="url(#gold)" letter-spacing="5">THE ELITE CIRCLE</text>

  <!-- Tagline -->
  <text x="874" y="695" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#FFFFFF" letter-spacing="8" opacity="0.7">ELEGANCE  •  EXCELLENCE  •  IMPACT</text>

  <!-- Decorative separator with ornate center -->
  <g opacity="0.7" transform="translate(874,740)">
    <rect x="-250" y="-1" width="500" height="2" fill="url(#line)"/>
    <circle cx="0" cy="0" r="6" fill="none" stroke="url(#goldHoriz)" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="2.5" fill="#fcedc4"/>
    <path d="M-14 0 L0 -14 L14 0 L0 14 Z" fill="none" stroke="#d7ab46" stroke-width="0.8" stroke-opacity="0.4"/>
    <circle cx="-260" cy="0" r="2.5" fill="#d7ab46" opacity="0.5"/>
    <circle cx="260" cy="0" r="2.5" fill="#d7ab46" opacity="0.5"/>
  </g>

  <!-- Award/Business label in ornate pill -->
  <rect x="${874 - (l.length * 8 + 90)}" y="770" width="${l.length * 16 + 180}" height="74" rx="37" fill="#080c18" fill-opacity="0.85" stroke="url(#gold)" stroke-opacity="0.6" stroke-width="2"/>
  <rect x="${874 - (l.length * 8 + 85)}" y="775" width="${l.length * 16 + 170}" height="64" rx="32" fill="none" stroke="#d7ab46" stroke-opacity="0.15" stroke-width="1"/>
  <text x="874" y="818" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="url(#gold)" font-weight="700" letter-spacing="4">${l.toUpperCase()}</text>

  ${sl ? `<text x="874" y="900" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#FFFFFF" font-style="italic" opacity="0.9">"${sl}"</text>` : ''}

  <!-- Bottom section -->
  <rect x="624" y="${sl ? 940 : 885}" width="500" height="1.5" fill="url(#line)" opacity="0.6"/>

  <!-- Date -->
  <text x="874" y="${sl ? 985 : 935}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#FFFFFF" letter-spacing="4" opacity="0.85">Issued on ${escapeSvg(eventDate)}</text>

  <!-- Bottom decorative stars -->
  <g opacity="0.4" transform="translate(874, ${sl ? 1025 : 975})">
    <path d="M-40 0 L-36 -4 L-32 0 L-36 4 Z" fill="#d7ab46"/>
    <path d="M0 0 L4 -6 L8 0 L4 6 Z" fill="#fcedc4"/>
    <path d="M32 0 L36 -4 L40 0 L36 4 Z" fill="#d7ab46"/>
    <path d="M-20 0 L-18 -2 L-16 0 L-18 2 Z" fill="#d7ab46" opacity="0.5"/>
    <path d="M16 0 L18 -2 L20 0 L18 2 Z" fill="#d7ab46" opacity="0.5"/>
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
