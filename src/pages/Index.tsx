import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import DragonBallStar from '@/components/DragonBallStar';
import EnergyParticles from '@/components/EnergyParticles';
import Countdown from '@/components/Countdown';
import KiBlast from '@/components/KiBlast';
import ZFightersRow from '@/components/ZFightersRow';
import gokuImg from '@/assets/goku.png';
import shenlongImg from '@/assets/shenlong.png';

const PARTY_DATE = new Date('2026-03-22T12:00:00');
const WHATSAPP_LINK = 'https://wa.link/83m70u';
const GOOGLE_MAPS_LINK = 'https://www.google.com/maps/place/R.+Carlos+Henrique+Mangeon+-+Recanto+dos+Eucaliptos,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP,+12226-638/@-23.2201083,-45.8241749,17z/data=!3m1!4b1!4m6!3m5!1s0x94cc4caeeb72a84f:0xb193b54bd214f45a!8m2!3d-23.2201133!4d-45.8216!16s%2Fg%2F11fj9k9xdx?entry=ttu&g_ep=EgoyMDI2MDMxMC4wIKXMDSoASAFQAw%3D%3D';

const PANELS = [
  { id: 'invite', bg: 'radial-gradient(ellipse at 50% 50%, hsl(15 80% 10%), hsl(0 60% 5%))' },
  { id: 'details', bg: 'radial-gradient(ellipse at 50% 70%, hsl(210 80% 10%), hsl(220 60% 4%))' },
  { id: 'countdown', bg: 'radial-gradient(ellipse at 50% 50%, hsl(35 80% 8%), hsl(25 100% 4%))' },
  { id: 'confirm', bg: 'radial-gradient(ellipse at 50% 30%, hsl(120 50% 8%), hsl(120 40% 3%))' },
];

const Index: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  const handleStart = useCallback(() => {
    const tl = gsap.timeline({ onComplete: () => setStarted(true) });
    tl.to('.landing-overlay', { opacity: 1, duration: 0.15, backgroundColor: 'hsl(55 100% 80%)' });
    tl.to('.landing-overlay', { opacity: 0, duration: 0.6 });
    tl.to('.landing-content', { scale: 1.5, opacity: 0, duration: 0.5 }, '<');
  }, []);

  const goToPanel = useCallback((index: number) => {
    if (isAnimating.current || index < 0 || index >= PANELS.length || index === currentPanel) return;
    isAnimating.current = true;

    const direction = index > currentPanel ? 1 : -1;
    const currentEl = panelRefs.current[currentPanel];
    const nextEl = panelRefs.current[index];

    if (!currentEl || !nextEl) {
      isAnimating.current = false;
      return;
    }

    gsap.set(nextEl, {
      clipPath: direction > 0
        ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
        : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      zIndex: 10,
      visibility: 'visible',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentEl, { visibility: 'hidden', zIndex: 0 });
        gsap.set(nextEl, { zIndex: 5 });
        setCurrentPanel(index);
        isAnimating.current = false;
      },
    });

    tl.to(nextEl, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: 'power3.inOut' });
    tl.to(currentEl.querySelector('.panel-content'), { y: direction > 0 ? -60 : 60, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);

    const nextContent = nextEl.querySelector('.panel-content');
    if (nextContent) {
      gsap.set(nextContent, { y: direction > 0 ? 60 : -60, opacity: 0 });
      tl.to(nextContent, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.4);
    }
  }, [currentPanel]);

  useEffect(() => {
    if (!started) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      goToPanel(e.deltaY > 0 ? currentPanel + 1 : currentPanel - 1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      goToPanel(diff > 0 ? currentPanel + 1 : currentPanel - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToPanel(currentPanel + 1);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToPanel(currentPanel - 1);
    };

    const el = sliderRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      el.addEventListener('touchstart', handleTouchStart);
      el.addEventListener('touchend', handleTouchEnd);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (el) {
        el.removeEventListener('wheel', handleWheel);
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [started, currentPanel, goToPanel]);

  useEffect(() => {
    if (!started) return;

    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        visibility: i === 0 ? 'visible' : 'hidden',
        zIndex: i === 0 ? 5 : 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      });
    });

    const firstContent = panelRefs.current[0]?.querySelector('.panel-content');
    if (firstContent) {
      gsap.fromTo(firstContent, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    }
  }, [started]);

  // ==================== LANDING SCREEN ====================
  if (!started) {
    return (
      <div className="swipe-slider" style={{ background: 'radial-gradient(ellipse at 50% 30%, hsl(25 100% 12%), hsl(25 100% 4%))' }}>
        <EnergyParticles count={30} />

        {/* Dragon Balls — positioned only in corners/edges, away from center text */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { star: 1, left: '3%',  top: '4%',  size: 30 },
            { star: 2, left: '85%', top: '6%',  size: 28 },
            { star: 3, left: '8%',  top: '82%', size: 32 },
            { star: 4, left: '90%', top: '78%', size: 26 },
            { star: 5, left: '75%', top: '3%',  size: 24 },
            { star: 6, left: '5%',  top: '25%', size: 28 },
            { star: 7, left: '88%', top: '30%', size: 30 },
          ].map(({ star, left, top, size }) => (
            <div
              key={star}
              className="absolute float-animation"
              style={{
                left,
                top,
                animationDelay: `${star * 0.5}s`,
                animationDuration: `${3 + star * 0.5}s`,
              }}
            >
              <DragonBallStar stars={star} size={size} />
            </div>
          ))}
        </div>

        {/* Lightning */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="absolute w-px bg-primary/60"
            style={{
              left: `${20 + n * 25}%`,
              top: 0,
              height: '100%',
              animation: `lightning ${1.5 + n * 0.3}s infinite`,
              animationDelay: `${n * 0.7}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Shenlong — top-left, not covering text */}
        <img
          src={shenlongImg}
          alt="Shenlong"
          className="shenlong-motion absolute -top-2 -left-4 w-32 sm:w-52 md:w-64 pointer-events-none opacity-80"
        />

        {/* Goku — bottom-left, fully visible, no face overlap */}
        <img
          src={gokuImg}
          alt="Goku"
          className="absolute bottom-0 left-2 sm:left-6 h-[32vh] sm:h-[42vh] md:h-[50vh] object-contain pointer-events-none opacity-60"
          style={{ filter: 'brightness(0.8) saturate(0.7)' }}
        />

        {/* Ki charge lines */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="ki-charge-line absolute w-full" style={{ top: `${15 + i * 18}%`, animationDelay: `${i * 0.4}s` }} />
        ))}

        <div className="landing-content absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div className="ki-aura rounded-full p-2 sm:p-3 mb-4 sm:mb-6">
            <DragonBallStar stars={6} size={80} />
          </div>

          <h1
            className="font-bangers text-5xl sm:text-7xl md:text-8xl text-primary text-center leading-none tracking-wider"
            style={{ textShadow: '0 0 30px hsl(35 100% 50% / 0.6), 0 0 60px hsl(35 100% 50% / 0.3), 2px 2px 0 hsl(0 85% 40%)' }}
          >
            MIGUEL
          </h1>
          <h2
            className="font-bangers text-3xl sm:text-5xl md:text-6xl text-secondary text-center tracking-wider mt-1"
            style={{ textShadow: '0 0 20px hsl(15 100% 45% / 0.5), 1px 1px 0 hsl(0 60% 30%)' }}
          >
            FAZ 6 ANOS!
          </h2>

          <p className="text-muted-foreground text-xs sm:text-sm mt-3 sm:mt-4 font-russo tracking-widest uppercase">
            Uma aventura épica te espera
          </p>

          <button
            onClick={handleStart}
            className="power-button mt-6 sm:mt-8 px-7 py-3 sm:px-12 sm:py-5 rounded-full font-bangers text-lg sm:text-2xl tracking-wider text-foreground uppercase cursor-pointer"
          >
            ⚡ ENTRAR NA MISSÃO ⚡
          </button>

          <div className="absolute bottom-6 sm:bottom-8 animate-bounce text-muted-foreground text-xs tracking-widest">
            TOQUE PARA INICIAR
          </div>
        </div>

        <div className="landing-overlay absolute inset-0 z-20 pointer-events-none opacity-0" />
      </div>
    );
  }

  // ==================== SWIPE SLIDER ====================
  return (
    <div ref={sliderRef} className="swipe-slider">
      {/* Navigation dots */}
      <div className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 sm:gap-3">
        {PANELS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPanel(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer border-0 ${i === currentPanel ? 'bg-primary scale-125 shadow-[0_0_10px_hsl(35_100%_50%/0.6)]' : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'}`}
            aria-label={`Ir para seção ${i + 1}`}
          />
        ))}
      </div>

      {/* ============ PANEL 1: INVITATION ============ */}
      <div ref={(el) => { panelRefs.current[0] = el; }} className="swipe-panel" style={{ background: PANELS[0].bg }}>
        <EnergyParticles count={15} color="hsl(0 100% 60%)" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="ki-charge-line absolute w-full" style={{ top: `${25 + i * 25}%`, animationDelay: `${i * 0.5}s` }} />
        ))}
        <div className="panel-content text-center px-5 sm:px-6 max-w-lg mx-auto">
          <DragonBallStar stars={6} size={70} className="mx-auto mb-4 sm:mb-6 float-animation" />
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 font-russo">Você foi convocado para</p>
          <h2 className="font-bangers text-3xl sm:text-6xl text-primary leading-tight" style={{ textShadow: '0 0 30px hsl(35 100% 50% / 0.5), 2px 2px 0 hsl(0 85% 40%)' }}>
            A FESTA DO<br />MIGUEL!
          </h2>
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="font-bangers text-xl sm:text-3xl text-accent" style={{ textShadow: '0 0 15px hsl(120 80% 45% / 0.4)' }}>
              🐉 TEMA: DRAGON BALL 🐉
            </p>
            <p className="text-muted-foreground mt-1.5 sm:mt-2 text-xs sm:text-sm">
              MIGUEL LEMES LEAL completa <span className="text-primary font-black text-base sm:text-lg">6 ANOS!</span>
            </p>
          </div>
          <ZFightersRow className="mt-4 sm:mt-5" />
          <div className="mt-4 sm:mt-6 text-muted-foreground text-xs tracking-widest animate-bounce">DESLIZE PARA CONTINUAR ↓</div>
        </div>
      </div>

      {/* ============ PANEL 2: DETAILS ============ */}
      <div ref={(el) => { panelRefs.current[1] = el; }} className="swipe-panel" style={{ background: PANELS[1].bg }}>
        <EnergyParticles count={12} color="hsl(210 100% 60%)" />
        <div className="panel-content text-center px-5 sm:px-6 max-w-lg mx-auto">
          <h2 className="font-bangers text-2xl sm:text-5xl text-primary mb-5 sm:mb-8" style={{ textShadow: '0 0 20px hsl(35 100% 50% / 0.5)' }}>
            📍 DADOS DA MISSÃO
          </h2>
          <div className="space-y-3 sm:space-y-5">
            <div className="countdown-box rounded-xl p-3.5 sm:p-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">📅</span>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">DATA</p>
                  <p className="font-bangers text-lg sm:text-2xl text-foreground">22 de março 2026</p>
                  <p className="text-xs sm:text-sm text-primary font-russo">DOMINGO, A PARTIR DE 12:00</p>
                </div>
              </div>
            </div>
            <div className="countdown-box rounded-xl p-3.5 sm:p-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🏠</span>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">LOCAL</p>
                  <p className="font-bangers text-base sm:text-xl text-foreground">RUA CARLOS HENRIQUE MANGEON,
                    79 - Campos de São José</p>
                </div>
              </div>
            </div>
            <div className="countdown-box rounded-xl p-3.5 sm:p-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">👕</span>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">TRAJE</p>
                  <p className="font-bangers text-base sm:text-xl text-foreground">leve roupa de banho</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Fantasia opcional 😄</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps button */}
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="maps-button mt-4 sm:mt-6 px-5 py-3 sm:px-8 sm:py-4 rounded-full font-bangers text-base sm:text-xl tracking-wider text-foreground uppercase cursor-pointer inline-flex items-center gap-2.5 mx-auto"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            VER NO MAPA
          </a>

          <ZFightersRow className="mt-3 sm:mt-5" />
        </div>
      </div>

      {/* ============ PANEL 3: COUNTDOWN ============ */}
      <div ref={(el) => { panelRefs.current[2] = el; }} className="swipe-panel" style={{ background: PANELS[2].bg }}>
        <EnergyParticles count={25} />
        <div className="absolute bottom-12 right-8 opacity-30">
          <KiBlast />
        </div>
        <div className="panel-content text-center px-5 sm:px-6 max-w-lg mx-auto">
          {/* Dragon balls in safe corners only */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { star: 1, left: '5%',  top: '8%' },
              { star: 2, left: '82%', top: '5%' },
              { star: 3, left: '8%',  top: '85%' },
              { star: 4, left: '85%', top: '82%' },
            ].map(({ star, left, top }) => (
              <div key={star} className="absolute float-animation" style={{ left, top, animationDelay: `${star * 0.8}s` }}>
                <DragonBallStar stars={star} size={24} />
              </div>
            ))}
          </div>
          <h2 className="font-bangers text-2xl sm:text-5xl text-primary mb-2 sm:mb-3" style={{ textShadow: '0 0 20px hsl(35 100% 50% / 0.5)' }}>
            ⏰ A BATALHA COMEÇA EM
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8 tracking-widest">PREPARE SEU PODER</p>
          <Countdown targetDate={PARTY_DATE} />
          <ZFightersRow className="mt-6 sm:mt-8" />
          <div className="mt-4 sm:mt-6">
            <p className="text-muted-foreground text-xs tracking-widest">CADA SEGUNDO CONTA, GUERREIRO!</p>
            <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl animate-bounce">🐉</div>
          </div>
        </div>
      </div>

      {/* ============ PANEL 4: CONFIRM ============ */}
      <div ref={(el) => { panelRefs.current[3] = el; }} className="swipe-panel" style={{ background: PANELS[3].bg }}>
        <EnergyParticles count={20} color="hsl(120 80% 50%)" />
        <img
          src={shenlongImg}
          alt="Shenlong"
          className="shenlong-motion absolute -top-8 -left-8 w-36 sm:w-60 opacity-70 pointer-events-none"
        />
        <div className="absolute top-1/4 left-8 opacity-20">
          <KiBlast />
        </div>
        <div className="panel-content text-center px-5 sm:px-6 max-w-lg mx-auto">
          <DragonBallStar stars={7} size={70} className="mx-auto mb-4 sm:mb-6 float-animation" />
          <h2 className="font-bangers text-2xl sm:text-5xl text-primary mb-2 sm:mb-3" style={{ textShadow: '0 0 25px hsl(35 100% 50% / 0.6)' }}>
            🐉 CONFIRME SUA PRESENÇA!
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-5 sm:mb-8 max-w-sm mx-auto">
            Guerreiro, sua presença é essencial para completar as 7 esferas do dragão!
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button px-6 py-4 sm:px-12 sm:py-6 rounded-full font-bangers text-lg sm:text-2xl tracking-wider text-foreground uppercase cursor-pointer inline-flex items-center gap-2.5 sm:gap-3 mx-auto"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            CONFIRMAR PRESENÇA
          </a>

          <ZFightersRow className="mt-4 sm:mt-6" />

          <p className="text-muted-foreground text-xs mt-4 sm:mt-6 tracking-wider">📱 (12) 98271-7620</p>
          <div className="mt-4 sm:mt-8 text-muted-foreground/50 text-xs">
            <p>FEITO COM ❤️ E PODER SAYAJIN!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
