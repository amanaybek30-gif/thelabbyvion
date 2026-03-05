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
      <stop offset="0%" stop-color="#0b0d12"/>
      <stop offset="45%" stop-color="#101522"/>
      <stop offset="100%" stop-color="#0b0d12"/>
    </linearGradient>
    <radialGradient id="glowTop" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#f3d88d" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#f3d88d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5df9f"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="100%" stop-color="#b9892b"/>
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#d7ab46"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1748" height="1228" fill="url(#bg)"/>
  <rect width="1748" height="1228" fill="url(#glowTop)"/>

  <rect x="42" y="42" width="1664" height="1144" rx="24" fill="none" stroke="#8f6a24" stroke-opacity="0.35" stroke-width="2"/>
  <rect x="64" y="64" width="1620" height="1100" rx="20" fill="none" stroke="url(#gold)" stroke-opacity="0.75" stroke-width="3"/>
  <rect x="88" y="88" width="1572" height="1052" rx="18" fill="none" stroke="#f1d68d" stroke-opacity="0.18" stroke-width="1.5"/>

  <g opacity="0.7" filter="url(#softGlow)">
    <circle cx="130" cy="130" r="20" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="1618" cy="130" r="20" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="130" cy="1098" r="20" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="1618" cy="1098" r="20" fill="none" stroke="url(#gold)" stroke-width="2"/>
  </g>

  <g opacity="0.25">
    <path d="M170 220 C260 190, 330 190, 420 220" stroke="url(#gold)" stroke-width="2" fill="none"/>
    <path d="M1328 220 C1418 190, 1488 190, 1578 220" stroke="url(#gold)" stroke-width="2" fill="none"/>
    <path d="M170 1008 C260 1038, 330 1038, 420 1008" stroke="url(#gold)" stroke-width="2" fill="none"/>
    <path d="M1328 1008 C1418 1038, 1488 1038, 1578 1008" stroke="url(#gold)" stroke-width="2" fill="none"/>
  </g>

  <text x="874" y="285" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-weight="700" fill="url(#gold)">${n}</text>

  <rect x="724" y="322" width="300" height="2" fill="url(#line)"/>

  <text x="874" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#abb5c2" letter-spacing="8">OFFICIAL MEMBER OF</text>

  <text x="874" y="490" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="700" fill="url(#gold)" letter-spacing="7">THE ELITE CIRCLE</text>

  <text x="874" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#738096" letter-spacing="5">ELEGANCE • EXCELLENCE • IMPACT</text>

  <rect x="${874 - (l.length * 9 + 110)}" y="612" width="${l.length * 18 + 220}" height="86" rx="43" fill="#0e1320" fill-opacity="0.75" stroke="#d7ab46" stroke-opacity="0.35" stroke-width="2"/>

  <text x="874" y="668" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="url(#gold)" font-weight="700" letter-spacing="3">${l.toUpperCase()}</text>

  ${sl ? `<text x="874" y="760" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#c8ced8" font-style="italic">“${sl}”</text>` : ''}

  <rect x="674" y="${sl ? 806 : 768}" width="400" height="2" fill="url(#line)" opacity="0.8"/>
  <text x="874" y="${sl ? 862 : 824}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#8b95a6">Issued on ${escapeSvg(eventDate)}</text>
</svg>`;
};
function svgToPng(svgString: string): Uint8Array {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: "width",
      value: 1748,
    },
  });

  return resvg.render().asPng();
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

    const { name, email, awardTitle, teamName, eventDate = 'February 28, 2026', isGroup, businessName, tagline }: CertificateRequest = await req.json();

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
    const pngBytes = svgToPng(certificateSvg);

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
