import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, X, Plus, Minus, Menu, Instagram, Mail } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';
import { products, collectionCategories } from '@/data/products';
import { StripeCheckout } from '@/components/checkout/StripeCheckout';
import { CheckoutSuccess } from '@/pages/CheckoutSuccess';
import { CheckoutCancel } from '@/pages/CheckoutCancel';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#F6F4F2]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className={`font-serif text-xl lg:text-2xl tracking-wide transition-colors ${
              isScrolled ? 'text-[#2A2A2A]' : 'text-white'
            }`}
          >
            Daniela Pemberton
          </button>

          <div className="hidden lg:flex items-center gap-10">
            <button
              onClick={() => scrollToSection('collection')}
              className={`text-caps transition-colors hover:opacity-70 ${
                isScrolled ? 'text-[#2A2A2A]' : 'text-white'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-caps transition-colors hover:opacity-70 ${
                isScrolled ? 'text-[#2A2A2A]' : 'text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-caps transition-colors hover:opacity-70 ${
                isScrolled ? 'text-[#2A2A2A]' : 'text-white'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors ${
                isScrolled ? 'text-[#2A2A2A]' : 'text-white'
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A27F] text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled ? 'text-[#2A2A2A]' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-[#F6F4F2] transition-transform duration-500 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <button
            onClick={() => scrollToSection('collection')}
            className="font-serif text-3xl text-[#2A2A2A]"
          >
            Collection
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="font-serif text-3xl text-[#2A2A2A]"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-serif text-3xl text-[#2A2A2A]"
          >
            Contact
          </button>
        </div>
      </div>
    </>
  );
}
// Cart Drawer Component
function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isStripeCheckoutOpen, setIsStripeCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F6F4F2] z-50 cart-drawer shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
            <h2 className="font-serif text-2xl">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-[#E5E5E5] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#6E6E6E]" />
                <p className="text-[#6E6E6E]">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <p className="text-[#6E6E6E] text-sm">£{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#E5E5E5] rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#E5E5E5] rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-[#E5E5E5] rounded transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-[#E5E5E5]">
              <div className="flex justify-between mb-4">
                <span className="text-[#6E6E6E]">Subtotal</span>
                <span className="font-serif text-xl">£{totalPrice}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsStripeCheckoutOpen(true);
                }}
                className="w-full btn-pill btn-pill-primary bg-[#2A2A2A] text-white hover:bg-[#D4A27F]"
              >
                Checkout
              </button>
              <p className="text-center text-xs text-[#6E6E6E] mt-4">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>

      <StripeCheckout
        isOpen={isStripeCheckoutOpen}
        onClose={() => setIsStripeCheckoutOpen(false)}
      />
    </>
  );
}
// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const peonyRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const peony = peonyRef.current;
    const text = textRef.current;
    const bg = bgRef.current;
    if (!section || !peony || !text || !bg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .fromTo(peony, { opacity: 0, scale: 0.92, y: '6vh' }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
        .fromTo(text.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.5');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set(peony, { opacity: 1, y: 0, scale: 1 });
            gsap.set(text.children, { opacity: 1, y: 0 });
            gsap.set(bg, { opacity: 1, scale: 1 });
          }
        }
      });

      scrollTl
        .fromTo(peony, { y: 0, scale: 1, opacity: 1 }, { y: '-18vh', scale: 1.12, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(bg, { scale: 1, opacity: 1 }, { scale: 1.06, opacity: 0.85, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: 'url(/hero_underwater_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <img
        ref={peonyRef}
        src="/hero_peony_bloom.png"
        alt="Pale pink peony"
        className="absolute z-[3] w-[70vw] md:w-[52vw] max-w-[700px]"
        style={{
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div
        ref={textRef}
        className="absolute z-[4] text-center text-white px-6"
        style={{
          left: '50%',
          top: '72%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 980px)'
        }}
      >
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4 drop-shadow-lg">
          Handmade jewellery
        </h1>
        <p className="font-sans text-lg md:text-xl mb-8 opacity-90">
          Inspired by peonies and the sea.
        </p>
        <button
          onClick={scrollToCollection}
          className="btn-pill btn-pill-primary"
        >
          Explore the Collection
        </button>
      </div>
    </section>
  );
}
// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const peonyRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const peony = peonyRef.current;
    const text = textRef.current;
    const bg = bgRef.current;
    if (!section || !peony || !text || !bg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .fromTo(peony, { opacity: 0, scale: 0.92, y: '6vh' }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
        .fromTo(text.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.5');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set(peony, { opacity: 1, y: 0, scale: 1 });
            gsap.set(text.children, { opacity: 1, y: 0 });
            gsap.set(bg, { opacity: 1, scale: 1 });
          }
        }
      });

      scrollTl
        .fromTo(peony, { y: 0, scale: 1, opacity: 1 }, { y: '-18vh', scale: 1.12, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(bg, { scale: 1, opacity: 1 }, { scale: 1.06, opacity: 0.85, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: 'url(/hero_underwater_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <img
        ref={peonyRef}
        src="/hero_peony_bloom.png"
        alt="Pale pink peony"
        className="absolute z-[3] w-[70vw] md:w-[52vw] max-w-[700px]"
        style={{
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div
        ref={textRef}
        className="absolute z-[4] text-center text-white px-6"
        style={{
          left: '50%',
          top: '72%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 980px)'
        }}
      >
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4 drop-shadow-lg">
          Handmade jewellery
        </h1>
        <p className="font-sans text-lg md:text-xl mb-8 opacity-90">
          Inspired by peonies and the sea.
        </p>
        <button
          onClick={scrollToCollection}
          className="btn-pill btn-pill-primary"
        >
          Explore the Collection
        </button>
      </div>
    </section>
  );
}

// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const peonyRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const peony = peonyRef.current;
    const text = textRef.current;
    const bg = bgRef.current;
    if (!section || !peony || !text || !bg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .fromTo(peony, { opacity: 0, scale: 0.92, y: '6vh' }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
        .fromTo(text.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.5');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set(peony, { opacity: 1, y: 0, scale: 1 });
            gsap.set(text.children, { opacity: 1, y: 0 });
            gsap.set(bg, { opacity: 1, scale: 1 });
          }
        }
      });

      scrollTl
        .fromTo(peony, { y: 0, scale: 1, opacity: 1 }, { y: '-18vh', scale: 1.12, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(bg, { scale: 1, opacity: 1 }, { scale: 1.06, opacity: 0.85, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: 'url(/hero_underwater_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <img
        ref={peonyRef}
        src="/hero_peony_bloom.png"
        alt="Pale pink peony"
        className="absolute z-[3] w-[70vw] md:w-[52vw] max-w-[700px]"
        style={{
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div
        ref={textRef}
        className="absolute z-[4] text-center text-white px-6"
        style={{
          left: '50%',
          top: '72%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 980px)'
        }}
      >
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4 drop-shadow-lg">
          Handmade jewellery
        </h1>
        <p className="font-sans text-lg md:text-xl mb-8 opacity-90">
          Inspired by peonies and the sea.
        </p>
        <button
          onClick={scrollToCollection}
          className="btn-pill btn-pill-primary"
        >
          Explore the Collection
        </button>
      </div>
    </section>
  );
}
// Made by Hand Section
function MadeByHandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    if (!section || !card || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      });

      scrollTl
        .fromTo(card, { x: '-55vw', opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
        .fromTo(text, { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05);

      scrollTl
        .fromTo(card, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { x: 0, opacity: 1 }, { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center"
      style={{
        backgroundImage: 'url(/hero_underwater_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        ref={cardRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] md:w-[34vw] h-[50vh] md:h-[64vh] rounded-[22px] overflow-hidden shadow-xl"
      >
        <img
          src="/jewel_hand_1.jpg"
          alt="Hand wearing gold jewellery"
          className="w-full h-full object-cover film-grade"
        />
      </div>

      <div
        ref={textRef}
        className="absolute right-[8vw] md:right-[8vw] top-[34vh] w-[80vw] md:w-[40vw] text-white"
      >
        <div className="gold-rule mb-6" />
        <p className="text-caps mb-4 opacity-80">Made by Hand</p>
        <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
          Each piece is shaped slowly, with care.
        </h2>
        <p className="font-sans text-base md:text-lg opacity-80 mb-6 leading-relaxed">
          No moulds, no mass production—just traditional techniques, quiet focus, and materials chosen to last.
        </p>
        <button className="text-caps underline underline-offset-4 hover:opacity-70 transition-opacity">
          See how they're made
        </button>
      </div>
    </section>
  );
}

// Collection Showcase Section
function CollectionShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;
    const cta = ctaRef.current;
    if (!section || !title || !cards || !cta) return;

    const cardElements = cards.children;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      });

      scrollTl
        .fromTo(title, { y: '-6vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(cardElements[0], { x: '-60vw', opacity: 0, scale: 0.97 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
        .fromTo(cardElements[1], { y: '70vh', opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, ease: 'none' }, 0.05)
        .fromTo(cardElements[2], { x: '60vw', opacity: 0, scale: 0.97 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0.1)
        .fromTo(cta, { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.15);

      scrollTl
        .fromTo(title, { y: 0, opacity: 1 }, { y: '-4vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cardElements[0], { x: 0, opacity: 1 }, { x: '-20vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cardElements[1], { y: 0, opacity: 1 }, { y: '18vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cardElements[2], { x: 0, opacity: 1 }, { x: '20vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cta, { y: 0, opacity: 1 }, { y: '6vh', opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/hero_underwater_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <h2
        ref={titleRef}
        className="font-serif text-4xl md:text-6xl text-white mb-8 md:mb-12"
      >
        The Collection
      </h2>

      <div
        ref={cardsRef}
        className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 w-full max-w-6xl items-center justify-center"
      >
        {collectionCategories.map((category) => (
          <div
            key={category.id}
            className="jewelry-card w-full md:w-[26vw] max-w-[320px] h-[45vh] md:h-[56vh] rounded-[22px] overflow-hidden shadow-xl relative group cursor-pointer"
            onClick={scrollToCollection}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover film-grade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-caps mb-2 opacity-80">{category.name}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        ref={ctaRef}
        onClick={scrollToCollection}
        className="btn-pill btn-pill-primary mt-8 md:mt-12"
      >
        Shop all jewellery
      </button>
    </section>
  );
}
// Single Peony Section
function SinglePeonySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const peonyRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const peony = peonyRef.current;
    const caption = captionRef.current;
    if (!section || !peony || !caption) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      });

      scrollTl
        .fromTo(peony, { scale: 0.86, opacity: 0, y: '10vh' }, { scale: 1, opacity: 1, y: 0, ease: 'none' }, 0)
        .fromTo(caption, { opacity: 0, y: '2vh' }, { opacity: 1, y: 0, ease: 'none' }, 0.1);

      scrollTl
        .fromTo(peony, { scale: 1, opacity: 1 }, { scale: 1.08, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(caption, { opacity: 1 }, { opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/hero_underwater_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <img
        ref={peonyRef}
        src="/single_peony.png"
        alt="Single pale pink peony"
        className="w-[60vw] md:w-[46vw] max-w-[600px] z-[3]"
      />
      <p
        ref={captionRef}
        className="text-caps text-white/80 mt-8"
      >
        Botanical Study
      </p>
    </section>
  );
}

// Inspired by the Sea Section
function InspiredBySeaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    if (!section || !card || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      });

      scrollTl
        .fromTo(card, { x: '55vw', opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
        .fromTo(text, { x: '-18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05);

      scrollTl
        .fromTo(card, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { x: 0, opacity: 1 }, { x: '-10vw', opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center"
      style={{
        backgroundImage: 'url(/hero_underwater_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        ref={textRef}
        className="absolute left-[8vw] top-[34vh] w-[80vw] md:w-[40vw] text-white"
      >
        <div className="gold-rule mb-6" />
        <p className="text-caps mb-4 opacity-80">Inspired by the Sea</p>
        <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
          Fluid lines. Quiet colour. Lasting comfort.
        </h2>
        <p className="font-sans text-base md:text-lg opacity-80 mb-6 leading-relaxed">
          I design pieces that feel like water—easy to wear, impossible to ignore.
        </p>
        <button className="text-caps underline underline-offset-4 hover:opacity-70 transition-opacity">
          Read the story
        </button>
      </div>

      <div
        ref={cardRef}
        className="absolute right-[7vw] top-[18vh] w-[40vw] md:w-[34vw] h-[50vh] md:h-[64vh] rounded-[22px] overflow-hidden shadow-xl hidden md:block"
      >
        <img
          src="/jewel_hand_2.jpg"
          alt="Hand wearing sculptural gold ring"
          className="w-full h-full object-cover film-grade"
        />
      </div>
    </section>
  );
}
// Inspired by Peonies Section
function InspiredByPeoniesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    if (!section || !card || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      });

      scrollTl
        .fromTo(card, { x: '-55vw', opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
        .fromTo(text, { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05);

      scrollTl
        .fromTo(card, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text, { x: 0, opacity: 1 }, { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center"
      style={{
        backgroundImage: 'url(/hero_underwater_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        ref={cardRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] md:w-[34vw] h-[50vh] md:h-[64vh] rounded-[22px] overflow-hidden shadow-xl hidden md:block"
      >
        <img
          src="/jewel_hand_3.jpg"
          alt="Hand wearing delicate gold bracelet"
          className="w-full h-full object-cover film-grade"
        />
      </div>

      <div
        ref={textRef}
        className="absolute right-[8vw] md:right-[8vw] top-[34vh] w-[80vw] md:w-[40vw] text-white"
      >
        <div className="gold-rule mb-6" />
        <p className="text-caps mb-4 opacity-80">Inspired by Peonies</p>
        <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
          Soft petals, strong structure.
        </h2>
        <p className="font-sans text-base md:text-lg opacity-80 mb-6 leading-relaxed">
          Peonies remind me that beauty can be both gentle and bold. I translate that balance into every piece.
        </p>
        <button className="text-caps underline underline-offset-4 hover:opacity-70 transition-opacity">
          Explore the edit
        </button>
      </div>
    </section>
  );
}

// Full Collection Grid Section
function CollectionGridSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { addToCart } = useCart();

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  const filters = ['all', 'necklaces', 'earrings', 'rings', 'bracelets'];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.product-card'),
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.25,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="bg-[#F6F4F2] py-20 md:py-32 px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl text-[#2A2A2A] mb-8">
          The Full Collection
        </h2>

        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-caps transition-all ${
                activeFilter === filter
                  ? 'bg-[#2A2A2A] text-white'
                  : 'bg-white text-[#2A2A2A] hover:bg-[#E5E5E5]'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="gold-rule mx-auto mb-6" />
          <button className="text-caps underline underline-offset-4 hover:opacity-70 transition-opacity">
            Request a custom piece
          </button>
        </div>
      </div>
    </section>
  );
}
// Product Card Component
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  return (
    <div className="product-card jewelry-card bg-white rounded-[22px] overflow-hidden shadow-lg group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover film-grade"
        />
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 left-4 right-4 btn-pill btn-pill-primary bg-[#2A2A2A] text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
      <div className="p-5">
        <p className="text-caps text-[#6E6E6E] mb-1">{product.category}</p>
        <h3 className="font-serif text-xl mb-2">{product.name}</h3>
        <p className="font-sans text-[#D4A27F] font-medium">£{product.price}</p>
      </div>
    </div>
  );
}

// About Section
function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('img'),
        { y: 30 },
        {
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.25,
          }
        }
      );

      gsap.fromTo(
        section.querySelector('.about-text'),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.25,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#F6F4F2] py-20 md:py-32 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="rounded-[22px] overflow-hidden shadow-xl">
            <img
              src="/about_maker.jpg"
              alt="Daniela Pemberton in her studio"
              className="w-full h-auto object-cover film-grade"
            />
          </div>

          <div className="about-text">
            <h2 className="font-serif text-4xl md:text-5xl text-[#2A2A2A] mb-6">
              About Daniela
            </h2>
            <p className="font-sans text-[#6E6E6E] leading-relaxed mb-6">
              I'm a jewellery maker working between the coast and the garden. My studio is small, my batches are small, and my standards are high. Every piece is finished by hand—polished, inspected, and packed with care.
            </p>

            <div className="my-8">
              <div className="gold-rule mb-4" />
              <p className="font-serif text-2xl md:text-3xl text-[#2A2A2A] italic">
                "I want my jewellery to feel like a deep breath."
              </p>
            </div>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-caps underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
// Contact Section
function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.contact-card'),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.25,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#E9F3F7] py-20 md:py-32 px-6 lg:px-12 overflow-hidden"
    >
      <img
        src="/contact_peony.png"
        alt=""
        className="absolute right-[-10vw] top-[-10vh] w-[40vw] max-w-[500px] opacity-20 pointer-events-none"
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="contact-card bg-white/80 backdrop-blur-sm rounded-[22px] p-8 md:p-12 shadow-xl">
          <h2 className="font-serif text-4xl md:text-5xl text-[#2A2A2A] mb-4 text-center">
            Let's make something beautiful.
          </h2>
          <p className="font-sans text-[#6E6E6E] text-center mb-8">
            Ask about a piece, request a custom design, or just say hello.
          </p>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#D4A27F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#D4A27F]" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Message sent!</h3>
              <p className="text-[#6E6E6E]">I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-caps text-[#6E6E6E] block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-caps text-[#6E6E6E] block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-caps text-[#6E6E6E] block mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full resize-none"
                  placeholder="Tell me what you're looking for..."
                />
              </div>
              <button
                type="submit"
                className="w-full btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F] transition-colors"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <a
              href="mailto:hello@danielasdesigns.com"
              className="text-[#6E6E6E] hover:text-[#2A2A2A] transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/danielapemberton"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6E6E6E] hover:text-[#2A2A2A] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="font-serif text-lg text-[#2A2A2A]">Daniela Pemberton</p>
          <p className="text-caps text-[#6E6E6E] mt-2">Handmade jewellery</p>
        </div>
      </div>
    </section>
  );
}
// Main Home Component
function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    ScrollTrigger.refresh();

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <Navigation />
      <CartDrawer />
      <main className="relative">
        <HeroSection />
        <MadeByHandSection />
        <CollectionShowcaseSection />
        <SinglePeonySection />
        <InspiredBySeaSection />
        <InspiredByPeoniesSection />
        <CollectionGridSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
