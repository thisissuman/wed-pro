# Invitation Opener: Developer Reference & Theme Recipes

The `InvitationOpener` is a premium, reusable entrance animation wrapper for digital wedding invitations. It handles SSR checks, browser session caching (runs only once per session), audio autoplay unlocks, and animations locked by a dynamic center-splitting seal.

---

## Component API Reference

**Import Path:** `import { InvitationOpener } from "@/components/invitation-opener";`

### Props List

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | *Required* | The template content to reveal (Hero, Couple info, countdown, etc.). |
| `variant` | `OpenerVariant` | `"royal-door"` | The visual door/gate opening mechanism (see below). |
| `sealType` | `"wax-seal" \| "gold-coin" \| "none"` | `"wax-seal"` | Central lock element. Splits down the middle on center-parting styles. |
| `monogram` | `string` | `"❦"` | The letter(s) or symbol stamped inside the central wax seal or gold coin. |
| `primaryColor` | `string` | `"#D4AF37"` | Highlight tone for gold border outlines, vectors, and detailing. |
| `secondaryColor`| `string` | `"#6B1F1F"` | Base surface color. Generates a luxurious radial dark gradient behind. |
| `slug` | `string` | `"default"` | Caching identifier. Keeps the gate open upon refresh in a session. |
| `isPreviewMode` | `boolean` | `false` | If `true`, bypasses session caching to keep the opener visible (for editors). |

### Available Opening Styles (`variant`)

1.  `royal-door`: 3D wooden double doors swinging open.
2.  `palace-gate`: Intricate iron/brass gate scroll designs with heavy spring hinges.
3.  `curtain-reveal`: Luxurious velvet drapery sliding apart and folding.
4.  `mandap-opening`: Hanging yellow/orange marigold garlands and fabric lifting upwards.
5.  `invitation-flap`: Realistic envelope where the wax-sealed triangular flap folds up, then card pulls.
6.  `floral-reveal`: Concentric rings of vector marigold flowers scaling and bursting.
7.  `namaste-opening`: Two elegant vector hands in prayer sliding apart horizontally.
8.  `luxury-minimal`: Sideways sliding modern pages with fine gold inset rules.

---

## How to Integrate in a New Template

To add an opener to a new template (e.g., `src/templates/modern/ModernTemplate.tsx`):

1.  **Wrap the Content**: Wrap the interior sections in the `<InvitationOpener>` wrapper. Keep the `<MusicPlayer>` *outside* the wrapper so it captures click bubbles and plays unmuted sound.
2.  **Pass Config Props**: Provide the theme colors and slug variables.

```tsx
import { InvitationOpener } from "@/components/invitation-opener";
import { ThemeProvider } from "../shared/theme/ThemeProvider";

export function CustomTemplate({ data, isPreview }) {
  const primary = data.theme?.primaryColor || "#D4AF37";
  const secondary = data.theme?.secondaryColor || "#58111A";

  return (
    <ThemeProvider theme={data.theme}>
      <InvitationOpener
        variant="royal-door"
        primaryColor={primary}
        secondaryColor={secondary}
        slug={data.slug}
        sealType="wax-seal"
        monogram={data.couple ? data.couple.bride.name[0] : "❦"}
        isPreviewMode={isPreview}
      >
        {/* Everything inside will render under the opener */}
        <HeroSection data={data} />
        <CoupleSection data={data} />
      </InvitationOpener>

      {/* Music player sits outside to capture the first tap gesture */}
      <MusicPlayer music={data.music} embedded={isPreview} />
    </ThemeProvider>
  );
}
```

---

## Visual Theme Recipes (Short Prompts)

Copy and paste these props into your template based on the design request:

### 1. Royal Crimson & Gold Entrance
> **Short Prompt:** *Crimson & Gold Royal Entrance with monogram letter 'A'*
```tsx
variant="royal-door"
sealType="wax-seal"
monogram="A"
primaryColor="#D4AF37"
secondaryColor="#58111A"
```

### 2. Palace Navy & Rose Medallion
> **Short Prompt:** *Navy Blue Gates locked by a Rose Gold medallion initialed 'M'*
```tsx
variant="palace-gate"
sealType="gold-coin"
monogram="M"
primaryColor="#F3C68F"
secondaryColor="#0F1A30"
```

### 3. Saffron Temple Mandap
> **Short Prompt:** *Temple-inspired Saffron & Terracotta arch with marigold garlands*
```tsx
variant="mandap-opening"
sealType="gold-coin"
monogram="❦"
primaryColor="#FFE088"
secondaryColor="#91381E"
```

### 4. Blush Pink Envelope Unfold
> **Short Prompt:** *A soft Blush Pink and Rose Gold envelope flap with a wax seal 'S'*
```tsx
variant="invitation-flap"
sealType="wax-seal"
monogram="S"
primaryColor="#B76E79"
secondaryColor="#2A1015"
```

### 5. Luxury Charcoal Editorial
> **Short Prompt:** *Sleek Charcoal Black minimal parting panels with a gold coin 'K'*
```tsx
variant="luxury-minimal"
sealType="gold-coin"
monogram="K"
primaryColor="#E9C349"
secondaryColor="#131313"
```

### 6. Emerald Fort Garland Entrance
> **Short Prompt:** *Emerald Green Palace gate locked by a gold seal initialed 'V'*
```tsx
variant="palace-gate"
sealType="wax-seal"
monogram="V"
primaryColor="#D4AF37"
secondaryColor="#0B2E24"
```

### 7. Traditional Namaste Welcome
> **Short Prompt:** *Deep Ruby Red entrance with folding Namaste hands greeting*
```tsx
variant="namaste-opening"
sealType="none"
primaryColor="#D4AF37"
secondaryColor="#3C0913"
```
