import React from "react";
import {
  ShoppingBag,
  Car,
  FileText,
  Utensils,
  HandHeart,
  Shirt,
  Heart,
  Activity,
  CreditCard,
  Briefcase,
  Gift,
  PiggyBank,
  Coins,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const CATEGORIES = {
  expense: [
    "סופר וקניות",
    "דלק ורכב",
    "חשבונות/הוצאות דירה",
    "אוכל בחוץ",
    "ביגוד",
    "טיפוח והגיינה",
    "תחביבים",
    "בריאות",
    "תרומות",
    "החזר הלוואה",
    "מתנה",
    "הוצאות שונות",
  ],

  income: [
    "משכורת",
    "מתנה",
    "החזר",
    "הכנסות שונות",
  ],

  savings: [
    "פיקדון",
    "השקעות",
    "חסכונות שונים"
  ],
};

export const getCategoryIcon = (category, size = 18) => {
  switch (category) {
    case "סופר וקניות":
      return <ShoppingBag size={size} />;

    case "דלק ורכב":
      return <Car size={size} />;

    case "חשבונות/הוצאות דירה":
      return <FileText size={size} />;

    case "אוכל בחוץ":
      return <Utensils size={size} />;

    case "תרומות":
      return <HandHeart size={size} />;

    case "ביגוד":
      return <Shirt size={size} />;

    case "טיפוח והגיינה":
      return <Sparkles size={size} />;

    case "תחביבים":
      return <Heart size={size} />;

    case "בריאות":
      return <Activity size={size} />;

    case "החזר הלוואה":
      return <CreditCard size={size} />;

    case "משכורת":
      return <Briefcase size={size} />;

    case "מתנה":
      return <Gift size={size} />;

    case "החזר":
      return <Coins size={size} />;

    case "חסכונות שונים":
      return <PiggyBank size={size} />;

    case "השקעות":
      return <Coins size={size} />;

    case "הוצאות שונות":
      return <HelpCircle size={size} />;

    case "הכנסות שונות":
      return <HelpCircle size={size} />;

    default:
      return <HelpCircle size={size} />;
  }
};