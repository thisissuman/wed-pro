import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from "@/components/layout/DashboardShell";
import { 
  User, 
  Sparkles,
  ArrowRight,
  Palette,
  Image,
  Music,
  Type,
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const displayEmail = user.email || 'Guest';
  const displayName = user.user_metadata?.full_name || displayEmail.split('@')[0];

  return (
    <DashboardShell>
      <main className="max-w-[900px] mx-auto px-[var(--spacing-container-margin)] pt-8 md:pt-16 pb-32 min-h-screen select-none">
        
        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-champagne-gold/10 border border-champagne-gold/25 flex items-center justify-center text-champagne-gold mx-auto">
            <User size={28} />
          </div>
          
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne-gold font-bold bg-champagne-gold/5 px-3 py-1 rounded-full border border-champagne-gold/10">
              Creator Workspace
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl text-[#FFFFF0] font-medium tracking-wide">
            Welcome, <span className="text-champagne-gold font-semibold">{displayName}</span>
          </h1>
          <p className="font-body text-sm text-[#d0c5af]/70 max-w-md mx-auto leading-relaxed">
            Your creative workspace is being prepared. Soon you&apos;ll be able to
            customize every detail of your wedding invitation right here.
          </p>
        </div>

        {/* Coming Soon Features Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-lg text-champagne-gold tracking-widest uppercase font-semibold text-center">
            Coming Soon
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Type, label: "Wedding Details", desc: "Names, dates & story" },
              { icon: Palette, label: "Theme Editor", desc: "Colors & styling" },
              { icon: Image, label: "Photo Gallery", desc: "Couple photos" },
              { icon: Music, label: "Music & Audio", desc: "Background music" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-surface-variant/10 border border-champagne-gold/10 rounded-xl p-5 text-center space-y-3 opacity-60"
              >
                <div className="w-10 h-10 rounded-lg bg-champagne-gold/5 border border-champagne-gold/15 flex items-center justify-center text-champagne-gold mx-auto">
                  <feature.icon size={20} />
                </div>
                <h3 className="font-heading text-sm text-[#FFFFF0] font-medium">{feature.label}</h3>
                <p className="font-body text-[11px] text-[#d0c5af]/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Templates CTA */}
        <div className="mt-12 text-center">
          <div className="bg-[#1a1919]/60 backdrop-blur-xl border border-champagne-gold/10 rounded-xl p-8 inline-block">
            <div className="w-12 h-12 rounded-full bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center text-champagne-gold mx-auto mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-heading text-lg text-[#FFFFF0] font-medium mb-2">
              Explore More Templates
            </h3>
            <p className="font-body text-xs text-[#d0c5af]/60 mb-5 max-w-sm mx-auto">
              Browse our curated collection of premium cinematic templates for your celebration.
            </p>
            <Link
              href="/template"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-[#3c2f00] font-heading font-semibold text-xs uppercase tracking-[0.12em] hover:shadow-[0_0_15px_rgba(242,202,80,0.25)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
            >
              Browse Templates
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </main>
    </DashboardShell>
  );
}
