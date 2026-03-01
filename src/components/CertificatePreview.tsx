import { useRef, useCallback } from 'react';
import { Participant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import certificateBg from '@/assets/certificate-bg.png';
import vionLogo from '@/assets/vion-logo.png';

interface Props {
  participant: Participant;
  eventDate?: string;
}

// A5 landscape in px at 150 DPI: 874 x 614
const A5_WIDTH = 874;
const A5_HEIGHT = 614;

const CertificatePreview = ({ participant, eventDate = 'February 28, 2026' }: Props) => {
  const certRef = useRef<HTMLDivElement>(null);
  const a5Ref = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!a5Ref.current) return;
    // Temporarily make the A5 render visible for capture
    a5Ref.current.style.position = 'fixed';
    a5Ref.current.style.left = '-9999px';
    a5Ref.current.style.display = 'block';

    try {
      const canvas = await html2canvas(a5Ref.current, {
        width: A5_WIDTH,
        height: A5_HEIGHT,
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0f',
      });
      const link = document.createElement('a');
      link.download = `Elite-Circle-${participant.name.replace(/\s+/g, '-')}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } finally {
      a5Ref.current.style.display = 'none';
    }
  }, [participant.name]);

  const CertificateContent = ({ isA5 = false }: { isA5?: boolean }) => {
    const scale = isA5 ? 1 : 1;
    const logoSize = isA5 ? 'w-14 h-14' : 'w-16 h-16';
    const nameSize = isA5 ? 'text-2xl' : 'text-2xl';
    const titleSize = isA5 ? 'text-3xl' : 'text-3xl';
    const trackingClass = isA5 ? 'tracking-[0.2em]' : 'tracking-[0.3em]';

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        {/* Logo */}
        <img src={vionLogo} alt="VION" className={`${logoSize} rounded-lg mb-5 opacity-90`} />

        {/* Name */}
        <h2
          className={`${nameSize} font-display font-bold mb-3 leading-tight`}
          style={{
            background: 'linear-gradient(135deg, #d4a742, #f0d68a, #c49b30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {participant.name}
        </h2>

        {/* Divider */}
        <div className="w-16 h-px mb-3"
             style={{ background: 'linear-gradient(90deg, transparent, #c49b30, transparent)' }} />

        {/* Official member */}
        <p className={`text-xs uppercase ${trackingClass} mb-2 font-body`}
           style={{ color: '#a0a0a0' }}>
          Official Member of
        </p>

        {/* Elite Circle */}
        <h1
          className={`${titleSize} font-display font-bold mb-1 tracking-wide`}
          style={{
            background: 'linear-gradient(135deg, #d4a742, #f0d68a, #c49b30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          THE ELITE CIRCLE
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] uppercase tracking-[0.25em] mb-6 font-body"
           style={{ color: '#707070' }}>
          First Edition — The Lab by VION
        </p>

        {/* Award */}
        {participant.awardTitle && (
          <div className="mb-5 px-6 py-2 rounded-full border"
               style={{ borderColor: '#c49b3040' }}>
            <p className="text-xs uppercase tracking-[0.2em] font-body"
               style={{ color: '#c49b30' }}>
              {participant.awardTitle}
            </p>
          </div>
        )}

        {/* Date */}
        <p className="text-[10px] font-body mb-4" style={{ color: '#505050' }}>
          {eventDate}
        </p>

        {/* Hashtag */}
        <p className="text-[10px] font-display font-semibold tracking-[0.15em] mb-2"
           style={{ color: '#c49b30' }}>
          #VIONEVENTS
        </p>

        {/* Copyright */}
        <p className="text-[8px] font-body" style={{ color: '#404050' }}>
          © 2026 VION Events. All rights reserved.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview (9:16 portrait) */}
      <div
        ref={certRef}
        className="relative w-[360px] h-[640px] rounded-lg overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url(${certificateBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <CertificateContent />
      </div>

      {/* Download button */}
      <Button onClick={handleDownload} variant="outline" className="font-body text-sm border-border">
        <Download className="w-4 h-4 mr-2" />
        Download A5 Certificate
      </Button>

      <p className="text-xs text-muted-foreground font-body">
        9:16 portrait preview — Downloads as A5 landscape
      </p>

      {/* Hidden A5 render target for download */}
      <div
        ref={a5Ref}
        className="relative overflow-hidden"
        style={{
          width: `${A5_WIDTH}px`,
          height: `${A5_HEIGHT}px`,
          backgroundImage: `url(${certificateBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'none',
        }}
      >
        <CertificateContent isA5 />
      </div>
    </div>
  );
};

export default CertificatePreview;
