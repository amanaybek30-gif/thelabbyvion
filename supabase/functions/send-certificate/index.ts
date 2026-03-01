import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="874" height="614" viewBox="0 0 874 614">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#12121a"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a742"/>
      <stop offset="50%" stop-color="#f0d68a"/>
      <stop offset="100%" stop-color="#c49b30"/>
    </linearGradient>
    <linearGradient id="divider" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#c49b30"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
  <rect width="874" height="614" fill="url(#bg)"/>
  <text x="437" y="210" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="700" fill="url(#gold)">${n}</text>
  <rect x="407" y="228" width="60" height="1" fill="url(#divider)"/>
  <text x="437" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#a0a0a0" letter-spacing="3">OFFICIAL MEMBER OF</text>
  <text x="437" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="32" font-weight="700" fill="url(#gold)" letter-spacing="4">THE ELITE CIRCLE</text>
  <text x="437" y="322" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#707070" letter-spacing="2.5">FIRST EDITION — THE LAB BY VION</text>
  <rect x="${437 - (l.length * 4.5 + 28)}" y="345" width="${l.length * 9 + 56}" height="36" rx="18" fill="none" stroke="#c49b3040" stroke-width="1"/>
  <text x="437" y="369" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#c49b30" font-weight="600" letter-spacing="2">${l.toUpperCase()}</text>
  ${sl ? `<text x="437" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#a0a0a0" font-style="italic">"${sl}"</text>` : ''}
  <text x="437" y="${sl ? 435 : 420}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#505050">${escapeSvg(eventDate)}</text>
  <text x="437" y="${sl ? 460 : 448}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="10" fill="#c49b30" font-weight="600" letter-spacing="1.5">#VIONEVENTS</text>
  <text x="437" y="${sl ? 480 : 468}" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="#404050">© 2026 VION Events. All rights reserved.</text>
</svg>`;
};

// Convert SVG string to PNG using resvg-wasm
async function svgToPng(svgString: string): Promise<Uint8Array> {
  const { Resvg, initWasm } = await import("https://esm.sh/@aspect-dev/resvg-wasm@0.0.4");
  
  // Fetch and init WASM binary
  const wasmResponse = await fetch("https://esm.sh/@aspect-dev/resvg-wasm@0.0.4/resvg.wasm");
  const wasmBinary = await wasmResponse.arrayBuffer();
  
  try {
    await initWasm(wasmBinary);
  } catch (_e) {
    // WASM may already be initialized
  }
  
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: 874 },
  });
  
  const rendered = resvg.render();
  return rendered.asPng();
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

    // Generate SVG then convert to PNG
    const certificateSvg = generateCertificateSvg(name, certLabel, certSublabel, eventDate);
    
    let attachmentContent: string;
    let attachmentFilename: string;
    let attachmentType: string;

    try {
      const pngBytes = await svgToPng(certificateSvg);
      // Convert Uint8Array to base64
      let binary = '';
      for (let i = 0; i < pngBytes.length; i++) {
        binary += String.fromCharCode(pngBytes[i]);
      }
      attachmentContent = btoa(binary);
      attachmentFilename = `Elite-Circle-${name.replace(/\s+/g, '-')}.png`;
      attachmentType = 'image/png';
    } catch (pngError) {
      console.error('PNG conversion failed, falling back to SVG:', pngError);
      attachmentContent = btoa(unescape(encodeURIComponent(certificateSvg)));
      attachmentFilename = `Elite-Circle-${name.replace(/\s+/g, '-')}.svg`;
      attachmentType = 'image/svg+xml';
    }

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
