import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CertificateRequest {
  name: string;
  email: string;
  awardTitle: string;
  teamName?: string;
  eventDate?: string;
}

const generateCertificateHtml = (name: string, awardTitle: string, teamName: string | undefined, eventDate: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A5 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 210mm; height: 148mm;
      background: #0a0a0f;
      font-family: Georgia, 'Times New Roman', serif;
      display: flex; align-items: center; justify-content: center;
      color: #e0e0e0;
    }
    .cert {
      width: 100%; height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 20mm;
      background: radial-gradient(ellipse at center, #12121a 0%, #0a0a0f 70%);
    }
    .logo { width: 48px; height: 48px; border-radius: 8px; margin-bottom: 16px; opacity: 0.9; }
    .name {
      font-size: 26px; font-weight: 700; margin-bottom: 12px;
      background: linear-gradient(135deg, #d4a742, #f0d68a, #c49b30);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #c49b30, transparent); margin: 0 auto 12px; }
    .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #a0a0a0; margin-bottom: 8px; font-family: Arial, sans-serif; }
    .title {
      font-size: 30px; font-weight: 700; letter-spacing: 4px; margin-bottom: 4px;
      background: linear-gradient(135deg, #d4a742, #f0d68a, #c49b30);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .edition { font-size: 9px; text-transform: uppercase; letter-spacing: 2.5px; color: #707070; margin-bottom: 20px; font-family: Arial, sans-serif; }
    .award { display: inline-block; padding: 8px 24px; border: 1px solid rgba(196,155,48,0.25); border-radius: 30px; margin-bottom: 16px; }
    .award span { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #c49b30; font-weight: 600; font-family: Arial, sans-serif; }
    .team { font-size: 11px; color: #707070; margin-bottom: 8px; font-family: Arial, sans-serif; }
    .date { font-size: 9px; color: #505050; margin-bottom: 12px; font-family: Arial, sans-serif; }
    .hashtag { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; color: #c49b30; margin-bottom: 6px; }
    .copyright { font-size: 7px; color: #404050; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="name">${name}</div>
    <div class="divider"></div>
    <div class="subtitle">Official Member of</div>
    <div class="title">THE ELITE CIRCLE</div>
    <div class="edition">First Edition — The Lab by VION</div>
    ${awardTitle ? `<div class="award"><span>${awardTitle}</span></div>` : ''}
    ${teamName ? `<div class="team">${teamName}</div>` : ''}
    <div class="date">${eventDate}</div>
    <div class="hashtag">#VIONEVENTS</div>
    <div class="copyright">© 2026 VION Events. All rights reserved.</div>
  </div>
</body>
</html>`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { name, email, awardTitle, teamName, eventDate = 'February 28, 2026' }: CertificateRequest = await req.json();

    if (!name || !email || !awardTitle) {
      return new Response(
        JSON.stringify({ error: 'name, email, and awardTitle are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate A5 certificate HTML for attachment
    const certificateHtml = generateCertificateHtml(name, awardTitle, teamName, eventDate);
    const certificateBase64 = btoa(unescape(encodeURIComponent(certificateHtml)));

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color:#111118;border-radius:12px;border:1px solid #1a1a24;">
          <tr>
            <td style="padding:48px 40px;text-align:center;">
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
                <span style="font-size:14px;color:#c49b30;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
                  ${awardTitle}
                </span>
              </div>

              ${teamName ? `
              <p style="font-size:13px;color:#707070;margin:0 0 24px 0;">
                Team: <strong style="color:#a0a0a0;">${teamName}</strong>
              </p>
              ` : ''}

              <p style="font-size:13px;color:#707070;margin:0 0 24px 0;">
                ${eventDate}
              </p>

              <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 24px auto;"></div>

              <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">
                Your certificate is attached — download and share it!
              </p>
              <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">
                Share your achievement on social media!
              </p>
              <p style="font-size:12px;color:#707070;line-height:1.6;margin:0 0 24px 0;">
                <em>"Proud to be part of The Elite Circle 🏆 — ${awardTitle} at The Lab by VION #VIONEVENTS #TheLab #EliteCircle"</em>
              </p>

              <p style="font-size:11px;color:#c49b30;font-weight:600;letter-spacing:1.5px;margin:0 0 8px 0;">
                #VIONEVENTS
              </p>
              <p style="font-size:11px;color:#404050;margin:24px 0 0 0;">
                © 2026 VION Events. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Lab by VION <certificates@vionevents.com>',
        to: [email],
        subject: 'Welcome to The Elite Circle — The Lab by VION',
        html: emailHtml,
        attachments: [
          {
            filename: `Elite-Circle-Certificate-${name.replace(/\s+/g, '-')}.html`,
            content: certificateBase64,
            type: 'text/html',
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
