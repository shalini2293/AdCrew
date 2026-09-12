import { BrandProfile, ProductBrief } from '../types';

export interface PresetItem {
  id: string;
  name: string;
  badge: string;
  product: ProductBrief;
  brand: BrandProfile;
}

export const PRESET_PRODUCTS: PresetItem[] = [
  {
    id: 'aurarest',
    name: 'AuraRest Ergonomic Lumbar Support',
    badge: 'Ergonomic Wellness',
    product: {
      productName: 'AuraRest ErgoPro Lumbar Cushion',
      category: 'Ergonomics & Desk Wellness',
      description: 'A clinical-grade dynamic memory foam back support with heat-dissipating graphite mesh and dual adjustable straps engineered specifically for 8+ hour seated work.',
      coreBenefits: [
        'Dynamic spinal-alignment cradle relieves lower-back disc pressure within 15 minutes',
        'Graphite-infused cooling mesh prevents seat sweating during long desk marathons',
        'Dual anti-slip anchor straps fit any high-back executive, Herman Miller, or gaming chair',
        'Certified by ergonomic physical therapists for posture correction'
      ],
      productImage: 'https://images.unsplash.com/photo-1580481077195-c328ad4f346b?w=800&auto=format&fit=crop&q=80'
    },
    brand: {
      brandName: 'AuraRest Ergonomics',
      brandTone: 'Empathetic, Clinical & Clean Minimalist',
      targetAudience: 'Software engineers, remote knowledge workers, and creators sitting 8-12 hours daily suffering from posture slump and lower back tightness.',
      referenceImages: [
        {
          id: 'ref-1',
          title: 'Clean Minimalist Tech Interior',
          url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&auto=format&fit=crop&q=80',
          description: 'Nordic minimalist desk setup, warm diffused afternoon lighting, zero clutter, emphasizing serene focus.'
        },
        {
          id: 'ref-2',
          title: 'Ergonomic Spine Anatomy Focus',
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          description: 'High-contrast clean studio photography showing sleek posture contour lines and premium graphite textile weave.'
        },
        {
          id: 'ref-3',
          title: 'Lifestyle Relief in Action',
          url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
          description: 'Professional in a bright modern home office stretching comfortably with peaceful posture confidence.'
        }
      ]
    }
  },
  {
    id: 'veloce-nitro',
    name: 'Veloce Nitro Cold Brew',
    badge: 'Craft Beverage',
    product: {
      productName: 'Veloce Draft Nitro Cold Brew Can',
      category: 'Ready-to-Drink Specialty Coffee',
      description: 'Ultra-smooth nitrogen-infused cold brew in an obsidian matte slim can, delivering a creamy micro-foam head and 200mg clean caffeine with zero dairy and zero sugar.',
      coreBenefits: [
        'Proprietary nitrogen widget releases silky Guinness-like cascading crema on cracking open',
        'Single-origin Ethiopian Yirgacheffe slow-steeped for 24 hours at 38°F for zero bitterness',
        'Clean 200mg sustained energy with L-theanine for jitter-free razor focus',
        '100% recyclable obsidian matte sleek can designed for active commuters'
      ],
      productImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80'
    },
    brand: {
      brandName: 'Veloce Roasters',
      brandTone: 'Bold, Electric, Fast-Paced & Punchy',
      targetAudience: 'High-performing urban creatives, tech founders, and marathon runners seeking pristine craft caffeine without artificial syrup or sugar crashes.',
      referenceImages: [
        {
          id: 'ref-v1',
          title: 'High-Contrast Kinetic Studio',
          url: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&auto=format&fit=crop&q=80',
          description: 'Crisp droplet condensation on sleek matte black aluminum, deep moody contrast, sharp kinetic lighting.'
        },
        {
          id: 'ref-v2',
          title: 'Cascading Micro-Foam Pour',
          url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
          description: 'Macro glassware shot capturing creamy amber nitrogen foam cascade in mid-motion.'
        },
        {
          id: 'ref-v3',
          title: 'Urban Morning Momentum',
          url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
          description: 'Architectural cityscape background, morning sun flair, stylish professional on a brisk commute.'
        }
      ]
    }
  },
  {
    id: 'nocturne',
    name: 'Nocturne Botanical Deep Sleep Elixir',
    badge: 'Luxury Wellness',
    product: {
      productName: 'Nocturne Night Restorative Tincture',
      category: 'Holistic Sleep Supplements',
      description: 'An organic botanical blend of Montmorency tart cherry, magnesium glycinate, and ashwagandha in a cobalt apothecary dropper bottle, formulated to quiet evening mental chatter.',
      coreBenefits: [
        'Natural phytomelatonin from organic tart cherries triggers deep restorative REM cycles',
        'Chelated magnesium glycinate relaxes tense muscle fibers and physical stress points',
        'Sublingual liposomal delivery absorbs in under 12 minutes without morning grogginess',
        'Calming natural French lavender and organic vanilla bean flavor'
      ],
      productImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    },
    brand: {
      brandName: 'Nocturne Botanics',
      brandTone: 'Dreamy, Understated Luxury & Ritualistic Warmth',
      targetAudience: 'Exhausted high-achievers, insomnia sufferers, and wellness connoisseurs craving a restorative nighttime ritual and uninterrupted sleep.',
      referenceImages: [
        {
          id: 'ref-n1',
          title: 'Moody Moonlit Apothecary',
          url: 'https://images.unsplash.com/photo-1512290900672-1f0233320f6b?w=600&auto=format&fit=crop&q=80',
          description: 'Deep midnight indigo hues, brushed gold accents, soft ambient candle glow on linen sheets.'
        },
        {
          id: 'ref-n2',
          title: 'Botanical Dew & Flora',
          url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
          description: 'Ethereal wild lavender sprigs, dewy botanical stems, soft bokeh, natural organic serenity.'
        },
        {
          id: 'ref-n3',
          title: 'Bedside Night Stand Sanctuary',
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
          description: 'Warm silk eye mask, artisanal ceramic mug, warm lamp light, peaceful sleep ambiance.'
        }
      ]
    }
  }
];
