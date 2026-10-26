import type { EducationSection } from "../types/education";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sectionsToEditorHtml = (
  sections: readonly EducationSection[]
): string =>
  [...sections]
    .sort((a, b) => a.sectionOrder - b.sectionOrder)
    .map((section) => {
      const title = section.sectionTitle.trim()
        ? `<h2>${escapeHtml(section.sectionTitle)}</h2>`
        : "";
      const image = section.imageUrl.trim()
        ? `<img src="${escapeHtml(section.imageUrl)}" alt="${escapeHtml(section.sectionTitle || "Gambar edukasi")}" />`
        : "";
      const text = section.contentText.trim()
        ? section.sectionType === "info_penting"
          ? `<blockquote>${escapeHtml(section.contentText)}</blockquote>`
          : `<p>${escapeHtml(section.contentText).replaceAll("\n", "<br />")}</p>`
        : "";
      const steps = section.steps.length
        ? `<ol>${[...section.steps]
            .sort((a, b) => a.stepOrder - b.stepOrder)
            .map((step) => `<li>${escapeHtml(step.stepText)}</li>`)
            .join("")}</ol>`
        : "";
      return `${title}${text}${steps}${image}`;
    })
    .join("");

export const resolveEditorContent = (
  content: string,
  sections: readonly EducationSection[]
): string => content.trim() || sectionsToEditorHtml(sections);
