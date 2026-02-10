import {
  Calendar,
  Instagram,
  Phone,
  MapPin,
  MessageCircle,
  Video,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface LinkConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  variant: "primary" | "secondary";
}

export const profileConfig = {
  name: "Skinbloom Aesthetics",
  title: "Skinbloom Aesthetics Basel",
  description: "Premium Herrenfriseur & Barbershop",
  address: "Elisabethenstrasse 41, 4051 Basel, Schweiz",
  image: "/profile.jpg", // Platziere dein Bild im public Ordner
};

export const socialLinks: LinkConfig[] = [
  {
    label: "Online buchen",
    href: "/booking",
    icon: Calendar,
    variant: "primary",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skinbloom._aesthetics/",
    icon: Instagram,
    variant: "secondary",
  },
  {
    label: "Route zu uns (Google Maps)",
    href: "https://maps.app.goo.gl/25KhxpkJsFeeNsNQ8",
    icon: MapPin,
    variant: "secondary",
  },
  {
    label: "WhatsApp schreiben",
    href: "https://wa.me/41782418704",
    icon: MessageCircle,
    variant: "secondary",
  },
];

export const siteConfig = {
  name: "Skinbloom Aesthetics - Link in Bio",
  description: "Premium Skinbloom in Basel - Online Termin buchen bei Skinbloom Aesthetics",
  url: "https://skinbloom-aesthetics.vercel.app", // Wird nach Vercel Deployment aktualisiert
};
