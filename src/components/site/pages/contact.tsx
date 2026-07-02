'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, ChevronDown, Send, CheckCircle2 } from 'lucide-react';
import { type SiteSettings } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SectionReveal } from '../section-reveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/lib/language-context';

export function ContactPage({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete name, email, and message.');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Message received. Our concierge will respond within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const channels = [
    {
      icon: Phone, label: t('contact.callUs'), value: settings.phone, href: `tel:${settings.phone}`,
      desc: t('contact.callUsDesc'),
      accent: '#1e40af',
    },
    {
      icon: null, label: t('contact.whatsapp'), value: settings.whatsapp, href: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${settings.brandName}, I'd like to inquire about renting a car.`)}`,
      desc: t('contact.whatsappDesc2'),
      accent: '#25D366',
      isWhatsApp: true,
    },
    {
      icon: Mail, label: t('contact.email'), value: settings.email, href: `mailto:${settings.email}`,
      desc: t('contact.emailDesc'),
      accent: '#1e40af',
    },
    {
      icon: Instagram, label: t('contact.instagram'), value: '@phronesis.ae', href: settings.instagram,
      desc: t('contact.instagramDesc'),
      accent: '#1e40af',
    },
    {
      icon: MapPin, label: t('contact.atelier'), value: settings.address, href: '#',
      desc: t('contact.atelierDesc'),
      accent: '#1e40af',
    },
    {
      icon: Clock, label: t('contact.hours'), value: t('contact.hoursValue'), href: '#',
      desc: t('contact.hoursDesc'),
      accent: '#1e40af',
    },
  ];

  const faqs = [
    { q: t('contact.faq1q'), a: t('contact.faq1a') },
    { q: t('contact.faq2q'), a: t('contact.faq2a') },
    { q: t('contact.faq3q'), a: t('contact.faq3a') },
    { q: t('contact.faq4q'), a: t('contact.faq4a') },
    { q: t('contact.faq5q'), a: t('contact.faq5a') },
    { q: t('contact.faq6q'), a: t('contact.faq6a') },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <SectionReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-divider" />
              <span className="uppercase-luxe">{t('nav.contact')}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-6 leading-[1.05]">
              At your service,<br/><span className="text-gradient-gold italic">around the clock.</span>
            </h1>
            <p className="text-soft text-lg max-w-2xl leading-relaxed">
              Our concierge team is available 24/7 to assist with reservations, bespoke itineraries, and any special requests. Reach us by phone, WhatsApp, email, or in person at our Sheikh Zayed Road atelier.
            </p>
          </div>
        </SectionReveal>

        {/* Quick WhatsApp CTA */}
        <SectionReveal delay={0.1}>
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${settings.brandName}, I'd like to inquire about renting a car.`)}`}
            target="_blank"
            rel="noreferrer"
            className="block mb-12 group"
          >
            <div className="glass-card glass-card-hover p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 animate-float" style={{ background: '#25D366' }}>
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="uppercase-luxe mb-1" style={{ color: '#25D366' }}>{t('contact.fastestResponse')}</div>
                <div className="font-serif text-2xl text-ink mb-1">Chat on WhatsApp</div>
                <div className="text-soft text-sm">Send us a message directly and we'll respond within minutes. Available 24/7.</div>
              </div>
              <Send className="w-5 h-5 text-softer group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
          </a>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Channels */}
          <div>
            <SectionReveal>
              <div className="uppercase-luxe mb-6">{t('contact.allChannels')}</div>
              <div className="space-y-px">
                {channels.map(c => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-5 py-5 border-t border-gold/12 last:border-b hover:bg-gold/[0.04] transition-colors px-3 -mx-3"
                  >
                    <div
                      className="w-12 h-12 border flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors"
                      style={c.isWhatsApp ? { borderColor: 'rgba(37, 211, 102, 0.4)' } : { borderColor: 'rgba(30, 64, 175,0.3)' }}
                    >
                      {c.isWhatsApp ? (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      ) : (
                        c.icon && <c.icon className="w-5 h-5 text-gold group-hover:text-obsidian transition-colors" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-[0.65rem] uppercase-luxe mb-1">{c.label}</div>
                      <div className="text-ink group-hover:text-gold transition-colors">{c.value}</div>
                      <div className="text-xs text-softer mt-0.5">{c.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </SectionReveal>

            {/* Map */}
            <SectionReveal delay={0.1}>
              <div className="mt-8 aspect-video bg-charcoal border border-gold/15 overflow-hidden">
                <iframe
                  title="Phronesis Atelier Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=55.5%2C24.0%2C55.8%2C24.4&layer=mapnik&marker=24.2075%2C55.6458"
                  className="w-full h-full opacity-80 grayscale"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </SectionReveal>
          </div>

          {/* Form */}
          <SectionReveal delay={0.15}>
            <div className="glass-card p-8">
              <div className="uppercase-luxe mb-6">{t('contact.sendEnquiry')}</div>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">{t('contact.nameReq')}</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="bg-transparent border-gold/25 text-ink rounded-none"
                    />
                  </div>
                  <div>
                    <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">{t('car.phone')}</Label>
                    <Input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="bg-transparent border-gold/25 text-ink rounded-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="bg-transparent border-gold/25 text-ink rounded-none"
                  />
                </div>
                <div>
                  <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">Subject</Label>
                  <Input
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder={t('contact.subjectPlaceholder')}
                    className="bg-transparent border-gold/25 text-ink placeholder:text-ink-softer rounded-none"
                  />
                </div>
                <div>
                  <Label className="text-[0.65rem] uppercase tracking-wide-2 text-softer mb-1 block">Message *</Label>
                  <Textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="bg-transparent border-gold/25 text-ink rounded-none min-h-[140px]"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-obsidian hover:bg-gold-bright rounded-none tracking-luxe uppercase text-xs disabled:opacity-50 shine-on-hover"
                >
                  {submitting ? t('contact.sending') : t('contact.sendEnquiry')}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-softer pt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  {t('contact.responsePromise')}
                </div>
              </form>
            </div>
          </SectionReveal>
        </div>

        {/* FAQ */}
        <SectionReveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="gold-divider-center" />
                <span className="uppercase-luxe">{t('contact.faq')}</span>
                <span className="gold-divider-center" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-ink">{t('contact.faqHeading')}</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="glass-card border-none px-6">
                  <AccordionTrigger className="text-left text-ink font-serif text-lg hover:text-gold transition-colors hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-soft leading-relaxed pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
