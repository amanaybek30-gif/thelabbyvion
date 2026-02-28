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
              <!-- Header -->
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#c49b30;margin:0 0 8px 0;font-weight:700;">
                Welcome to The Elite Circle
              </h1>
              <p style="font-size:12px;color:#707070;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px 0;">
                The Lab by VION — First Edition
              </p>

              <!-- Divider -->
              <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 32px auto;"></div>

              <!-- Greeting -->
              <p style="font-size:16px;color:#e0e0e0;line-height:1.6;margin:0 0 24px 0;">
                Congratulations, <strong style="color:#c49b30;">${name}</strong>!
              </p>

              <p style="font-size:14px;color:#a0a0a0;line-height:1.8;margin:0 0 24px 0;">
                You have been recognized as an official member of <strong style="color:#e0e0e0;">The Elite Circle</strong> for your outstanding achievement:
              </p>

              <!-- Award Badge -->
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

              <p style="font-size:13px;color:#707070;margin:0 0 32px 0;">
                ${eventDate}
              </p>

              <!-- Divider -->
              <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#c49b30,transparent);margin:0 auto 32px auto;"></div>

              <!-- Social -->
              <p style="font-size:13px;color:#a0a0a0;line-height:1.8;margin:0 0 8px 0;">
                Share your achievement on social media!
              </p>
              <p style="font-size:12px;color:#707070;line-height:1.6;margin:0 0 24px 0;">
                <em>"Proud to be part of The Elite Circle 🏆 — ${awardTitle} at The Lab by VION #TheLab #VION #EliteCircle"</em>
              </p>

              <!-- Footer -->
              <p style="font-size:11px;color:#404050;margin:32px 0 0 0;">
                © 2026 VION. All rights reserved.
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
        from: 'The Lab by VION <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to The Elite Circle — The Lab by VION',
        html: emailHtml,
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
