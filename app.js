(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const profile = data.profile || {};

  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------------------
   * Safe Helpers
   * ---------------------------------------------------------------------- */
  function sanitizeUrl(url, allowMailto = true) {
    if (typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";

    // Protocol-relative URLs should never bypass protocol validation.
    if (trimmed.startsWith("//") || trimmed.startsWith("\\")) return "";

    if (
      trimmed.startsWith("/") ||
      trimmed.startsWith("./") ||
      trimmed.startsWith("../") ||
      trimmed.startsWith("#") ||
      (!trimmed.includes(":") && !trimmed.startsWith("//"))
    ) {
      return trimmed;
    }

    try {
      const parsed = new URL(trimmed);
      const allowed = allowMailto
        ? ["http:", "https:", "mailto:", "tel:"]
        : ["http:", "https:"];
      return allowed.includes(parsed.protocol) ? parsed.href : "";
    } catch {
      return "";
    }
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function createSvgIcon(kind, size = 16) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const paths = {
      email: [
        { tag: "rect", attrs: { x: "2", y: "4", width: "20", height: "16", rx: "2" } },
        { tag: "path", attrs: { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" } }
      ],
      call: [
        { tag: "path", attrs: { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" } }
      ],
      whatsapp: [
        {
          tag: "path",
          attrs: {
            d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          }
        }
      ],
      code: [
        { tag: "polyline", attrs: { points: "16 18 22 12 16 6" } },
        { tag: "polyline", attrs: { points: "8 6 2 12 8 18" } }
      ],
      github: [
        {
          tag: "path",
          attrs: {
            d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          }
        },
        { tag: "path", attrs: { d: "M9 18c-4.51 2-5-2-7-2" } }
      ],
      layout: [
        { tag: "rect", attrs: { x: "3", y: "3", width: "18", height: "18", rx: "2" } },
        { tag: "line", attrs: { x1: "3", y1: "9", x2: "21", y2: "9" } },
        { tag: "line", attrs: { x1: "9", y1: "21", x2: "9", y2: "9" } }
      ],
      database: [
        { tag: "ellipse", attrs: { cx: "12", cy: "5", rx: "9", ry: "3" } },
        { tag: "path", attrs: { d: "M3 5v14a9 3 0 0 0 18 0V5" } },
        { tag: "path", attrs: { d: "M3 12a9 3 0 0 0 18 0" } }
      ],
      gitBranch: [
        { tag: "line", attrs: { x1: "6", y1: "3", x2: "6", y2: "15" } },
        { tag: "circle", attrs: { cx: "18", cy: "6", r: "3" } },
        { tag: "circle", attrs: { cx: "6", cy: "18", r: "3" } },
        { tag: "path", attrs: { d: "M18 9a9 9 0 0 1-9 9" } }
      ],
      graduationCap: [
        { tag: "path", attrs: { d: "M22 10v6M2 10l10-5 10 5-10 5z" } },
        { tag: "path", attrs: { d: "M6 12v5c3 3 9 3 12 0v-5" } }
      ],
      award: [
        { tag: "circle", attrs: { cx: "12", cy: "8", r: "6" } },
        { tag: "path", attrs: { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" } }
      ],
      linkedin: [
        { tag: "path", attrs: { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" } },
        { tag: "rect", attrs: { x: "2", y: "9", width: "4", height: "12" } },
        { tag: "circle", attrs: { cx: "4", cy: "4", r: "2" } }
      ],
      external: [
        { tag: "path", attrs: { d: "M7 17L17 7" } },
        { tag: "path", attrs: { d: "M7 7h10v10" } }
      ],
      chevronLeft: [{ tag: "polyline", attrs: { points: "15 18 9 12 15 6" } }],
      chevronRight: [{ tag: "polyline", attrs: { points: "9 18 15 12 9 6" } }],
      expand: [
        { tag: "polyline", attrs: { points: "15 3 21 3 21 9" } },
        { tag: "polyline", attrs: { points: "9 21 3 21 3 15" } },
        { tag: "line", attrs: { x1: "21", y1: "3", x2: "14", y2: "10" } },
        { tag: "line", attrs: { x1: "3", y1: "21", x2: "10", y2: "14" } }
      ],
      phone: [
        { tag: "rect", attrs: { x: "6", y: "2", width: "12", height: "20", rx: "2.5" } },
        { tag: "line", attrs: { x1: "12", y1: "18", x2: "12.01", y2: "18" } }
      ],
      monitor: [
        { tag: "rect", attrs: { x: "2", y: "3", width: "20", height: "14", rx: "2" } },
        { tag: "line", attrs: { x1: "8", y1: "21", x2: "16", y2: "21" } },
        { tag: "line", attrs: { x1: "12", y1: "17", x2: "12", y2: "21" } }
      ],
      arrowRight: [
        { tag: "path", attrs: { d: "M5 12h14" } },
        { tag: "path", attrs: { d: "m12 5 7 7-7 7" } }
      ],
      globe: [
        { tag: "circle", attrs: { cx: "12", cy: "12", r: "10" } },
        { tag: "line", attrs: { x1: "2", y1: "12", x2: "22", y2: "12" } },
        { tag: "path", attrs: { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" } }
      ],
      store: [{ tag: "polygon", attrs: { points: "5 3 19 12 5 21 5 3" } }]
    };

    const shapes = paths[kind] || paths.external;
    shapes.forEach((shape) => {
      const node = document.createElementNS(SVG_NS, shape.tag);
      Object.entries(shape.attrs).forEach(([k, v]) => node.setAttribute(k, v));
      svg.appendChild(node);
    });
    return svg;
  }

  /* ------------------------------------------------------------------------
   * Profile Hydration (Only Actual Provided Contact Channels)
   * ---------------------------------------------------------------------- */
  function setFields(key, value) {
    if (typeof value !== "string" || !value.trim()) return;
    document.querySelectorAll(`[data-field="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  function setMetaContent(selector, content) {
    if (typeof document.querySelector !== "function" || !content) return;
    const el = document.querySelector(selector);
    if (el && typeof el.setAttribute === "function") {
      el.setAttribute("content", content);
    }
  }

  function hydrateProfile() {
    const fullName = (profile.name || "Ahmed Gamal Saeed").trim();
    const role = (profile.role || "Software Engineer").trim();
    const tagline = (
      profile.tagline ||
      "I build mobile applications with Flutter and develop modern web experiences."
    ).trim();
    const specialty = (
      profile.specialty || "Flutter Mobile Applications & Web Development"
    ).trim();
    const fullTitle = `${fullName} — ${role}`;
    document.title = fullTitle;

    const seoSummary = `${role} specializing in ${specialty}. ${tagline}`;
    setMetaContent('meta[name="description"]', `Portfolio of ${fullName} — ${seoSummary}`);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', seoSummary);
    setMetaContent('meta[name="twitter:title"]', fullTitle);
    setMetaContent('meta[name="twitter:description"]', seoSummary);

    setFields("name", fullName);
    setFields("shortName", profile.shortName || fullName);
    setFields("role", role);
    setFields("tagline", tagline);
    setFields("specialty", specialty);

    const contactCfg = profile.contact || {};
    setFields("contactEyebrow", contactCfg.eyebrow);
    setFields("contactHeading", contactCfg.heading);
    setFields("contactDescription", contactCfg.description);
    setFields("mobileContactHeading", contactCfg.mobileHeading);
    setFields("mobileContactDescription", contactCfg.mobileDescription);

    const footerCfg = profile.footer || {};
    setFields("footerSubtitle", footerCfg.subtitle || role);
    setFields("footerFieldNote", footerCfg.fieldNote || "Software Engineering");
    setFields("copyright", footerCfg.copyright);

    const heroNameEl = document.getElementById("hero-name");
    if (heroNameEl) {
      heroNameEl.textContent = "";
      const parts = fullName.split(/\s+/);
      if (parts.length >= 3) {
        const last = parts.pop();
        heroNameEl.appendChild(document.createTextNode(parts.join(" ")));
        heroNameEl.appendChild(createEl("br", "desktop-break"));
        heroNameEl.appendChild(document.createTextNode(" " + last));
      } else {
        heroNameEl.textContent = fullName;
      }
    }

    const photoEl = document.getElementById("hero-photo");
    const safePhoto = sanitizeUrl(profile.photo || "", false);
    if (photoEl) {
      photoEl.addEventListener("error", () => {
        photoEl.hidden = true;
      });
      if (safePhoto) {
        photoEl.hidden = false;
        if (photoEl.getAttribute("src") !== safePhoto) {
          photoEl.src = safePhoto;
        }
        photoEl.alt = `Portrait of ${fullName}, ${role}`;
      }
    }

    const phoneUtils = {
      formatDisplay: (raw) => {
        const clean = String(raw || "").trim();
        if (!clean) return "";
        const compact = clean.replace(/[\s()-]/g, "");
        const egMatch = compact.match(/^\+20(\d{3})(\d{3})(\d{4})$/);
        if (egMatch) {
          return `+20 ${egMatch[1]} ${egMatch[2]} ${egMatch[3]}`;
        }
        return clean;
      },
      toTelHref: (raw) => {
        const clean = String(raw || "").trim().replace(/[^\d+]/g, "");
        return clean ? `tel:${clean}` : "";
      },
      toWhatsappHref: (raw) => {
        const val = String(raw || "").trim();
        if (!val) return "";
        if (/^https?:\/\//i.test(val)) {
          return sanitizeUrl(val, false);
        }
        const digits = val.replace(/\D/g, "");
        return digits ? `https://wa.me/${digits}` : "";
      }
    };

    // Collect ONLY actually provided channels
    const channels = [];
    const safeEmail = typeof profile.email === "string" ? profile.email.trim() : "";
    if (safeEmail) {
      channels.push({
        kind: "email",
        title: "Email",
        label: safeEmail,
        shortLabel: "Email",
        ariaLabel: `Send email to ${safeEmail}`,
        href: `mailto:${safeEmail}`,
        icon: "email",
        external: false
      });
    }

    const safePhone = typeof profile.phone === "string" ? profile.phone.trim() : "";
    const formattedPhone = phoneUtils.formatDisplay(safePhone);
    const telHref = phoneUtils.toTelHref(safePhone);
    if (safePhone && telHref) {
      channels.push({
        kind: "phone",
        title: "Phone",
        label: formattedPhone,
        shortLabel: "Phone",
        ariaLabel: `Call ${formattedPhone}`,
        href: telHref,
        icon: "call",
        external: false
      });
    }

    const socialLinks = profile.links || {};
    const explicitWhatsapp =
      typeof profile.whatsapp === "string" && profile.whatsapp.trim()
        ? profile.whatsapp.trim()
        : typeof socialLinks.whatsapp === "string" && socialLinks.whatsapp.trim()
        ? socialLinks.whatsapp.trim()
        : profile.whatsappSameAsPhone !== false &&
          profile.whatsapp !== false &&
          safePhone
        ? safePhone
        : "";
    const whatsappHref = phoneUtils.toWhatsappHref(explicitWhatsapp);
    if (whatsappHref) {
      channels.push({
        kind: "whatsapp",
        title: "WhatsApp",
        label: "Chat on WhatsApp",
        shortLabel: "WhatsApp",
        ariaLabel: `Chat on WhatsApp${formattedPhone ? ` (${formattedPhone})` : ""}`,
        href: whatsappHref,
        icon: "whatsapp",
        external: true
      });
    }

    const linkLabels = {
      github: {
        label: "GitHub",
        icon: "github",
        formatValue: (href) => {
          try {
            const u = new URL(href);
            return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`;
          } catch {
            return "GitHub";
          }
        }
      },
      linkedin: {
        label: "LinkedIn",
        icon: "linkedin",
        formatValue: () => "Connect on LinkedIn"
      },
      x: { label: "X", icon: "external" },
      website: { label: "Website", icon: "globe" }
    };

    Object.entries(socialLinks).forEach(([key, rawHref]) => {
      if (key === "whatsapp") return;
      const safeHref = sanitizeUrl(rawHref, false);
      if (!safeHref) return;
      const meta = linkLabels[key] || {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: "external"
      };
      const displayValue =
        typeof meta.formatValue === "function" ? meta.formatValue(safeHref) : meta.label;
      channels.push({
        kind: key,
        title: meta.label,
        label: displayValue,
        shortLabel: meta.label,
        ariaLabel: `${meta.label}: ${displayValue}`,
        href: safeHref,
        icon: meta.icon,
        external: true
      });
    });

    const hasContact = channels.length > 0;
    const contactSection = document.getElementById("contact");
    if (contactSection) contactSection.hidden = !hasContact;
    document.querySelectorAll("[data-contact-link]").forEach((link) => {
      link.hidden = !hasContact;
    });

    const heroWorkBtn = document.getElementById("hero-work-btn");
    if (heroWorkBtn) {
      heroWorkBtn.className = hasContact ? "btn-hero-ghost" : "btn-hero-primary";
    }

    const channelsNote = document.getElementById("channels-pane-note");
    if (channelsNote) {
      channelsNote.textContent = "Choose a direct channel below to get in touch.";
    }

    const contactCard = document.getElementById("contact-card");
    const channelsBox = document.getElementById("direct-channels");
    const channelsList = document.getElementById("direct-channels-list");
    if (channelsBox && channelsList) {
      channelsList.textContent = "";
      if (channels.length > 0) {
        channelsBox.hidden = false;
        if (contactCard) contactCard.classList.add("has-channels");
        channels.forEach((ch) => {
          const a = createEl("a", "channel-btn");
          a.href = ch.href;
          a.setAttribute("aria-label", ch.ariaLabel || ch.label);
          if (ch.external) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }

          const leftWrap = createEl("span", "channel-btn-left");
          const iconBox = createEl("span", "channel-btn-icon");
          iconBox.appendChild(createSvgIcon(ch.icon, 18));
          leftWrap.appendChild(iconBox);

          const copyWrap = createEl("span", "channel-btn-copy");
          if (ch.title && ch.title !== ch.label) {
            copyWrap.appendChild(createEl("span", "channel-btn-title", ch.title));
          }
          copyWrap.appendChild(createEl("span", "channel-btn-label", ch.label));
          leftWrap.appendChild(copyWrap);
          a.appendChild(leftWrap);

          const arrowWrap = createEl("span", "channel-btn-arrow");
          arrowWrap.appendChild(
            createSvgIcon(ch.external ? "external" : "arrowRight", 15)
          );
          a.appendChild(arrowWrap);

          channelsList.appendChild(a);
        });
      } else {
        channelsBox.hidden = true;
        if (contactCard) contactCard.classList.remove("has-channels");
      }
    }

    const footerContactEl = document.getElementById("footer-contact-inline");
    if (footerContactEl) {
      footerContactEl.textContent = "";
      const inlineItems = [];
      if (safeEmail) {
        inlineItems.push({ text: safeEmail, href: `mailto:${safeEmail}` });
      }
      if (safePhone && telHref) {
        inlineItems.push({ text: formattedPhone, href: telHref });
      }
      if (inlineItems.length > 0) {
        footerContactEl.hidden = false;
        inlineItems.forEach((item, idx) => {
          if (idx > 0) {
            const sep = createEl("span", "footer-contact-sep", "·");
            sep.setAttribute("aria-hidden", "true");
            footerContactEl.appendChild(sep);
          }
          const a = createEl("a", "footer-contact-item", item.text);
          a.href = item.href;
          footerContactEl.appendChild(a);
        });
      } else {
        footerContactEl.hidden = true;
      }
    }

    const footerLinksEl = document.getElementById("footer-links");
    if (footerLinksEl) {
      footerLinksEl.textContent = "";

      const overviewFooterLink = createEl("a", "footer-link", "Overview");
      overviewFooterLink.href = "#top";
      footerLinksEl.appendChild(overviewFooterLink);

      if (profile.about && Array.isArray(profile.about.paragraphs) && profile.about.paragraphs.length > 0) {
        const aboutFooterLink = createEl("a", "footer-link", "About");
        aboutFooterLink.href = "#about";
        footerLinksEl.appendChild(aboutFooterLink);
      }

      const rawProjects = Array.isArray(data.projects) ? data.projects : [];
      if (rawProjects.some((p) => p && p.featured)) {
        const featuredFooterLink = createEl("a", "footer-link", "Featured");
        featuredFooterLink.href = "#featured";
        featuredFooterLink.setAttribute("data-featured-link", "");
        footerLinksEl.appendChild(featuredFooterLink);
      }

      if (profile.skills && Array.isArray(profile.skills.groups) && profile.skills.groups.length > 0) {
        const skillsFooterLink = createEl("a", "footer-link", "Skills");
        skillsFooterLink.href = "#skills";
        footerLinksEl.appendChild(skillsFooterLink);
      }

      const workFooterLink = createEl("a", "footer-link", "My Work");
      workFooterLink.href = "#work";
      workFooterLink.setAttribute("data-work-link", "");
      footerLinksEl.appendChild(workFooterLink);

      if (hasContact) {
        const contactFooter = createEl("a", "footer-link", "Contact");
        contactFooter.href = "#contact";
        footerLinksEl.appendChild(contactFooter);
      }

      channels
        .filter((ch) => ch.kind !== "email" && ch.kind !== "phone" && ch.kind !== "whatsapp")
        .forEach((ch) => {
          const a = createEl("a", "footer-link footer-link--icon", ch.shortLabel);
          a.href = ch.href;
          a.setAttribute("aria-label", ch.ariaLabel || ch.shortLabel);
          if (ch.kind === "github" || ch.kind === "linkedin") {
            a.textContent = "";
            a.appendChild(createSvgIcon(ch.icon, 15));
            a.appendChild(createEl("span", "", ch.shortLabel));
          }
          if (ch.external) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          footerLinksEl.appendChild(a);
        });
    }
  }

  /* ------------------------------------------------------------------------
   * Editorial Profile Sections (About, Skills, What I Build, Education & Certs)
   * ---------------------------------------------------------------------- */
  function renderAboutSection() {
    const section = document.getElementById("about");
    const aboutCfg = profile.about;
    const paragraphs =
      aboutCfg && Array.isArray(aboutCfg.paragraphs)
        ? aboutCfg.paragraphs.map((p) => String(p || "").trim()).filter(Boolean)
        : [];

    if (!section || !aboutCfg || paragraphs.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    section.hidden = false;
    const eyebrowEl = document.getElementById("about-eyebrow");
    const headingEl = document.getElementById("about-heading");
    const factsEl = document.getElementById("about-facts");
    const bodyEl = document.getElementById("about-body");

    if (eyebrowEl && aboutCfg.eyebrow) eyebrowEl.textContent = aboutCfg.eyebrow;
    if (headingEl && aboutCfg.heading) headingEl.textContent = aboutCfg.heading;

    if (factsEl) {
      factsEl.textContent = "";
      const facts = Array.isArray(aboutCfg.facts) ? aboutCfg.facts : [];
      facts.forEach((fact) => {
        if (!fact || !fact.label || !fact.value) return;
        const item = createEl("div", "about-fact-item");
        item.appendChild(createEl("dt", "about-fact-label", String(fact.label)));
        item.appendChild(createEl("dd", "about-fact-value", String(fact.value)));
        factsEl.appendChild(item);
      });
      factsEl.hidden = factsEl.children.length === 0;
    }

    if (bodyEl) {
      bodyEl.textContent = "";
      paragraphs.forEach((text) => {
        bodyEl.appendChild(createEl("p", "about-paragraph", text));
      });
    }
  }

  function renderSkillsSection() {
    const section = document.getElementById("skills");
    const skillsCfg = profile.skills;
    const groups =
      skillsCfg && Array.isArray(skillsCfg.groups)
        ? skillsCfg.groups.filter((g) => g && g.title && Array.isArray(g.items) && g.items.length > 0)
        : [];

    if (!section || !skillsCfg || groups.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    section.hidden = false;
    const eyebrowEl = document.getElementById("skills-eyebrow");
    const headingEl = document.getElementById("skills-heading");
    const subtitleEl = document.getElementById("skills-subtitle");
    const gridEl = document.getElementById("skills-grid");

    if (eyebrowEl && skillsCfg.eyebrow) eyebrowEl.textContent = skillsCfg.eyebrow;
    if (headingEl && skillsCfg.heading) headingEl.textContent = skillsCfg.heading;
    if (subtitleEl && skillsCfg.subtitle) subtitleEl.textContent = skillsCfg.subtitle;

    if (gridEl) {
      gridEl.textContent = "";
      groups.forEach((group) => {
        const card = createEl("article", "skill-group-card reveal-item");
        card.setAttribute("data-reveal", "");

        const header = createEl("div", "skill-group-header");
        const iconWrap = createEl("span", "skill-group-icon");
        iconWrap.appendChild(createSvgIcon(group.icon || "code", 18));
        header.appendChild(iconWrap);
        header.appendChild(createEl("h3", "skill-group-title", String(group.title)));
        card.appendChild(header);

        const list = createEl("ul", "skill-items-list");
        group.items.forEach((skill) => {
          const text = String(skill || "").trim();
          if (!text) return;
          list.appendChild(createEl("li", "skill-item-chip", text));
        });
        card.appendChild(list);

        gridEl.appendChild(card);
      });
    }
  }

  function renderCapabilitiesSection() {
    const section = document.getElementById("capabilities");
    const capCfg = profile.capabilities;
    const items =
      capCfg && Array.isArray(capCfg.items)
        ? capCfg.items.filter((item) => item && item.title && item.description)
        : [];

    if (!section || !capCfg || items.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    section.hidden = false;
    const eyebrowEl = document.getElementById("capabilities-eyebrow");
    const headingEl = document.getElementById("capabilities-heading");
    const subtitleEl = document.getElementById("capabilities-subtitle");
    const gridEl = document.getElementById("capabilities-grid");

    if (eyebrowEl && capCfg.eyebrow) eyebrowEl.textContent = capCfg.eyebrow;
    if (headingEl && capCfg.heading) headingEl.textContent = capCfg.heading;
    if (subtitleEl && capCfg.subtitle) subtitleEl.textContent = capCfg.subtitle;

    if (gridEl) {
      gridEl.textContent = "";
      items.forEach((item, idx) => {
        const card = createEl("article", "capability-card reveal-item");
        card.setAttribute("data-reveal", "");

        const top = createEl("div", "capability-card-top");
        const iconBox = createEl("span", "capability-icon");
        iconBox.appendChild(createSvgIcon(item.icon || "code", 19));
        top.appendChild(iconBox);
        top.appendChild(
          createEl("span", "capability-index", String(item.index || `0${idx + 1}`))
        );
        card.appendChild(top);

        card.appendChild(createEl("h3", "capability-title", String(item.title)));
        card.appendChild(createEl("p", "capability-description", String(item.description)));

        gridEl.appendChild(card);
      });
    }
  }

  function renderCredentialsSection() {
    const section = document.getElementById("credentials");
    const education = Array.isArray(profile.education)
      ? profile.education.filter((e) => e && e.institution)
      : [];
    const certifications = Array.isArray(profile.certifications)
      ? profile.certifications.filter((c) => c && c.title)
      : [];

    if (!section || (education.length === 0 && certifications.length === 0)) {
      if (section) section.hidden = true;
      return;
    }

    section.hidden = false;
    const eduListEl = document.getElementById("education-list");
    const certListEl = document.getElementById("certifications-list");

    if (eduListEl) {
      eduListEl.textContent = "";
      education.forEach((entry) => {
        const card = createEl("article", "education-card");
        const header = createEl("div", "education-card-top");
        const iconBox = createEl("span", "credential-icon");
        iconBox.appendChild(createSvgIcon("graduationCap", 18));
        header.appendChild(iconBox);
        if (entry.graduation) {
          header.appendChild(
            createEl("span", "education-year", `Graduation · ${String(entry.graduation)}`)
          );
        }
        card.appendChild(header);

        card.appendChild(createEl("h4", "education-institution", String(entry.institution)));
        if (entry.field) {
          card.appendChild(createEl("p", "education-field", String(entry.field)));
        }
        eduListEl.appendChild(card);
      });
    }

    if (certListEl) {
      certListEl.textContent = "";
      certifications.forEach((cert) => {
        const li = createEl("li", "certification-card");
        const iconBox = createEl("span", "credential-icon");
        iconBox.appendChild(createSvgIcon("award", 18));
        li.appendChild(iconBox);
        li.appendChild(createEl("span", "certification-title", String(cert.title)));
        certListEl.appendChild(li);
      });
    }
  }

  function renderExperienceSection() {
    const section = document.getElementById("experience");
    const listEl = document.getElementById("experience-list");
    const entries = Array.isArray(profile.experience)
      ? profile.experience.filter((item) => item && (item.role || item.title) && item.company)
      : [];

    if (!section || entries.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    section.hidden = false;
    if (listEl) {
      listEl.textContent = "";
      entries.forEach((entry) => {
        const card = createEl("article", "experience-card");
        if (entry.period) {
          card.appendChild(createEl("span", "experience-period", String(entry.period)));
        }
        card.appendChild(
          createEl("h3", "experience-role", String(entry.role || entry.title))
        );
        card.appendChild(createEl("p", "experience-company", String(entry.company)));
        if (entry.description) {
          card.appendChild(createEl("p", "experience-description", String(entry.description)));
        }
        listEl.appendChild(card);
      });
    }
  }

  /* ------------------------------------------------------------------------
   * Projects Normalization & Rendering (Preserving Exact Array Order)
   * ---------------------------------------------------------------------- */
  function normalizeType(rawType) {
    const val = String(rawType || "").trim().toLowerCase();
    if (
      val === "flutter" ||
      val === "mobile" ||
      val === "app" ||
      val === "apps" ||
      val === "ios" ||
      val === "android" ||
      val.includes("flutter") ||
      val.includes("mobile")
    ) {
      return "flutter";
    }
    return "web";
  }

  function normalizeImages(project) {
    const source =
      project.images !== undefined
        ? project.images
        : project.screenshots !== undefined
        ? project.screenshots
        : project.image !== undefined
        ? project.image
        : project.screenshot;

    const rawList = Array.isArray(source) ? source : source ? [source] : [];

    return rawList
      .map((item) => {
        if (typeof item === "string") {
          const src = sanitizeUrl(item, false);
          return src ? { src, alt: "", label: "" } : null;
        }
        if (item && typeof item === "object") {
          const src = sanitizeUrl(item.src || item.url || "", false);
          return src
            ? {
                src,
                alt: String(item.alt || ""),
                label: item.label ? String(item.label).trim() : ""
              }
            : null;
        }
        return null;
      })
      .filter(Boolean);
  }

  function normalizeProjectLinks(project, category) {
    const isMobile = category === "flutter";
    const raw =
      project.links !== undefined
        ? project.links
        : project.urls !== undefined
        ? project.urls
        : project.url
        ? { live: project.url }
        : null;
    const result = [];

    const keyConfig = {
      live: isMobile
        ? { label: "Web Demo", icon: "external", primary: true }
        : { label: "Visit Website", icon: "globe", primary: true },
      website: { label: "Visit Website", icon: "globe", primary: true },
      playStore: { label: "Google Play", icon: "store", primary: true },
      googlePlay: { label: "Google Play", icon: "store", primary: true },
      appStore: { label: "App Store", icon: "phone", primary: true },
      demo: { label: "Web Demo", icon: "external", primary: true },
      github: { label: "GitHub", icon: "code", primary: false },
      repo: { label: "GitHub", icon: "code", primary: false },
      figma: { label: "Design", icon: "external", primary: false },
      caseStudy: { label: "Case Study", icon: "external", primary: false }
    };

    if (Array.isArray(raw)) {
      raw.forEach((entry, idx) => {
        if (!entry || typeof entry !== "object") return;
        const href = sanitizeUrl(entry.url || entry.href || "", true);
        if (!href) return;
        result.push({
          label: String(entry.label || entry.name || "Open Link"),
          href,
          icon: entry.icon || "external",
          primary: Boolean(entry.primary ?? idx === 0),
          kind: entry.kind || "external"
        });
      });
    } else if (raw && typeof raw === "object") {
      Object.entries(raw).forEach(([key, val]) => {
        const href = sanitizeUrl(val, true);
        if (!href) return;
        const meta = keyConfig[key] || {
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (c) => c.toUpperCase()),
          icon: "external",
          primary: false
        };
        result.push({
          label: meta.label,
          href,
          icon: meta.icon,
          primary: meta.primary,
          kind: key
        });
      });
    }

    let foundPrimary = false;
    result.forEach((item) => {
      if (item.primary && !foundPrimary) {
        foundPrimary = true;
      } else {
        item.primary = false;
      }
    });
    if (!foundPrimary && result.length > 0) {
      result[0].primary = true;
    }

    return result;
  }

  function getNormalizedProjects() {
    const currentData = window.PORTFOLIO_DATA || {};
    const list = Array.isArray(currentData.projects) ? currentData.projects : [];
    return list
      .filter((item) => item && typeof item === "object")
      .map((item, idx) => {
        const category = normalizeType(item.type || item.category);
        const links = normalizeProjectLinks(item, category);
        const hasWebDemo =
          category === "flutter" &&
          links.some((l) => l.kind === "demo" || l.kind === "live");
        return {
          index: idx,
          name: String(item.name || item.title || `Project ${idx + 1}`).trim(),
          category,
          featured: Boolean(item.featured),
          featuredLabel: item.featuredLabel ? String(item.featuredLabel).trim() : "",
          highlights: Array.isArray(item.highlights)
            ? item.highlights.map((h) => String(h).trim()).filter(Boolean)
            : [],
          statusNote: item.statusNote ? String(item.statusNote).trim() : "",
          rawTypeLabel: item.typeLabel ? String(item.typeLabel).trim() : "",
          platformMeta:
            category === "flutter"
              ? hasWebDemo
                ? "Flutter · Web Demo"
                : "Flutter · Mobile"
              : "Responsive Web",
          description: String(item.description || "").trim(),
          images: normalizeImages(item),
          links,
          tags: Array.isArray(item.tags)
            ? item.tags.map((t) => String(t).trim()).filter(Boolean)
            : []
        };
      });
  }

  /* ------------------------------------------------------------------------
   * Lightbox State & Controls
   * ---------------------------------------------------------------------- */
  const LIGHTBOX_SIBLING_WEBP = new Set([
    "assets/projects/fixo/categories-light.png",
    "assets/projects/fixo/categories.png",
    "assets/projects/fixo/services-light.png",
    "assets/projects/fixo/services-catalog.png",
    "assets/projects/fixo/search-light.png",
    "assets/projects/fixo/search-services.png",
    "assets/projects/fixo/orders-light.png",
    "assets/projects/fixo/orders.png"
  ]);

  function resolveLightboxSrc(rawSrc) {
    if (!rawSrc || !/\.png$/i.test(rawSrc)) return rawSrc;
    if (LIGHTBOX_SIBLING_WEBP.has(rawSrc)) {
      return rawSrc.replace(/\.png$/i, ".webp");
    }
    if (rawSrc.startsWith("assets/projects/")) {
      return rawSrc.replace(/^assets\/projects\//, "assets/lightbox/").replace(/\.png$/i, ".webp");
    }
    return rawSrc;
  }

  const lightboxEl = document.getElementById("lightbox");
  const lightboxStage = document.getElementById("lightbox-stage");
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxType = document.getElementById("lightbox-type");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxLive = document.getElementById("lightbox-live");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxBackdrop = document.getElementById("lightbox-backdrop");

  const lightboxState = {
    project: null,
    index: 0,
    token: 0,
    lastFocused: null,
    inertRestore: []
  };

  function setBackgroundInert(active) {
    if (active) {
      lightboxState.inertRestore = [];
      ["site-header", "main-content", ".site-footer"].forEach((sel) => {
        const el = sel.startsWith(".") ? document.querySelector(sel) : document.getElementById(sel);
        if (!el || el === lightboxEl) return;
        lightboxState.inertRestore.push({ el, prev: Boolean(el.inert) });
        el.inert = true;
      });
    } else {
      lightboxState.inertRestore.forEach(({ el, prev }) => {
        el.inert = prev;
      });
      lightboxState.inertRestore = [];
    }
  }

  if (lightboxImg) {
    lightboxImg.decoding = "async";
    lightboxImg.addEventListener("load", () => {
      const token = lightboxImg._lbToken;
      if (token !== lightboxState.token) return;
      const done = () => {
        if (token !== lightboxState.token) return;
        if (lightboxStage) lightboxStage.classList.remove("is-loading");
        if (lightboxState.shouldAnimate && window.PortfolioMotion) {
          lightboxState.shouldAnimate = false;
          window.PortfolioMotion.animateSlideChange(lightboxImg);
        }
      };
      if (typeof lightboxImg.decode === "function") {
        lightboxImg.decode().then(done, done);
      } else {
        done();
      }
    });
    lightboxImg.addEventListener("error", () => {
      if (lightboxImg._lbToken !== lightboxState.token) return;
      const fallback = lightboxImg._lbFallback;
      if (fallback && lightboxImg.getAttribute("src") !== fallback) {
        lightboxImg._lbFallback = "";
        lightboxImg.src = fallback;
        return;
      }
      if (lightboxStage) lightboxStage.classList.remove("is-loading");
    });
  }

  function resolveSlideLabel(item, index) {
    if (!item) return "";
    if (item.label) return item.label;
    if (/catalog/i.test(item.alt || item.src || "")) return "Catalog View";
    if (/(?:desktop-home|twilight\/home)/i.test(item.src || "") && index === 0) {
      return "Storefront Home";
    }
    return "";
  }

  function updateLightboxView(animateSlide = false) {
    const project = lightboxState.project;
    if (!project || project.images.length === 0) return;

    const total = project.images.length;
    const current = project.images[lightboxState.index];
    const slideLabel = resolveSlideLabel(current, lightboxState.index);
    const token = ++lightboxState.token;
    const optimizedSrc = resolveLightboxSrc(current.src);

    lightboxState.shouldAnimate = Boolean(animateSlide);
    lightboxImg._lbToken = token;
    lightboxImg._lbFallback = optimizedSrc !== current.src ? current.src : "";
    lightboxImg.alt = current.alt || `${project.name} screenshot ${lightboxState.index + 1}`;

    if (lightboxImg.getAttribute("src") !== optimizedSrc) {
      if (lightboxStage) lightboxStage.classList.add("is-loading");
      lightboxImg.src = optimizedSrc;
    }
    if (lightboxImg.complete && lightboxImg.naturalWidth > 0) {
      if (lightboxStage) lightboxStage.classList.remove("is-loading");
      if (animateSlide && window.PortfolioMotion) {
        lightboxState.shouldAnimate = false;
        window.PortfolioMotion.animateSlideChange(lightboxImg);
      }
    } else if (lightboxStage) {
      lightboxStage.classList.add("is-loading");
    }

    lightboxTitle.textContent = project.name;
    lightboxType.textContent =
      project.category === "flutter" ? "Flutter Mobile Application" : "Web Development Project";
    if (lightboxCaption) {
      if (slideLabel) {
        lightboxCaption.textContent = slideLabel;
        lightboxCaption.hidden = false;
      } else {
        lightboxCaption.textContent = "";
        lightboxCaption.hidden = true;
      }
    }
    lightboxCounter.textContent = total > 1 ? `${lightboxState.index + 1} / ${total}` : "";
    lightboxPrev.hidden = total <= 1;
    lightboxNext.hidden = total <= 1;

    if (lightboxLive) {
      const labelPart = slideLabel ? `, ${slideLabel}` : "";
      lightboxLive.textContent = `${project.name}${labelPart}, ${lightboxState.index + 1} of ${total}`;
    }
  }

  function openLightbox(project, startIndex = 0) {
    if (!project || project.images.length === 0) return;
    lightboxState.lastFocused = document.activeElement;
    lightboxState.project = project;
    lightboxState.index = Math.max(0, Math.min(startIndex, project.images.length - 1));
    updateLightboxView(false);
    lightboxEl.hidden = false;
    setBackgroundInert(true);
    document.body.classList.add("lightbox-open");
    if (window.PortfolioMotion) {
      window.PortfolioMotion.animateLightboxOpen(lightboxEl);
    }
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (lightboxEl.hidden) return;
    lightboxState.token += 1;
    lightboxEl.hidden = true;
    if (lightboxStage) lightboxStage.classList.remove("is-loading");
    setBackgroundInert(false);
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
    lightboxState.project = null;
    if (lightboxState.lastFocused && typeof lightboxState.lastFocused.focus === "function") {
      lightboxState.lastFocused.focus();
    }
    lightboxState.lastFocused = null;
  }

  function stepLightbox(delta) {
    const project = lightboxState.project;
    if (!project || project.images.length <= 1) return;
    const total = project.images.length;
    lightboxState.index = (lightboxState.index + delta + total) % total;
    updateLightboxView(true);
  }

  function attachSwipe(targetEl, onSwipeLeft, onSwipeRight) {
    if (!targetEl) return;
    let startX = 0;
    let startY = 0;
    targetEl.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );
    targetEl.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (dx < 0) onSwipeLeft();
          else onSwipeRight();
        }
      },
      { passive: true }
    );
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => stepLightbox(1));
  attachSwipe(
    lightboxEl,
    () => stepLightbox(1),
    () => stepLightbox(-1)
  );

  document.addEventListener("keydown", (e) => {
    if (lightboxEl.hidden) return;
    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft") {
      stepLightbox(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      stepLightbox(1);
      return;
    }
    if (e.key === "Tab") {
      const focusables = [lightboxClose, lightboxPrev, lightboxNext].filter(
        (btn) => btn && !btn.hidden
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ------------------------------------------------------------------------
   * Render Work Section
   * ---------------------------------------------------------------------- */
  let activeFilter = "all";
  let revealObserver = null;

  function observeRevealTargets(forceImmediate = false) {
    if (!revealObserver) return;
    document.querySelectorAll("[data-reveal], .project-card").forEach((el) => {
      el.classList.add("reveal-item");
      if (forceImmediate) {
        window.requestAnimationFrame(() => el.classList.add("is-visible"));
      } else {
        revealObserver.observe(el);
      }
    });
  }

  function applyAdaptivePhoneTheme(imgEl, screenEl) {
    if (!imgEl || !screenEl || !imgEl.complete || !imgEl.naturalWidth) return;
    try {
      const w = Math.min(64, imgEl.naturalWidth);
      const h = Math.min(128, imgEl.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(imgEl, 0, 0, w, h);

      // Sample outer left & right corners of top/bottom rows so header icons/buttons never skew color
      const sampleCorners = (y) => {
        const left = ctx.getImageData(0, y, 2, 1).data;
        const right = ctx.getImageData(w - 2, y, 2, 1).data;
        const r = Math.round((left[0] + right[0]) / 2);
        const g = Math.round((left[1] + right[1]) / 2);
        const b = Math.round((left[2] + right[2]) / 2);
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return { rgb: `rgb(${r}, ${g}, ${b})`, isDark: luma < 0.45 };
      };

      const topSample = sampleCorners(0);
      const bottomSample = sampleCorners(h - 1);
      screenEl.style.setProperty("--phone-top-bg", topSample.rgb);
      screenEl.style.setProperty("--phone-bottom-bg", bottomSample.rgb);
      screenEl.style.setProperty("--phone-screen-bg", topSample.rgb);
      screenEl.classList.toggle("is-dark-top", topSample.isDark);
      screenEl.classList.toggle("is-dark-bottom", bottomSample.isDark);
    } catch {
      // Retain CSS defaults if canvas read is unavailable
    }
  }

  function createIosStatusBar() {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const makeSvg = (vb, wCls, paths) => {
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", vb);
      svg.setAttribute("class", wCls);
      svg.setAttribute("aria-hidden", "true");
      paths.forEach((p) => {
        const node = document.createElementNS(SVG_NS, p.tag);
        Object.entries(p.attrs).forEach(([k, v]) => node.setAttribute(k, v));
        svg.appendChild(node);
      });
      return svg;
    };

    const topArea = createEl("div", "device-phone-top");
    topArea.setAttribute("aria-hidden", "true");
    topArea.setAttribute("dir", "ltr");

    const leftSlot = createEl("div", "iphone-status-left");
    leftSlot.appendChild(createEl("span", "iphone-status-time", "9:41"));

    const centerSlot = createEl("div", "iphone-status-center");
    centerSlot.appendChild(createEl("span", "device-phone-island"));

    const rightSlot = createEl("div", "iphone-status-right");

    // iOS 4-bar cellular signal SVG
    rightSlot.appendChild(
      makeSvg("0 0 18 12", "iphone-icon iphone-icon--signal", [
        { tag: "rect", attrs: { x: "0.5", y: "7.5", width: "2.8", height: "4", rx: "1", fill: "currentColor" } },
        { tag: "rect", attrs: { x: "5", y: "5.5", width: "2.8", height: "6", rx: "1", fill: "currentColor" } },
        { tag: "rect", attrs: { x: "9.5", y: "3", width: "2.8", height: "8.5", rx: "1", fill: "currentColor" } },
        { tag: "rect", attrs: { x: "14", y: "0.5", width: "2.8", height: "11", rx: "1", fill: "currentColor" } }
      ])
    );

    // iOS Wi-Fi arc SVG
    rightSlot.appendChild(
      makeSvg("0 0 16 12", "iphone-icon iphone-icon--wifi", [
        {
          tag: "path",
          attrs: {
            d: "M1.2 4.1C4.95 0.9 11.05 0.9 14.8 4.1",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.65",
            "stroke-linecap": "round"
          }
        },
        {
          tag: "path",
          attrs: {
            d: "M3.7 6.8C6.15 4.7 9.85 4.7 12.3 6.8",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.65",
            "stroke-linecap": "round"
          }
        },
        {
          tag: "path",
          attrs: {
            d: "M6.25 9.35C7.25 8.45 8.75 8.45 9.75 9.35",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.65",
            "stroke-linecap": "round"
          }
        },
        { tag: "circle", attrs: { cx: "8", cy: "11", r: "1.05", fill: "currentColor" } }
      ])
    );

    // iOS Battery SVG with visible charge fill and right terminal cap
    rightSlot.appendChild(
      makeSvg("0 0 27 13", "iphone-icon iphone-icon--battery", [
        {
          tag: "rect",
          attrs: {
            x: "0.85",
            y: "1.1",
            width: "22.3",
            height: "10.8",
            rx: "3.1",
            fill: "none",
            stroke: "currentColor",
            "stroke-opacity": "0.42",
            "stroke-width": "1.25"
          }
        },
        { tag: "rect", attrs: { x: "2.4", y: "2.65", width: "18.2", height: "7.7", rx: "1.75", fill: "currentColor" } },
        { tag: "path", attrs: { d: "M24.3 4.6V8.4C25.1 8.05 25.55 7.35 25.55 6.5C25.55 5.65 25.1 4.95 24.3 4.6Z", fill: "currentColor", "fill-opacity": "0.45" } }
      ])
    );

    topArea.appendChild(leftSlot);
    topArea.appendChild(centerSlot);
    topArea.appendChild(rightSlot);
    return topArea;
  }

  function createAndroidStatusBar() {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const makeSvg = (vb, wCls, paths) => {
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", vb);
      svg.setAttribute("class", wCls);
      svg.setAttribute("aria-hidden", "true");
      paths.forEach((p) => {
        const node = document.createElementNS(SVG_NS, p.tag);
        Object.entries(p.attrs).forEach(([k, v]) => node.setAttribute(k, v));
        svg.appendChild(node);
      });
      return svg;
    };

    const topArea = createEl("div", "device-phone-top device-phone-top--android");
    topArea.setAttribute("aria-hidden", "true");
    topArea.setAttribute("dir", "ltr");

    const leftSlot = createEl("div", "android-status-left");
    leftSlot.appendChild(createEl("span", "android-status-time", "9:41"));

    const centerSlot = createEl("div", "android-status-center");
    centerSlot.appendChild(createEl("span", "device-phone-punchhole"));

    const rightSlot = createEl("div", "android-status-right");

    // Material filled Wi-Fi fan wedge (Android SystemUI order: Wi-Fi, Signal, Battery)
    rightSlot.appendChild(
      makeSvg("0 0 16 12", "android-icon android-icon--wifi", [
        {
          tag: "path",
          attrs: {
            d: "M8 11.1L0.85 4.05C2.85 2.05 5.32 1 8 1C10.68 1 13.15 2.05 15.15 4.05L8 11.1Z",
            fill: "currentColor"
          }
        }
      ])
    );

    // Material right-triangle cellular signal
    rightSlot.appendChild(
      makeSvg("0 0 14 13", "android-icon android-icon--signal", [
        {
          tag: "path",
          attrs: {
            d: "M1.2 11.8H12.4C12.75 11.8 13 11.55 13 11.2V1.4C13 0.9 12.4 0.65 12.05 1L0.95 10.95C0.6 11.25 0.8 11.8 1.2 11.8Z",
            fill: "currentColor"
          }
        }
      ])
    );

    // Upright Android SystemUI battery with top terminal nub
    rightSlot.appendChild(
      makeSvg("0 0 10 15", "android-icon android-icon--battery", [
        { tag: "rect", attrs: { x: "3.2", y: "0.4", width: "3.6", height: "1.4", rx: "0.5", fill: "currentColor" } },
        {
          tag: "rect",
          attrs: {
            x: "1.1",
            y: "2",
            width: "7.8",
            height: "12.4",
            rx: "1.35",
            fill: "none",
            stroke: "currentColor",
            "stroke-opacity": "0.42",
            "stroke-width": "1.15"
          }
        },
        { tag: "rect", attrs: { x: "1.65", y: "3.9", width: "6.7", height: "9.95", rx: "0.85", fill: "currentColor" } }
      ])
    );

    topArea.appendChild(leftSlot);
    topArea.appendChild(centerSlot);
    topArea.appendChild(rightSlot);
    return topArea;
  }

  function createMobileDeviceShell({
    device = "iphone",
    isPreview = false,
    hasNativeTop = false,
    hasNativeBottom = false
  } = {}) {
    let activeDevice = device === "android" ? "android" : "iphone";
    const frame = createEl(
      "div",
      `device-phone-frame device-phone-frame--${activeDevice}${
        isPreview ? " device-phone-frame--preview" : ""
      }`
    );

    const screen = createEl("div", "device-phone-screen");
    const viewport = createEl("div", "device-phone-viewport");
    let hwButtons = [];
    let topEl = null;
    let bottomEl = null;

    const mountChrome = (targetDevice) => {
      activeDevice = targetDevice === "android" ? "android" : "iphone";
      frame.classList.toggle("device-phone-frame--iphone", activeDevice === "iphone");
      frame.classList.toggle("device-phone-frame--android", activeDevice === "android");
      frame.dataset.device = activeDevice;

      hwButtons.forEach((btn) => btn.remove());
      hwButtons = [];
      const keyClasses =
        activeDevice === "android"
          ? ["android-hw-btn android-hw-btn--vol", "android-hw-btn android-hw-btn--power"]
          : [
              "iphone-hw-btn iphone-hw-btn--action",
              "iphone-hw-btn iphone-hw-btn--vol-up",
              "iphone-hw-btn iphone-hw-btn--vol-down",
              "iphone-hw-btn iphone-hw-btn--power"
            ];
      keyClasses.forEach((cls) => {
        const key = createEl("span", cls);
        key.setAttribute("aria-hidden", "true");
        frame.insertBefore(key, screen);
        hwButtons.push(key);
      });

      if (!hasNativeTop) {
        const nextTop =
          activeDevice === "android" ? createAndroidStatusBar() : createIosStatusBar();
        if (topEl && topEl.parentNode === screen) {
          screen.replaceChild(nextTop, topEl);
        } else {
          screen.insertBefore(nextTop, viewport);
        }
        topEl = nextTop;
      }

      if (!hasNativeBottom) {
        const nextBottom = createEl(
          "div",
          `device-phone-bottom${activeDevice === "android" ? " device-phone-bottom--android" : ""}`
        );
        nextBottom.setAttribute("aria-hidden", "true");
        nextBottom.appendChild(
          createEl("span", activeDevice === "android" ? "device-phone-gesture" : "device-phone-home")
        );
        if (bottomEl && bottomEl.parentNode === screen) {
          screen.replaceChild(nextBottom, bottomEl);
        } else {
          screen.appendChild(nextBottom);
        }
        bottomEl = nextBottom;
      }
    };

    screen.appendChild(viewport);
    frame.appendChild(screen);
    mountChrome(activeDevice);

    return { frame, screen, viewport, setDevice: mountChrome };
  }

  function createIphoneShell(opts = {}) {
    return createMobileDeviceShell({ device: "iphone", ...opts });
  }

  const COMPOSITED_FLUTTER_MOCKUPS = {
    "assets/projects/fixo/home.png": {
      src: "assets/mockups/fixo-iphone-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/fixo/home-ar.png": {
      src: "assets/mockups/fixo-android-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/fixo/categories-light.png": {
      src: "assets/mockups/fixo-android-categories-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/fixo/categories.png": {
      src: "assets/mockups/fixo-iphone-categories-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/fixo/services-light.png": {
      src: "assets/mockups/fixo-iphone-services-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/fixo/services-catalog.png": {
      src: "assets/mockups/fixo-android-services-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/fixo/search-light.png": {
      src: "assets/mockups/fixo-android-search-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/fixo/search-services.png": {
      src: "assets/mockups/fixo-iphone-search-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/fixo/orders-light.png": {
      src: "assets/mockups/fixo-iphone-orders-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/fixo/orders.png": {
      src: "assets/mockups/fixo-android-orders-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/screen-1.webp": {
      src: "assets/mockups/movies-android-1.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/screen-2.webp": {
      src: "assets/mockups/movies-iphone-2.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/movies/home-discover.png": {
      src: "assets/mockups/movies-android-home.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/home-arabic-rtl.png": {
      src: "assets/mockups/movies-iphone-home-ar.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/movies/browse-all.png": {
      src: "assets/mockups/movies-android-browse.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/browse-tv-series.png": {
      src: "assets/mockups/movies-iphone-tv.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/movies/search-empty.png": {
      src: "assets/mockups/movies-android-trending.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/search-results.png": {
      src: "assets/mockups/movies-iphone-search.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/movies/movie-details-film.png": {
      src: "assets/mockups/movies-android-details.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/movie-details.png": {
      src: "assets/mockups/movies-iphone-episodes.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/movies/free-cinema.png": {
      src: "assets/mockups/movies-android-cinema.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/movies/film-player.png": {
      src: "assets/mockups/movies-iphone-player.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/tawsela/rider-home.webp": {
      src: "assets/mockups/tawsela-iphone-home.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/tawsela/location-selection.webp": {
      src: "assets/mockups/tawsela-android-pickup.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/tawsela/destination-selection.webp": {
      src: "assets/mockups/tawsela-iphone-route.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/tawsela/ride-types.webp": {
      src: "assets/mockups/tawsela-android-booking.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/tawsela/ride-history.webp": {
      src: "assets/mockups/tawsela-iphone-history.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/tawsela/payments.webp": {
      src: "assets/mockups/tawsela-android-payments.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/tawsela/driver-space.webp": {
      src: "assets/mockups/tawsela-iphone-driver.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/tawsela/notifications.webp": {
      src: "assets/mockups/tawsela-android-notifications.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/home-light.png": {
      src: "assets/mockups/verve-iphone-home-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/home-ar-dark.png": {
      src: "assets/mockups/verve-android-home-ar-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/categories-light.png": {
      src: "assets/mockups/verve-android-categories-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/categories-dark.png": {
      src: "assets/mockups/verve-iphone-categories-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/search-light.png": {
      src: "assets/mockups/verve-iphone-search-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/search-dark.png": {
      src: "assets/mockups/verve-android-search-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/product-details-light.png": {
      src: "assets/mockups/verve-android-details-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/product-details-dark.png": {
      src: "assets/mockups/verve-iphone-details-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/favorites-light.png": {
      src: "assets/mockups/verve-iphone-favorites-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/favorites-dark.png": {
      src: "assets/mockups/verve-android-favorites-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/cart-dark.png": {
      src: "assets/mockups/verve-iphone-cart-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/cart-ar-light.png": {
      src: "assets/mockups/verve-android-cart-ar.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/verve/checkout-light.png": {
      src: "assets/mockups/verve-iphone-checkout-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/verve/checkout-dark.png": {
      src: "assets/mockups/verve-android-checkout-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/home-light.png": {
      src: "assets/mockups/news-iphone-home-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/home-dark.png": {
      src: "assets/mockups/news-android-home-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/home-ar-light.png": {
      src: "assets/mockups/news-android-home-ar-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/home-egypt-light.png": {
      src: "assets/mockups/news-iphone-egypt-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/category-business-dark.png": {
      src: "assets/mockups/news-iphone-business-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/category-business-light.png": {
      src: "assets/mockups/news-android-business-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/article-details-light.png": {
      src: "assets/mockups/news-android-details-light.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/article-details-dark.png": {
      src: "assets/mockups/news-iphone-details-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/search-dark.png": {
      src: "assets/mockups/news-android-search-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    },
    "assets/projects/news/search-light.png": {
      src: "assets/mockups/news-iphone-search-light.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/saved-dark.png": {
      src: "assets/mockups/news-iphone-saved-dark.webp",
      device: "iphone",
      label: "iPhone 16 Pro Max"
    },
    "assets/projects/news/settings-ar-dark.png": {
      src: "assets/mockups/news-android-settings-ar-dark.webp",
      device: "android",
      label: "Samsung Galaxy S24 Ultra"
    }
  };

  const RESPONSIVE_400_MOCKUPS = new Set([
    "assets/mockups/fixo-iphone-light.webp",
    "assets/mockups/fixo-android-dark.webp",
    "assets/mockups/tawsela-iphone-home.webp",
    "assets/mockups/verve-iphone-home-light.webp",
    "assets/mockups/news-iphone-home-light.webp",
    "assets/mockups/movies-android-1.webp"
  ]);

  const RESPONSIVE_640_WEB = new Set([
    "assets/projects/twilight/home.webp",
    "assets/projects/twilight/catalog.webp"
  ]);

  const prefetchedUrls = new Set();
  const cardVisibilityCallbacks = new WeakMap();
  let cardPrefetchObserver = null;

  function canPrefetchNextSlide() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return true;
    if (conn.saveData) return false;
    return conn.effectiveType !== "slow-2g" && conn.effectiveType !== "2g";
  }

  function prefetchImageOnce(url) {
    if (!url || prefetchedUrls.has(url) || !canPrefetchNextSlide()) return;
    prefetchedUrls.add(url);
    const preloader = new Image();
    preloader.decoding = "async";
    preloader.src = url;
  }

  function observeCardForNextSlidePrefetch(card, callback) {
    if (!card || typeof callback !== "function") return;
    if (typeof window.IntersectionObserver !== "function") {
      callback();
      return;
    }
    if (!cardPrefetchObserver) {
      cardPrefetchObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const cb = cardVisibilityCallbacks.get(entry.target);
            if (cb) {
              cardVisibilityCallbacks.delete(entry.target);
              cb();
            }
            cardPrefetchObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "120px 0px", threshold: 0.01 }
      );
    }
    cardVisibilityCallbacks.set(card, callback);
    cardPrefetchObserver.observe(card);
  }

  function getCompositedMockup(item) {
    return item && item.src ? COMPOSITED_FLUTTER_MOCKUPS[item.src] || null : null;
  }

  function buildResponsiveVariantSrc(src, suffix) {
    return src.replace(/\.webp$/i, `-${suffix}.webp`);
  }

  function getImageDescriptor(item, project, slideIndex, { isMobile, isDualFeatured = false } = {}) {
    const mockup = getCompositedMockup(item);
    if (mockup) {
      const width = mockup.device === "android" ? 660 : 644;
      const height = mockup.device === "android" ? 1340 : 1320;
      const alt = item.alt
        ? `${item.alt} inside ${mockup.label} frame`
        : `${project.name} — ${mockup.label} preview`;
      const has400 = RESPONSIVE_400_MOCKUPS.has(mockup.src);
      const srcset = has400
        ? `${buildResponsiveVariantSrc(mockup.src, 400)} 400w, ${mockup.src} ${width}w`
        : "";
      const sizes = has400
        ? isDualFeatured
          ? "(min-width: 768px) 196px, 32vw"
          : "(min-width: 768px) 222px, 42vw"
        : "";
      return { src: mockup.src, srcset, sizes, width, height, alt, mockup };
    }

    const src = item.src;
    const alt = item.alt || `${project.name} — preview ${slideIndex + 1}`;
    if (!isMobile && RESPONSIVE_640_WEB.has(src)) {
      return {
        src,
        srcset: `${buildResponsiveVariantSrc(src, 640)} 640w, ${src} 1280w`,
        sizes: "(min-width: 1024px) 560px, (min-width: 768px) 580px, calc(100vw - 6.8rem)",
        width: 1280,
        height: 800,
        alt,
        mockup: null
      };
    }

    return {
      src,
      srcset: "",
      sizes: "",
      width: isMobile ? 390 : 1280,
      height: isMobile ? 844 : 800,
      alt,
      mockup: null
    };
  }

  function bindProgressiveImage(imgEl, surfaceEl, fallbackEl, getCurrentToken) {
    imgEl.addEventListener("load", () => {
      const token = imgEl._activeToken;
      if (token !== getCurrentToken()) return;

      const finish = () => {
        if (token !== getCurrentToken()) return;
        if (surfaceEl) surfaceEl.classList.remove("is-loading");
        imgEl.hidden = false;
        if (fallbackEl) fallbackEl.hidden = true;
        if (typeof imgEl._onReady === "function") {
          imgEl._onReady();
        }
      };

      if (typeof imgEl.decode === "function") {
        imgEl.decode().then(finish, finish);
      } else {
        finish();
      }
    });

    imgEl.addEventListener("error", () => {
      if (imgEl._activeToken !== getCurrentToken()) return;
      if (surfaceEl) surfaceEl.classList.remove("is-loading");
      imgEl.hidden = true;
      if (fallbackEl) fallbackEl.hidden = false;
    });
  }

  function setProgressiveImageSource(imgEl, surfaceEl, fallbackEl, descriptor, token, onReady) {
    imgEl._activeToken = token;
    imgEl._onReady = onReady || null;
    imgEl.hidden = false;
    if (fallbackEl) fallbackEl.hidden = true;

    if (descriptor.width && descriptor.height) {
      imgEl.width = descriptor.width;
      imgEl.height = descriptor.height;
    }
    imgEl.alt = descriptor.alt;

    if (descriptor.srcset) {
      imgEl.sizes = descriptor.sizes;
      imgEl.srcset = descriptor.srcset;
    } else {
      imgEl.removeAttribute("sizes");
      imgEl.removeAttribute("srcset");
    }

    if (imgEl.getAttribute("src") !== descriptor.src) {
      if (surfaceEl) surfaceEl.classList.add("is-loading");
      imgEl.src = descriptor.src;
    }

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      if (surfaceEl) surfaceEl.classList.remove("is-loading");
      if (typeof onReady === "function") onReady();
    } else if (surfaceEl) {
      surfaceEl.classList.add("is-loading");
    }
  }

  function resolveMobileDeviceForSlide(project, slideIndex = 0) {
    const title = (project && project.name) || "";
    const item = (project && project.images && project.images[slideIndex]) || {};
    const mapped = getCompositedMockup(item);
    if (mapped) return mapped.device;
    if (/movies/i.test(title)) {
      return "android";
    }
    if (/fixo/i.test(title)) {
      return slideIndex === 1 || /arabic|home-ar/i.test(item.src || item.alt || "")
        ? "android"
        : "iphone";
    }
    return slideIndex % 2 === 1 ? "android" : "iphone";
  }

  function createPhoneFrame(images, project, startIndex = 0, explicitDevice = "", options = {}) {
    const item = images[startIndex] || images[0];
    const mockup = getCompositedMockup(item);
    if (mockup) {
      const frame = createEl(
        "div",
        `device-mockup-frame device-mockup-frame--${mockup.device}`
      );
      frame.dataset.device = mockup.device;
      frame.dataset.mockupTemplate = "png-composite";

      const imgEl = createEl("img", "device-mockup-img");
      imgEl.loading = "lazy";
      imgEl.decoding = "async";

      const fallbackEl = createEl("div", "stage-empty-fallback");
      fallbackEl.hidden = true;
      fallbackEl.appendChild(createSvgIcon("phone", 24));
      fallbackEl.appendChild(createEl("span", "", "Image preview unavailable"));

      let activeToken = 1;
      const descriptor = getImageDescriptor(item, project, startIndex, {
        isMobile: true,
        isDualFeatured: Boolean(options.isDualFeatured)
      });
      bindProgressiveImage(imgEl, frame, fallbackEl, () => activeToken);
      setProgressiveImageSource(imgEl, frame, fallbackEl, descriptor, activeToken);

      frame.appendChild(imgEl);
      frame.appendChild(fallbackEl);
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", `Preview ${item.alt || project.name} full screen`);
      frame.addEventListener("click", () => openLightbox(project, startIndex));
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(project, startIndex);
        }
      });
      return { frame, imgEl, fallbackEl };
    }

    const chosenDevice = explicitDevice || resolveMobileDeviceForSlide(project, startIndex);
    const { frame, screen, viewport } = createMobileDeviceShell({ device: chosenDevice });
    const imgEl = createEl("img", "device-screenshot--mobile");
    imgEl.loading = "lazy";
    imgEl.decoding = "async";

    const fallbackEl = createEl("div", "stage-empty-fallback");
    fallbackEl.hidden = true;
    fallbackEl.appendChild(createSvgIcon("phone", 24));
    fallbackEl.appendChild(createEl("span", "", "Image preview unavailable"));

    let activeToken = 1;
    const descriptor = getImageDescriptor(item, project, startIndex, { isMobile: true });
    bindProgressiveImage(imgEl, frame, fallbackEl, () => activeToken);
    setProgressiveImageSource(imgEl, frame, fallbackEl, descriptor, activeToken, () => {
      applyAdaptivePhoneTheme(imgEl, screen);
    });

    viewport.appendChild(imgEl);
    viewport.appendChild(fallbackEl);

    frame.setAttribute("tabindex", "0");
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", `Preview ${item.alt || project.name} full screen`);
    frame.addEventListener("click", () => openLightbox(project, startIndex));
    frame.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(project, startIndex);
      }
    });
    return { frame, imgEl, fallbackEl };
  }

  function buildProjectTopMeta(project, customBadgeText = "") {
    const isMobile = project.category === "flutter";
    const topMeta = createEl("div", "project-card-top");
    const badgeLabel =
      customBadgeText ||
      project.rawTypeLabel ||
      (isMobile ? "Flutter Application" : "Website");
    topMeta.appendChild(createEl("span", "project-type-badge", badgeLabel));
    topMeta.appendChild(
      createEl(
        "span",
        "project-platform-meta",
        project.platformMeta || (isMobile ? "Flutter · Mobile" : "Responsive Web")
      )
    );
    return topMeta;
  }

  function buildProjectLinksBar(project) {
    if (project.links.length === 0 && !project.statusNote) return null;
    const linksWrap = createEl("div", "project-links");
    project.links.forEach((link) => {
      const a = createEl(
        "a",
        `project-link-btn${link.primary ? " project-link-btn--primary" : ""}`
      );
      a.href = link.href;
      if (!link.href.startsWith("mailto:") && !link.href.startsWith("#")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.appendChild(createSvgIcon(link.icon, 15));
      a.appendChild(createEl("span", "", link.label));
      linksWrap.appendChild(a);
    });
    if (project.statusNote) {
      linksWrap.appendChild(createEl("span", "project-status-pill", project.statusNote));
    }
    return linksWrap;
  }

  function buildFeaturedCard(project) {
    const isMobile = project.category === "flutter";
    const card = createEl("article", "featured-card reveal-item");
    card.setAttribute("data-reveal", "");

    const stage = createEl("div", "featured-visual-stage");

    if (isMobile && project.images.length >= 2) {
      const dualGrid = createEl("div", "featured-dual-phones");
      project.images.slice(0, 2).forEach((imgItem, idx) => {
        const col = createEl("div", "featured-phone-item");
        const deviceType = idx === 0 ? "iphone" : "android";
        const { frame } = createPhoneFrame(project.images, project, idx, deviceType, {
          isDualFeatured: true
        });
        col.appendChild(frame);
        const platformPrefix = deviceType === "android" ? "Android" : "iPhone";
        const modeText = /arabic/i.test(imgItem.alt || "")
          ? "Arabic Dark"
          : /english|light/i.test(imgItem.alt || "")
          ? "English Light"
          : `Screen ${idx + 1}`;
        col.appendChild(createEl("span", "featured-screen-caption", `${platformPrefix} · ${modeText}`));
        dualGrid.appendChild(col);
      });
      stage.appendChild(dualGrid);
    } else if (project.images.length > 0) {
      let currentSlide = 0;
      let slideToken = 0;
      let cardViewed = false;
      let userNavigated = false;
      let frame;
      let screen = null;
      let viewport;
      if (isMobile) {
        ({ frame, screen, viewport } = createMobileDeviceShell({
          device: resolveMobileDeviceForSlide(project, 0)
        }));
      } else {
        frame = createEl("div", "device-browser");
        const chrome = createEl("div", "device-browser-chrome");
        chrome.setAttribute("aria-hidden", "true");
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-url-pill"));
        frame.appendChild(chrome);
        viewport = createEl("div", "device-browser-screen");
        frame.appendChild(viewport);
      }

      const surfaceEl = isMobile ? frame : viewport;
      const imgEl = createEl(
        "img",
        isMobile ? "device-screenshot--mobile" : "device-screenshot--web"
      );
      imgEl.loading = "lazy";
      imgEl.decoding = "async";

      const fallbackEl = createEl("div", "stage-empty-fallback");
      fallbackEl.hidden = true;
      fallbackEl.appendChild(createSvgIcon(isMobile ? "phone" : "globe", 28));
      fallbackEl.appendChild(createEl("span", "", "Image preview unavailable"));

      bindProgressiveImage(imgEl, surfaceEl, fallbackEl, () => slideToken);

      viewport.appendChild(imgEl);
      viewport.appendChild(fallbackEl);

      frame.setAttribute("tabindex", "0");
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", `Preview ${project.name} screenshot full screen`);
      frame.addEventListener("click", () => openLightbox(project, currentSlide));
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(project, currentSlide);
        }
      });
      stage.appendChild(frame);

      const zoomBtn = createEl("button", "stage-zoom-btn");
      zoomBtn.type = "button";
      zoomBtn.setAttribute("aria-label", `Open ${project.name} gallery in full screen`);
      zoomBtn.title = "View full screen";
      zoomBtn.appendChild(createSvgIcon("expand", 15));
      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(project, currentSlide);
      });
      stage.appendChild(zoomBtn);

      const prefetchAdjacentFeatured = () => {
        if ((!cardViewed && !userNavigated) || project.images.length <= 1) return;
        const nextIdx = (currentSlide + 1) % project.images.length;
        const nextDesc = getImageDescriptor(project.images[nextIdx], project, nextIdx, { isMobile });
        const target = nextDesc.srcset && !isMobile && window.innerWidth < 768
          ? buildResponsiveVariantSrc(nextDesc.src, 640)
          : nextDesc.src;
        prefetchImageOnce(target);
      };

      let switchBtns = [];
      let animatedToken = 0;
      const setSlide = (idx, animate = false) => {
        if (animate) userNavigated = true;
        currentSlide = (idx + project.images.length) % project.images.length;
        const token = ++slideToken;
        const item = project.images[currentSlide];
        const descriptor = getImageDescriptor(item, project, currentSlide, { isMobile });

        setProgressiveImageSource(imgEl, surfaceEl, fallbackEl, descriptor, token, () => {
          if (isMobile && screen) applyAdaptivePhoneTheme(imgEl, screen);
          if (animate && window.PortfolioMotion && animatedToken !== token) {
            animatedToken = token;
            window.PortfolioMotion.animateSlideChange(imgEl);
          }
          prefetchAdjacentFeatured();
        });

        switchBtns.forEach((btn, bIdx) => {
          btn.classList.toggle("is-active", bIdx === currentSlide);
          btn.setAttribute("aria-pressed", String(bIdx === currentSlide));
        });
      };

      observeCardForNextSlidePrefetch(card, () => {
        cardViewed = true;
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          prefetchAdjacentFeatured();
        }
      });

      if (project.images.length > 1) {
        const switcher = createEl("div", "featured-web-switcher");
        switchBtns = project.images.map((imgItem, idx) => {
          const label =
            resolveSlideLabel(imgItem, idx) ||
            (idx === 0 ? "Storefront Home" : `Preview ${idx + 1}`);
          const btn = createEl("button", "featured-switch-btn", label);
          btn.type = "button";
          btn.addEventListener("click", () => setSlide(idx, true));
          switcher.appendChild(btn);
          return btn;
        });
        stage.appendChild(switcher);
      }
      setSlide(0);
    }

    const body = createEl("div", "featured-card-body");
    body.appendChild(
      buildProjectTopMeta(project, project.featuredLabel || "Featured Project")
    );

    const titleEl = createEl("h3", "featured-card-title", project.name);
    titleEl.setAttribute("dir", "auto");
    body.appendChild(titleEl);

    if (project.tags.length > 0) {
      const tagsEl = createEl("div", "project-tags");
      project.tags.forEach((tagText) => {
        tagsEl.appendChild(createEl("span", "project-tag", tagText));
      });
      body.appendChild(tagsEl);
    }

    if (project.description) {
      const descEl = createEl("p", "featured-card-desc", project.description);
      descEl.setAttribute("dir", "auto");
      body.appendChild(descEl);
    }

    if (project.highlights.length > 0) {
      const ul = createEl("ul", "featured-highlights");
      project.highlights.forEach((point) => {
        ul.appendChild(createEl("li", "", point));
      });
      body.appendChild(ul);
    }

    const linksBar = buildProjectLinksBar(project);
    if (linksBar) body.appendChild(linksBar);

    card.appendChild(stage);
    card.appendChild(body);
    return card;
  }

  function renderFeaturedSection() {
    const section = document.getElementById("featured");
    const grid = document.getElementById("featured-grid");
    const featuredLinks = document.querySelectorAll("[data-featured-link]");
    const featuredProjects = getNormalizedProjects().filter((p) => p.featured);

    if (!section || !grid || featuredProjects.length === 0) {
      if (section) section.hidden = true;
      featuredLinks.forEach((el) => {
        el.hidden = true;
      });
      return;
    }

    section.hidden = false;
    featuredLinks.forEach((el) => {
      el.hidden = false;
    });

    const cfg = profile.featuredSection || {};
    const eyebrowEl = document.getElementById("featured-eyebrow");
    const headingEl = document.getElementById("featured-heading");
    const subtitleEl = document.getElementById("featured-subtitle");
    if (eyebrowEl && cfg.eyebrow) eyebrowEl.textContent = cfg.eyebrow;
    if (headingEl && cfg.heading) headingEl.textContent = cfg.heading;
    if (subtitleEl && cfg.subtitle) subtitleEl.textContent = cfg.subtitle;

    grid.textContent = "";
    featuredProjects.forEach((project) => {
      grid.appendChild(buildFeaturedCard(project));
    });
  }

  function buildProjectCard(project) {
    const isMobile = project.category === "flutter";
    const hasImages = project.images.length > 0;
    const card = createEl("article", "project-card");
    card.setAttribute("data-category", project.category);

    const topMeta = buildProjectTopMeta(project);

    if (hasImages) {
      const visualWrap = createEl("div", "project-card-visual");
      visualWrap.appendChild(topMeta);

      const stage = createEl(
        "div",
        `project-stage ${isMobile ? "project-stage--mobile" : "project-stage--web"}`
      );
      stage.setAttribute("role", "region");
      stage.setAttribute("aria-roledescription", "carousel");
      stage.setAttribute("aria-label", `${project.name} screenshot gallery`);
      let currentSlide = 0;
      let slideToken = 0;
      let cardViewed = false;
      let userNavigated = false;

      let frame;
      let screen = null;
      let viewport;
      let setDevice = null;
      const usesCompositedMockups =
        isMobile && project.images.every((imgItem) => Boolean(getCompositedMockup(imgItem)));

      if (usesCompositedMockups) {
        const firstMockup = getCompositedMockup(project.images[0]);
        frame = createEl(
          "div",
          `device-mockup-frame device-mockup-frame--${firstMockup.device}`
        );
        frame.dataset.device = firstMockup.device;
        frame.dataset.mockupTemplate = "png-composite";
        viewport = frame;
      } else if (isMobile) {
        ({ frame, screen, viewport, setDevice } = createMobileDeviceShell({
          device: resolveMobileDeviceForSlide(project, 0)
        }));
      } else {
        frame = createEl("div", "device-browser");
        const chrome = createEl("div", "device-browser-chrome");
        chrome.setAttribute("aria-hidden", "true");
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-dot"));
        chrome.appendChild(createEl("span", "chrome-url-pill"));
        frame.appendChild(chrome);
        viewport = createEl("div", "device-browser-screen");
        frame.appendChild(viewport);
      }

      const surfaceEl = isMobile ? frame : viewport;
      const imgEl = createEl(
        "img",
        usesCompositedMockups
          ? "device-mockup-img"
          : isMobile
          ? "device-screenshot--mobile"
          : "device-screenshot--web"
      );
      const fallbackEl = createEl("div", "stage-empty-fallback");
      fallbackEl.hidden = true;
      fallbackEl.appendChild(createSvgIcon(isMobile ? "phone" : "globe", 28));
      fallbackEl.appendChild(createEl("span", "", "Image preview unavailable"));

      imgEl.loading = "lazy";
      imgEl.decoding = "async";

      let dotsWrap = null;
      let progressFillEl = null;
      let counterEl = null;
      let liveStatusEl = null;

      bindProgressiveImage(imgEl, surfaceEl, fallbackEl, () => slideToken);

      const prefetchNextWorkSlide = () => {
        if ((!cardViewed && !userNavigated) || project.images.length <= 1) return;
        const nextIdx = (currentSlide + 1) % project.images.length;
        const nextDesc = getImageDescriptor(project.images[nextIdx], project, nextIdx, { isMobile });
        const target = nextDesc.srcset && !isMobile && window.innerWidth < 768
          ? buildResponsiveVariantSrc(nextDesc.src, 640)
          : nextDesc.src;
        prefetchImageOnce(target);
      };

      let activeDotIdx = 0;
      let animatedToken = 0;

      const updateSlide = (nextIdx, animateTransition = false) => {
        if (animateTransition) userNavigated = true;
        const prevDotIdx = activeDotIdx;
        const total = project.images.length;
        currentSlide = (nextIdx + total) % total;
        activeDotIdx = currentSlide;
        const token = ++slideToken;
        const item = project.images[currentSlide];
        const slideLabel = resolveSlideLabel(item, currentSlide);
        const descriptor = getImageDescriptor(item, project, currentSlide, { isMobile });
        const slideMockup = descriptor.mockup;

        if (usesCompositedMockups && slideMockup) {
          frame.classList.toggle("device-mockup-frame--iphone", slideMockup.device === "iphone");
          frame.classList.toggle("device-mockup-frame--android", slideMockup.device === "android");
          frame.dataset.device = slideMockup.device;
        } else if (isMobile && setDevice) {
          setDevice(resolveMobileDeviceForSlide(project, currentSlide));
        }

        frame.setAttribute(
          "aria-label",
          `Preview ${slideLabel || item.alt || project.name} full screen`
        );

        setProgressiveImageSource(imgEl, surfaceEl, fallbackEl, descriptor, token, () => {
          if (!usesCompositedMockups && isMobile && screen) {
            applyAdaptivePhoneTheme(imgEl, screen);
          }
          if (animateTransition && window.PortfolioMotion && animatedToken !== token) {
            animatedToken = token;
            window.PortfolioMotion.animateSlideChange(imgEl);
          }
          prefetchNextWorkSlide();
        });

        if (dotsWrap && dotsWrap.children.length === total) {
          const prevDot = dotsWrap.children[prevDotIdx];
          const nextDot = dotsWrap.children[currentSlide];
          if (prevDot && prevDot !== nextDot) {
            prevDot.classList.remove("is-active");
            prevDot.setAttribute("aria-pressed", "false");
          }
          if (nextDot) {
            nextDot.classList.add("is-active");
            nextDot.setAttribute("aria-pressed", "true");
          }
        }
        if (progressFillEl && total > 0) {
          progressFillEl.style.setProperty("--stage-progress", ((currentSlide + 1) / total).toFixed(4));
        }
        if (counterEl) {
          counterEl.textContent = slideLabel
            ? `${slideLabel} · ${currentSlide + 1} / ${total}`
            : `${currentSlide + 1} / ${total}`;
        }
        if (animateTransition && liveStatusEl) {
          liveStatusEl.textContent = slideLabel
            ? `${slideLabel}, slide ${currentSlide + 1} of ${total}`
            : `Slide ${currentSlide + 1} of ${total}`;
        }
      };

      observeCardForNextSlidePrefetch(card, () => {
        cardViewed = true;
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          prefetchNextWorkSlide();
        }
      });

      viewport.appendChild(imgEl);
      viewport.appendChild(fallbackEl);

      frame.setAttribute("tabindex", "0");
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", `Preview ${project.name} screenshot full screen`);
      frame.addEventListener("click", () => openLightbox(project, currentSlide));
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(project, currentSlide);
        }
      });
      stage.appendChild(frame);

      const zoomBtn = createEl("button", "stage-zoom-btn");
      zoomBtn.type = "button";
      zoomBtn.setAttribute("aria-label", `Open ${project.name} gallery in full screen`);
      zoomBtn.title = "View full screen";
      zoomBtn.appendChild(createSvgIcon("expand", 15));
      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(project, currentSlide);
      });
      stage.appendChild(zoomBtn);

      if (project.images.length > 1) {
        attachSwipe(
          stage,
          () => updateSlide(currentSlide + 1, true),
          () => updateSlide(currentSlide - 1, true)
        );
        const prevBtn = createEl("button", "stage-nav-btn stage-nav-btn--prev");
        prevBtn.type = "button";
        prevBtn.setAttribute("aria-label", `Previous ${project.name} screenshot`);
        prevBtn.appendChild(createSvgIcon("chevronLeft", 16));
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          updateSlide(currentSlide - 1, true);
        });

        const nextBtn = createEl("button", "stage-nav-btn stage-nav-btn--next");
        nextBtn.type = "button";
        nextBtn.setAttribute("aria-label", `Next ${project.name} screenshot`);
        nextBtn.appendChild(createSvgIcon("chevronRight", 16));
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          updateSlide(currentSlide + 1, true);
        });

        stage.appendChild(prevBtn);
        stage.appendChild(nextBtn);

        liveStatusEl = createEl("span", "sr-only");
        liveStatusEl.setAttribute("aria-live", "polite");
        liveStatusEl.setAttribute("aria-atomic", "true");
        stage.appendChild(liveStatusEl);

        const dotsBar = createEl("div", "stage-dots-bar");
        const progressTrack = createEl("div", "stage-progress");
        progressTrack.setAttribute("aria-hidden", "true");
        progressFillEl = createEl("span", "stage-progress-fill");
        progressTrack.appendChild(progressFillEl);

        dotsWrap = createEl("div", "stage-dots");
        project.images.forEach((imgItem, idx) => {
          const dot = createEl("button", "stage-dot");
          dot.type = "button";
          const slideDesc = imgItem.label ? `: ${imgItem.label}` : "";
          dot.setAttribute("aria-label", `View ${project.name} screenshot ${idx + 1} of ${project.images.length}${slideDesc}`);
          dot.setAttribute("aria-pressed", String(idx === 0));
          dot.addEventListener("click", () => updateSlide(idx, true));
          dotsWrap.appendChild(dot);
        });
        counterEl = createEl("span", "stage-counter");
        dotsBar.appendChild(progressTrack);
        dotsBar.appendChild(dotsWrap);
        dotsBar.appendChild(counterEl);

        visualWrap.appendChild(stage);
        visualWrap.appendChild(dotsBar);
      } else {
        visualWrap.appendChild(stage);
      }

      updateSlide(0);
      card.appendChild(visualWrap);
    }

    const bodyWrap = createEl("div", "project-card-body");
    if (!hasImages) {
      card.classList.add("project-card--text-only");
      bodyWrap.appendChild(topMeta);
    }

    const details = createEl("div", "project-details");
    const titleEl = createEl("h3", "project-name", project.name);
    titleEl.setAttribute("dir", "auto");
    details.appendChild(titleEl);

    if (project.tags.length > 0) {
      const tagsEl = createEl("div", "project-tags");
      project.tags.forEach((tagText) => {
        tagsEl.appendChild(createEl("span", "project-tag", tagText));
      });
      details.appendChild(tagsEl);
    }

    if (project.description) {
      const descEl = createEl("p", "project-description", project.description);
      descEl.setAttribute("dir", "auto");
      details.appendChild(descEl);
    }

    bodyWrap.appendChild(details);

    const linksBar = buildProjectLinksBar(project);
    if (linksBar) bodyWrap.appendChild(linksBar);

    card.appendChild(bodyWrap);
    return card;
  }

  function buildPreviewCard(kind) {
    const isMobile = kind === "flutter";
    const card = createEl(
      "article",
      `project-card ${isMobile ? "project-card--preview-app" : "project-card--preview-web"}`
    );
    card.setAttribute("data-category", kind);

    const visualWrap = createEl("div", "preview-card-visual");

    const topMeta = createEl("div", "preview-card-top");
    topMeta.appendChild(
      createEl(
        "span",
        "project-type-badge",
        isMobile ? "Flutter App" : "Website"
      )
    );
    topMeta.appendChild(
      createEl(
        "span",
        "project-platform-meta",
        isMobile ? "iOS & Android" : "Responsive Web"
      )
    );
    visualWrap.appendChild(topMeta);

    const stage = createEl("div", "preview-stage");
    if (isMobile) {
      const { frame: phoneFrame, viewport } = createMobileDeviceShell({
        device: "iphone",
        isPreview: true
      });
      const canvas = createEl("div", "preview-phone-canvas");
      const center = createEl("div", "preview-frame-content");
      const iconWrap = createEl("div", "preview-frame-icon");
      iconWrap.appendChild(createSvgIcon("phone", 24));
      center.appendChild(iconWrap);
      center.appendChild(createEl("p", "preview-frame-title", "Flutter App"));
      center.appendChild(
        createEl("p", "preview-frame-caption", "Screens soon")
      );
      canvas.appendChild(center);
      viewport.appendChild(canvas);
      stage.appendChild(phoneFrame);
    } else {
      const browserFrame = createEl("div", "preview-browser-frame");
      const toolbar = createEl("div", "preview-browser-toolbar");
      toolbar.appendChild(createEl("span", "chrome-dot"));
      toolbar.appendChild(createEl("span", "chrome-dot"));
      toolbar.appendChild(createEl("span", "chrome-dot"));
      toolbar.appendChild(createEl("span", "chrome-url-pill"));
      browserFrame.appendChild(toolbar);

      const body = createEl("div", "preview-browser-body");
      const canvas = createEl("div", "preview-browser-canvas");
      const center = createEl("div", "preview-frame-content");
      const iconWrap = createEl("div", "preview-frame-icon");
      iconWrap.appendChild(createSvgIcon("monitor", 28));
      center.appendChild(iconWrap);
      center.appendChild(createEl("p", "preview-frame-title", "Website"));
      center.appendChild(
        createEl("p", "preview-frame-caption", "Screens soon")
      );
      canvas.appendChild(center);
      body.appendChild(canvas);
      browserFrame.appendChild(body);
      stage.appendChild(browserFrame);
    }
    visualWrap.appendChild(stage);

    const reservedDetails = createEl("div", "preview-reserved-details");
    reservedDetails.appendChild(
      createEl(
        "h3",
        "preview-card-title",
        isMobile ? "Flutter Mobile App" : "Website Project"
      )
    );
    reservedDetails.appendChild(
      createEl(
        "p",
        "preview-description",
        isMobile
          ? "App screenshots and details will appear here soon."
          : "Website screenshots and details will appear here soon."
      )
    );

    card.appendChild(visualWrap);
    card.appendChild(reservedDetails);
    return card;
  }

  function renderWorkSection(options = {}) {
    const { animated = false } = options;
    const projects = getNormalizedProjects();
    const hasProjects = projects.length > 0;

    const workSection = document.getElementById("work");
    const workLinks = document.querySelectorAll("[data-work-link]");
    const scrollCue = document.getElementById("hero-scroll-cue");
    const scrollLabel = document.getElementById("hero-scroll-label");
    const eyebrowEl = document.getElementById("work-eyebrow");
    const subtitleEl = document.getElementById("work-subtitle");
    const statusSubtitleEl = document.getElementById("work-status-subtitle");
    const filtersBox = document.getElementById("work-filters");
    const grid = document.getElementById("projects-grid");
    const emptyState = document.getElementById("projects-filter-empty");
    const filterButtons = document.querySelectorAll("#work-filters .filter-tab");

    if (workSection) workSection.hidden = false;
    workLinks.forEach((el) => {
      el.hidden = false;
    });

    if (scrollCue && scrollLabel) {
      const aboutSection = document.getElementById("about");
      const hasAbout = aboutSection && !aboutSection.hidden;
      scrollCue.hidden = false;
      scrollCue.href = hasAbout ? "#about" : "#work";
      scrollLabel.textContent = hasAbout ? "Scroll to Explore" : "Explore Work";
    }

    if (filtersBox) filtersBox.hidden = false;

    filterButtons.forEach((btn) => {
      const isMatch = btn.getAttribute("data-filter") === activeFilter;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    const renderGrid = () => {
      if (!hasProjects) {
        if (eyebrowEl) eyebrowEl.textContent = "Selected Work";
        if (subtitleEl) {
          subtitleEl.textContent =
            "Mobile applications built with Flutter and modern web projects will appear here soon.";
        }
        if (statusSubtitleEl) statusSubtitleEl.textContent = "Projects coming soon";

        const previewKinds = ["flutter", "web"].filter((kind) =>
          activeFilter === "all" ? true : kind === activeFilter
        );

        if (grid) {
          grid.textContent = "";
          grid.classList.add("projects-grid--previews");
          grid.classList.toggle("is-single", previewKinds.length === 1);
          previewKinds.forEach((kind) => {
            grid.appendChild(buildPreviewCard(kind));
          });
        }

        if (emptyState) emptyState.hidden = true;
        observeRevealTargets(Boolean(revealObserver));
        return;
      }

      if (eyebrowEl) eyebrowEl.textContent = "Selected Work";
      if (subtitleEl) {
        subtitleEl.textContent =
          "Mobile applications built with Flutter and modern web experiences.";
      }

      const filtered = projects.filter((project) =>
        activeFilter === "all" ? true : project.category === activeFilter
      );

      if (statusSubtitleEl) {
        const total = projects.length;
        if (activeFilter === "all") {
          statusSubtitleEl.textContent = `${total} ${total === 1 ? "Project" : "Projects"}`;
        } else {
          statusSubtitleEl.textContent = `${filtered.length} of ${total} ${total === 1 ? "Project" : "Projects"}`;
        }
      }

      if (grid) {
        grid.textContent = "";
        grid.classList.remove("projects-grid--previews", "is-single");
        grid.classList.add("is-grouped");

        const visualProjects = filtered.filter((p) => p.images.length > 0);
        const compactProjects = filtered.filter((p) => p.images.length === 0);

        if (visualProjects.length > 0) {
          const visualGrid = createEl("div", "projects-visual-grid");
          visualGrid.classList.toggle("is-single", visualProjects.length === 1);
          visualProjects.forEach((project) => {
            visualGrid.appendChild(buildProjectCard(project));
          });
          grid.appendChild(visualGrid);
        }

        if (compactProjects.length > 0) {
          const compactGroup = createEl("div", "projects-compact-group");
          if (visualProjects.length === 0) {
            compactGroup.classList.add("is-standalone");
          } else {
            compactGroup.appendChild(
              createEl("h3", "projects-compact-heading", "Deployed Web Demos & Mobile Builds")
            );
          }
          const compactGrid = createEl("div", "projects-compact-grid");
          compactProjects.forEach((project) => {
            compactGrid.appendChild(buildProjectCard(project));
          });
          compactGroup.appendChild(compactGrid);
          grid.appendChild(compactGroup);
        }
      }

      if (emptyState) {
        emptyState.hidden = filtered.length > 0;
      }

      observeRevealTargets(Boolean(revealObserver));
      if (typeof refreshScrollMetrics === "function") {
        refreshScrollMetrics();
      }
    };

    if (animated && window.PortfolioMotion) {
      window.PortfolioMotion.animateFilterTransition(() => {
        renderGrid();
      });
    } else {
      renderGrid();
      if (window.PortfolioMotion) {
        window.PortfolioMotion.refreshWork();
      }
    }
  }

  function setupFilters() {
    const filterButtons = document.querySelectorAll("#work-filters .filter-tab");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextFilter = btn.getAttribute("data-filter") || "all";
        if (nextFilter === activeFilter) return;
        activeFilter = nextFilter;
        renderWorkSection({ animated: true });
      });
    });

    const resetBtn = document.getElementById("reset-filter-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (activeFilter === "all") return;
        activeFilter = "all";
        renderWorkSection({ animated: true });
      });
    }
  }

  /* ------------------------------------------------------------------------
   * Header Scroll & Active Navigation Tracking (Zero Forced Reflow)
   * ---------------------------------------------------------------------- */
  let refreshScrollMetrics = null;

  function setupScrollEffects() {
    const header = document.getElementById("site-header");
    const hero = document.getElementById("overview");
    const navLinks = document.querySelectorAll(".header-nav .nav-link, #mobile-nav-drawer .mobile-drawer-link");
    const sectionIds = ["contact", "work", "experience", "credentials", "skills", "featured", "about"];

    let cachedHeroHeight = 640;
    let cachedDocHeight = 0;
    let cachedWinHeight = window.innerHeight || 900;
    let cachedSections = [];
    let rafPending = false;
    let lastScrolledPast = null;
    let lastScrolledInHero = null;
    let lastActiveHref = null;

    const measureMetrics = () => {
      cachedHeroHeight = hero ? hero.offsetHeight : 640;
      cachedDocHeight = document.documentElement.scrollHeight;
      cachedWinHeight = window.innerHeight || 900;
      cachedSections = [];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && !el.hidden) {
          cachedSections.push({ id, top: el.offsetTop });
        }
      }
    };

    const updateOnScroll = () => {
      rafPending = false;
      const scrollY = window.scrollY;
      const winH = cachedWinHeight;
      const scrolledPastHero = scrollY > Math.max(120, cachedHeroHeight - 96);
      const scrolledInHero = scrollY > 36 && !scrolledPastHero;

      if (header) {
        if (scrolledPastHero !== lastScrolledPast) {
          header.classList.toggle("is-scrolled", scrolledPastHero);
          lastScrolledPast = scrolledPastHero;
        }
        if (scrolledInHero !== lastScrolledInHero) {
          header.classList.toggle("is-hero-scrolled", scrolledInHero);
          lastScrolledInHero = scrolledInHero;
        }
      }

      const atBottom = cachedDocHeight > 0 && winH + scrollY >= cachedDocHeight - 24;
      const probeY = scrollY + winH * 0.35;

      let activeSectionId = "";
      if (atBottom && cachedSections.length > 0) {
        activeSectionId = cachedSections[0].id;
      } else {
        for (const sec of cachedSections) {
          if (probeY >= sec.top) {
            activeSectionId = sec.id;
            break;
          }
        }
      }

      const activeHref = activeSectionId ? `#${activeSectionId}` : "";
      if (activeHref !== lastActiveHref) {
        lastActiveHref = activeHref;
        navLinks.forEach((link) => {
          if (link.hidden) return;
          const isCurrent = link.getAttribute("href") === activeHref;
          link.classList.toggle("is-active", isCurrent);
          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    };

    const requestUpdate = () => {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(updateOnScroll);
    };

    refreshScrollMetrics = () => {
      window.requestAnimationFrame(() => {
        measureMetrics();
        updateOnScroll();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", refreshScrollMetrics, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshScrollMetrics);
    }
    measureMetrics();
    updateOnScroll();
  }

  function setupMobileNavDrawer() {
    const toggleBtn = document.getElementById("mobile-nav-toggle");
    const drawer = document.getElementById("mobile-nav-drawer");
    const header = document.getElementById("site-header");
    if (!toggleBtn || !drawer) return;

    let isOpenState = false;

    const setOpen = (isOpen) => {
      if (isOpen === isOpenState && drawer.hidden === !isOpen) return;
      isOpenState = isOpen;
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      toggleBtn.setAttribute(
        "aria-label",
        isOpen ? "Close section navigation menu" : "Open section navigation menu"
      );
      if (header) header.classList.toggle("is-menu-open", isOpen);

      if (window.PortfolioMotion) {
        if (isOpen) {
          window.PortfolioMotion.openMobileDrawer(drawer);
        } else {
          window.PortfolioMotion.closeMobileDrawer(drawer);
        }
      } else {
        drawer.hidden = !isOpen;
      }
    };

    toggleBtn.addEventListener("click", () => {
      setOpen(!isOpenState);
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpenState) {
        setOpen(false);
        toggleBtn.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!isOpenState || !header) return;
      if (!header.contains(e.target)) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && isOpenState) {
        setOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
   * Editorial Scroll Reveal (Fallback when GSAP is unavailable)
   * ---------------------------------------------------------------------- */
  function setupScrollReveal() {
    if (window.PortfolioMotion && typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
      window.PortfolioMotion.init();
      return;
    }

    if (document.documentElement) {
      document.documentElement.classList.remove("gsap-pending");
    }

    if (
      typeof window.IntersectionObserver !== "function" ||
      !document.documentElement
    ) {
      return;
    }

    document.documentElement.classList.add("reveal-ready");
    revealObserver = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    observeRevealTargets();
  }

  /* ------------------------------------------------------------------------
   * Initialize
   * ---------------------------------------------------------------------- */
  hydrateProfile();
  renderAboutSection();
  renderFeaturedSection();
  renderSkillsSection();
  renderCapabilitiesSection();
  renderCredentialsSection();
  renderExperienceSection();
  setupFilters();
  setupScrollEffects();
  renderWorkSection();
  setupMobileNavDrawer();
  setupScrollReveal();
})();
