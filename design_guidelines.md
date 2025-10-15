# Design Guidelines: Bosnian Voting Tablet Application

## Design Approach: Clarity-First Government Interface

**Selected Approach**: Accessibility-focused design system principles with government sector standards
- **Justification**: Critical civic application requiring maximum clarity, trust, and accessibility for diverse users
- **Key Principles**: Clear visual hierarchy, high contrast, large touch targets, minimal cognitive load, institutional trust

## Core Design Elements

### A. Color Palette

**Primary Colors (Light Mode)**
```
Primary Blue: 211 100% 29% (BiH blue #003893)
Secondary Yellow: 47 99% 57% (BiH yellow #FECB00)
Success Green: 142 71% 45% (#10B981)
Error Red: 0 84% 60% (#EF4444)
Warning Orange: 38 92% 50% (#F59E0B)
Background: 220 14% 96% (#F3F4F6)
Surface White: 0 0% 100%
Text Primary: 215 25% 13% (#1F2937)
Text Muted: 215 16% 47% (#6B7280)
```

**Dark Mode**: Not applicable - voting systems require consistent high-contrast light interface for clarity

### B. Typography

**Font System**
- **Primary**: Inter or System UI Stack for maximum legibility
- **Headings**: 
  - H1: 48px/56px, font-weight: 700 (Welcome titles)
  - H2: 36px/44px, font-weight: 600 (Screen headings)
  - H3: 24px/32px, font-weight: 600 (Section titles)
- **Body Text**: 
  - Large: 20px/28px, font-weight: 400 (Instructions, primary content)
  - Regular: 18px/26px, font-weight: 400 (Secondary text)
  - Small: 16px/24px, font-weight: 400 (Helper text)
- **Language**: Full Bosnian Latin script support required

### C. Layout System

**Tablet-Optimized Grid** (1024x768 fixed viewport)
- **Container**: max-w-[1024px], full-screen kiosk mode
- **Spacing Scale**: 4, 6, 8, 12, 16, 24, 32 units (Tailwind: p-4, m-6, gap-8, py-12, px-16, space-y-24, p-32)
- **Screen Padding**: px-12 py-8 (consistent across all screens)
- **Card Spacing**: p-8 for content cards, p-12 for main content areas
- **Touch Target Minimum**: 60x60px (all interactive elements)

### D. Component Library

**Core UI Elements**
- **Buttons**: 
  - Primary: Blue (#003893) with white text, h-16 px-12, rounded-lg, text-xl, font-semibold
  - Secondary: Outline blue with transparent bg (use backdrop-blur-sm when on images)
  - Destructive/Alert: Yellow (#FECB00) with dark text for call-to-help actions
  - Minimum width: 200px for primary CTAs

- **Cards**: 
  - White background with subtle shadow (shadow-lg)
  - Rounded corners: rounded-2xl
  - Border: 2px solid when showing status (blue/green/red)

- **Status Indicators**:
  - Success: Green circle with checkmark icon, 80px diameter
  - Error: Red circle with X icon, 80px diameter  
  - Warning: Yellow/orange triangle with exclamation, 80px diameter
  - Progress: Blue fill bar, h-3, rounded-full, with percentage text

- **Scanner Visualization**:
  - Border: 4px dashed blue (#003893)
  - Rounded: rounded-xl
  - Animated downward arrows above slot (text-4xl, animate-bounce staggered)
  - Slot area: min-h-[240px] to feel substantial

- **Dialog/Modal**: 
  - Max-w-2xl, centered, backdrop-blur-md background
  - Shadow: shadow-2xl
  - Padding: p-10

### E. Animations & Transitions

**Motion Strategy** (Framer Motion)
- **Page Transitions**: 
  - Slide: x: 100% → 0, duration 0.4s, ease-out
  - Fade: opacity 0 → 1, duration 0.3s
  
- **Status Animations**:
  - Success: Scale-up checkmark (0.8 → 1.1 → 1) + confetti (optional)
  - Error: Shake animation (x: [-10, 10, -10, 10, 0]) 400ms
  - Scanning: Linear progress bar fill + rotating spinner (border-t-4 animate-spin)

- **Micro-interactions**:
  - Button press: scale(0.95) on active
  - Hover feedback: subtle brightness increase (hover:brightness-105)
  - Focus rings: ring-4 ring-blue-500 ring-offset-2

**Auto-Timeout Indicators**:
- Countdown timer: Circular progress ring or text countdown
- Gentle pulse animation on auto-advancing screens

## Screen-Specific Guidelines

### Welcome Screen
- **Layout**: Centered content, flex flex-col items-center justify-center min-h-screen
- **BiH Coat of Arms + CIK Logo**: Flex row at top, gap-16, each max-w-[120px] h-auto
- **Heading**: text-5xl font-bold text-blue-900 mb-4
- **Location Info**: text-2xl text-gray-600 space-y-2
- **Primary CTA**: Large blue button, pulse animation to draw attention

### Instruction Screen  
- **Layout**: Numbered steps in vertical flow, space-y-8
- **Step Numbers**: Circle badges (w-12 h-12) with blue background, white text-2xl
- **Visual Diagrams**: Placeholder images or simple SVG illustrations, max-w-[300px]
- **Warning Box**: Yellow/orange border-l-4, bg-yellow-50, p-6, flex with icon

### Scanner Ready Screen
- **Scanner Slot**: Center of screen, border-4 border-dashed, p-12
- **Animated Arrows**: Staggered bounce animation, text-blue-600
- **Cancel Button**: Bottom-right, text-red-600, variant="ghost"

### Scanning Progress Screen
- **Spinner**: w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin
- **Progress Bar**: w-full max-w-md h-3 bg-gray-200 relative with fill bar
- **Checklist Items**: Space-y-3, flex items with green checkmarks or loading spinners

### Result Screens
- **Success**: Green theme overlay, large checkmark, ballot info in grid (grid-cols-2 gap-4)
- **Error**: Red theme overlay, clear error reason in Alert component, action buttons in flex gap-4
- **Auto-close Countdown**: Bottom center, text-sm text-gray-500

### Admin Panel (Hidden)
- **Activation**: Triple-tap detector on top-right (w-20 h-20 absolute)
- **PIN Entry**: Large number pad, 3x4 grid, gap-3, each button h-16 w-16
- **Stats Display**: Grid layout with metric cards (grid-cols-3 gap-6)

## Accessibility & Kiosk Requirements

- **Contrast Ratios**: All text minimum 7:1 (AAA standard for government)
- **Touch Targets**: Minimum 60x60px, recommended 80x80px for primary actions
- **Focus Indicators**: 4px solid blue outline, offset 2px, highly visible
- **Disabled States**: opacity-40, cursor-not-allowed
- **Kiosk Mode**: 
  - user-select-none on all text
  - Disable context menu (onContextMenu preventDefault)
  - Full-screen: w-screen h-screen overflow-hidden

## Images

**BiH Coat of Arms**: 120x120px SVG or PNG, placed top-center of Welcome screen alongside CIK logo
**CIK Logo**: 120x80px, maintains official proportions
**Instruction Diagrams**: 3 simple illustrations (300x200px) showing ballot marking, folding, and insertion - use placeholder SVG icons from Heroicons or simple custom SVGs
**No hero images** - this is a functional interface focused on clarity over aesthetics