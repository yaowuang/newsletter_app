// Centralized initial data & helpers for the editor store.
// Keeping these outside the Zustand store improves testability & keeps store lean.

import { nanoid } from 'nanoid';

export interface SectionTemplate { title: string; content: string }

// Default templates for up to 7 sections
export const defaultSectionTemplates: SectionTemplate[] = [
  { title: 'Announcements', content: `- Welcome back to a new week!\n- Assembly on Wednesday at 10am.\n- Field trip forms due Friday.` },
  { title: 'Homework', content: `- Math: Workbook p. 52 (#1-10)\n- Reading: 20 minutes from your library book\n- Science: Finish lab sheet` },
  { title: 'Upcoming Events', content: `| Date | Event |\n| ---- | ----- |\n| Thu  | Art Showcase |\n| Fri  | School Play Rehearsal |\n| Mon  | Quiz: Fractions |` },
  { title: 'Class Highlights', content: `**This Week:**\n\n- Great teamwork during group science experiments.\n- Creative story starters shared on Tuesday.\n- Improved quiet reading focus — keep it up!` },
  { title: 'Student Shoutouts', content: `- 🎉 Alex for helping a classmate.\n- 🌟 Priya for outstanding math problem solving.\n- 💡 Jordan for a creative art project idea.` },
  { title: 'Reminders', content: `- Bring a water bottle daily.\n- Return library books by Thursday.\n- Wear sneakers for PE tomorrow.` },
  { title: 'Looking Ahead', content: `Next week we begin our **ecosystems** unit.\nStart thinking about an animal you’d like to research!` },
];

// Deterministic slug function for stable IDs (avoids hydration mismatch)
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Build initial blocks with STABLE IDs (no nanoid) so server & client match
export const buildInitialBlocks = () => {
  const seen: Record<string, number> = {};
  return defaultSectionTemplates.map((t, i) => {
    let base = slugify(t.title) || `section-${i + 1}`;
    if (seen[base]) {
      seen[base] += 1;
      base = `${base}-${seen[base]}`;
    } else {
      seen[base] = 1;
    }
    return {
      id: base as string, // stable deterministic id
      type: 'text' as const,
      title: t.title,
      content: t.content,
    };
  });
};

// Factory to create a new user-added text block (post-hydration so random id OK)
export const createUserTextBlock = (index: number) => {
  const template = defaultSectionTemplates[index];
  return {
    id: nanoid(),
    type: 'text' as const,
    title: template ? template.title : `Section ${index + 1}`,
    content: template ? template.content : '- Your content here'
  };
};
