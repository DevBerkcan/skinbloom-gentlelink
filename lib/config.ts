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
  title: "Beauty Salon Basel",
  description: "Professionelle ästhetische Behandlungen – natürliche Schönheit & individuelle Beratung",
  address: "Elisabethenstrasse 41, 4051 Basel",
  image: "/logo.png",
};

export const socialLinks: LinkConfig[] = [
  {
    label: "Jetzt Termin vereinbaren",
    href: "/booking",
    icon: Calendar,
    variant: "primary",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skinbloom.aesthetics/",
    icon: Instagram,
    variant: "secondary",
  },
  {
    label: "Route zu uns (Google Maps)",
    href: "https://www.google.com/maps/dir/?api=1&destination=Elisabethenstrasse+41,+4051+Basel",
    icon: MapPin,
    variant: "secondary",
  },
  {
    label: "WhatsApp schreiben",
    href: "https://wa.me/41782418704",
    icon: MessageCircle,
    variant: "secondary",
  },
  {
    label: "E-Mail",
    href: "mailto:info@skinbloom-aesthetics.ch",
    icon: Mail,
    variant: "secondary",
  },
  {
    label: "Telefon",
    href: "tel:+41782418704",
    icon: Phone,
    variant: "secondary",
  },
];

export const siteConfig = {
  name: "Skinbloom Aesthetics - Link in Bio",
  description: "Professionelle ästhetische Behandlungen in Basel - Jetzt Termin vereinbaren bei Skinbloom Aesthetics",
  url: "https://skinbloom-aesthetics.ch",
};
