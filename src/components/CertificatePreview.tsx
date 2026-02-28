import { useRef } from 'react';
import { Participant } from '@/lib/types';
import certificateBg from '@/assets/certificate-bg.png';
import vionLogo from '@/assets/vion-logo.png';

interface Props {
  participant: Participant;
  eventDate?: string;
}

const CertificatePreview = ({ participant, eventDate = 'February 28, 2026' }: Props) => {
  const certRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={certRef}
        className="relative w-[360px] h-[640px] rounded-lg overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url(${certificateBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          {/* Logo */}
          <img src={vionLogo} alt="VION" className="w-16 h-16 rounded-lg mb-6 opacity-90" />

          {/* Name */}
          <h2
            className="text-2xl font-display font-bold mb-4 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #d4a742, #f0d68a, #c49b30)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {participant.name}
          </h2>

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-4" 
               style={{ background: 'linear-gradient(90deg, transparent, #c49b30, transparent)' }} />

          {/* Official member */}
          <p className="text-xs uppercase tracking-[0.3em] mb-2 font-body"
             style={{ color: '#a0a0a0' }}>
            Official Member of
          </p>

          {/* Elite Circle */}
          <h1
            className="text-3xl font-display font-bold mb-1 tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #d4a742, #f0d68a, #c49b30)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            THE ELITE CIRCLE
          </h1>

          {/* Subtitle */}
          <p className="text-[10px] uppercase tracking-[0.25em] mb-8 font-body"
             style={{ color: '#707070' }}>
            First Edition — The Lab by VION
          </p>

          {/* Award */}
          {participant.awardTitle && (
            <div className="mb-6 px-6 py-2 rounded-full border"
                 style={{ borderColor: '#c49b3040' }}>
              <p className="text-xs uppercase tracking-[0.2em] font-body"
                 style={{ color: '#c49b30' }}>
                {participant.awardTitle}
              </p>
            </div>
          )}

          {/* Date */}
          <p className="text-[10px] font-body" style={{ color: '#505050' }}>
            {eventDate}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-body">
        9:16 portrait — Instagram Story ready
      </p>
    </div>
  );
};

export default CertificatePreview;
