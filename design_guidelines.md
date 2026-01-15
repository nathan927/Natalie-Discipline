# Natalie - Self-Discipline App Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from:
- **Duolingo** (gamification and reward systems)
- **Forest App** (motivation through visual rewards)
- **Pinterest/Instagram** (feminine, visually-rich aesthetic)
- **Headspace** (friendly, calming interface for habit building)

**Core Principle**: Create a magical, encouraging environment that makes discipline feel like play through abundant visual rewards and gentle guidance.

## Visual Personality

**Soft, Dreamy, and Encouraging**
- Rounded corners throughout (border-radius: 16-24px for cards, 12-16px for buttons)
- Generous use of cute illustrations and sticker imagery
- Gentle shadows for depth (subtle, not harsh)
- Playful yet organized - fun without chaos

## Typography

**Font Selection**: Use rounded, friendly sans-serif fonts
- Primary: Nunito or Quicksand (Google Fonts)
- Display/Headers: 24-32px, semi-bold
- Body Text: 16-18px, regular weight
- Labels/Captions: 12-14px, medium weight
- All text should feel approachable and easy to read for children

## Layout & Spacing System

**Tailwind Units**: Use 4, 6, 8, 12, 16 as core spacing primitives
- Screen padding: p-4 or p-6
- Card spacing: p-6 or p-8
- Button padding: px-8 py-4
- Element gaps: gap-4 or gap-6

**Screen Structure**:
- Safe area aware for iOS notch/Android status bar
- Bottom navigation: 70-80px height with icons + labels
- Content area: Scrollable with generous bottom padding (pb-24 for nav clearance)

## Component Library

### Navigation
**Bottom Tab Bar** (5 tabs):
- Home/Today
- Schedule/Calendar
- Timer
- Rewards/Stickers
- Profile/Settings

Icons with labels, highlight active tab with gentle scale effect

### Home Screen
**Daily Dashboard Layout**:
- Greeting header with avatar/profile image (circular, 60-80px)
- Progress summary card with completion percentage
- "Today's Tasks" list (3-5 visible items)
- Motivational message/streak counter
- Quick action floating button for adding tasks

### Task Cards
**Generous, Tactile Design**:
- Large touch targets (minimum 60px height)
- Left: Checkbox (animated when checked with confetti micro-interaction)
- Center: Task name and time
- Right: Sticker preview (reward for completion)
- Swipe actions for edit/delete

### Schedule/Calendar View
**Visual Calendar**:
- Week view as default (easier for kids than month)
- Large date cells with dot indicators for scheduled tasks
- Task list below selected date
- Add button prominently placed

### Timer Screen
**Centered, Focused Layout**:
- Large circular timer display (occupies 40% of screen)
- Simple preset buttons below (15min, 30min, 60min)
- Character illustration that "cheers" during timer
- Pause/Stop buttons with clear icons

### Rewards/Stickers Collection
**Gallery Grid Layout**:
- 3-column grid of sticker cards
- Locked stickers shown as silhouettes/grayed out
- Unlocked stickers vibrant and tappable
- Progress bar showing "X more tasks to unlock next sticker"
- Category tabs at top (Animals, Flowers, Stars, Hearts, etc.)

### Task Creation Modal
**Bottom Sheet Style** (slides up from bottom):
- Task name input (large, friendly)
- Time picker (visual, not native picker)
- Repeat options with icon toggles
- Sticker reward preview
- Large "Create Task" button

### Celebration Modals
**Full-Screen Success Moments**:
- Appears when task completed
- Large sticker reveal with bounce animation
- Encouraging message ("Great job!", "You did it!")
- Sticker earned displayed prominently
- Dismiss button after 2 seconds or tap

## Images & Illustrations

**Character Mascot**: Include a friendly female character mascot (anime/kawaii style) that appears throughout:
- Home screen greeting
- Empty states
- Timer companion
- Celebration screens

**Sticker Library**: Organize into themed collections:
- Magical Girls (different poses, outfits)
- Cute Animals (cats, bunnies, bears)
- Nature (flowers, stars, rainbows)
- Seasonal themes
- Achievement badges

**Empty States**: Friendly illustrations for:
- No tasks scheduled ("Ready to plan your day?")
- Timer not started ("Time to focus!")
- All tasks complete ("Amazing work today!")

## Interactions & Micro-animations

**Reward-Focused Animations**:
- Task completion: Confetti burst + sticker float-in
- Timer completion: Character celebration dance
- Streak milestone: Sparkle effect
- Sticker unlock: Reveal with shimmer

**Navigation**: Smooth tab transitions with gentle scale
**Buttons**: Subtle scale on press (0.95x), no harsh effects
**Cards**: Very subtle lift on press

## Accessibility & Child-Friendly Features

- Extra large touch targets (minimum 60x60px)
- High contrast between text and backgrounds
- Simple, clear icons with labels
- Progress indicators always visible
- Encouraging copy, never punitive
- Parent settings section (passcode protected) for managing notifications

## Screen Specifications

**iOS/Android Responsive**:
- Design for 375x812 (iPhone) as base
- Scale appropriately for tablets
- Use platform-specific navigation patterns where appropriate
- Handle safe areas properly

**Status Bar**: Translucent overlay with proper padding

This creates a warm, encouraging environment where completing tasks feels rewarding and fun, perfect for building positive habits in children.