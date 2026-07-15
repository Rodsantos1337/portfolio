#!/usr/bin/env python3
"""Update copy in React components and TypeScript data files from COPY-REVISED.md.

Reads the structured copy from `COPY-REVISED.md` (produced by the user) and
applies the changes to the corresponding source files:

  - src/data/site.ts
  - src/data/skills.ts
  - src/data/projects.ts
  - src/components/react/sections/Hero.tsx
  - src/components/react/sections/About.tsx
  - src/components/react/sections/Work.tsx
  - src/components/react/sections/Contact.tsx
  - src/components/react/layout/Footer.tsx
"""

import re
import sys
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "src" / "data"
COMPONENTS_DIR = PROJECT_ROOT / "src" / "components" / "react"
COPY_FILE = PROJECT_ROOT / "COPY-REVISED.md"

# Order of project ids in src/data/projects.ts (must stay in sync with the file).
PROJECT_IDS = ["tworks", "waymark", "xethub", "gbuilder"]

# About.tsx label renames (new -> old, used to find the current label).
ABOUT_LABEL_RENAMES = {
    "Location": "Operational Location",
    "Core Focus": "Expertise Focus",
    "Current Pursuit": "Current Direction",
    "Availability": "Availabilities",
}

# About.tsx current value text (for each renamed label) — used to find the
# current string to replace. The "Location" value is sourced dynamically from
# siteConfig.location and is skipped here.
ABOUT_VALUE_RENAMES = {
    "Core Focus": "Component Architect, Vector Physics, Webflow Architecture",
    "Current Pursuit": "Translating static logic systems into dynamic reactive views",
    "Availability": "Accepting Selected Projects",
}

# Opening lines of each About.tsx bio — used to locate the current text to replace.
ABOUT_BIO_ANCHORS = [
    "Over the past three years, I have architected high-fidelity custom experiences",
    "My philosophy is fundamentally shaped by React",
    "Before writing clean code, I obtained my credentials",
]


def parse_copy_md(content: str) -> dict:
    """Parse COPY-REVISED.md into a structured dict.

    Expected layout:
        Section Header
        <blank>
            Key: Value
        <blank>
            Another Key: Value
    """
    lines = content.split("\n")

    result: dict = {
        "site": {},
        "navigation": {},
        "hero": {},
        "skills": {"top": [], "bottom": []},
        "about": {"values": [], "bios": []},
        "work": {},
        "projects": [],
        "contact_footer": {},
    }

    current_section: str | None = None
    current_band: str | None = None
    current_project: dict | None = None

    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped:
            continue

        # Top-level section headers
        if stripped == "Site Configuration":
            current_section, current_band, current_project = "site", None, None
            continue
        if stripped == "Navigation":
            current_section, current_band, current_project = "navigation", None, None
            continue
        if stripped == "Hero Section":
            current_section, current_band, current_project = "hero", None, None
            continue
        if stripped == "Skills Marquee":
            current_section, current_band, current_project = "skills", None, None
            continue
        if stripped == "Top Band":
            current_band = "top"
            continue
        if stripped == "Bottom Band":
            current_band = "bottom"
            continue
        if stripped == "About Section":
            current_section, current_band, current_project = "about", None, None
            continue
        if stripped == "Work Section":
            current_section, current_band, current_project = "work", None, None
            continue
        if stripped == "Contact & Footer":
            current_section, current_band, current_project = "contact_footer", None, None
            continue
        if stripped.startswith("Project "):
            current_project = {"_title": stripped.split(":", 1)[1].strip()}
            result["projects"].append(current_project)
            continue

        # Indented content lines
        if line.startswith("    "):
            # While a project block is open, route all of its indented lines
            # (Description at 4 spaces, Role/Stack at 8 spaces) to the project.
            if current_project is not None and ":" in stripped:
                key, _, value = stripped.partition(":")
                current_project[key.strip().lower()] = value.strip()
                continue

            if ":" in stripped:
                key, _, value = stripped.partition(":")
                key_str = key.strip()
                value_str = value.strip()
                # Strip wrapping quotes for the About quote value.
                if value_str.startswith('"') and value_str.endswith('"'):
                    value_str = value_str[1:-1]

                if current_section == "site":
                    result["site"][key_str.lower()] = value_str
                elif current_section == "navigation":
                    result["navigation"][key_str.lower()] = value_str
                elif current_section == "hero":
                    result["hero"][key_str.lower()] = value_str
                elif current_section == "about":
                    if key_str.lower().startswith("quote"):
                        result["about"]["quote"] = value_str
                    elif re.match(r"^Bio\s*\d+$", key_str, re.IGNORECASE):
                        result["about"]["bios"].append(value_str)
                    else:
                        # 8-space-indented "Location: X", "Core Focus: Y" pairs
                        result["about"]["values"].append(
                            {"label": key_str, "value": value_str}
                        )
                elif current_section == "work":
                    result["work"][key_str.lower()] = value_str
                elif current_section == "contact_footer":
                    result["contact_footer"][key_str.lower()] = value_str
                continue

            # Bare list items belong to the skills marquee.
            if current_section == "skills":
                if current_band == "top":
                    result["skills"]["top"].append(stripped)
                elif current_band == "bottom":
                    result["skills"]["bottom"].append(stripped)

    return result


def replace_literal(content: str, old: str, new: str) -> tuple[str, bool]:
    """Replace first occurrence of `old` with `new`. Returns (content, changed).

    Returns changed=False if old == new or `old` is not in `content`.
    """
    if old == new or old not in content:
        return content, False
    return content.replace(old, new, 1), True


def replace_reveal_text(content: str, anchor: str, new_text: str) -> tuple[str, bool]:
    """Replace a RevealText `text="..."` value whose text starts with `anchor`.

    The text is expected to live on a single line inside a `<RevealText ... />`
    self-closing JSX tag. Returns (content, replaced).
    """
    escaped = re.escape(anchor)
    pattern = re.compile(
        r'(<RevealText\b[^>]*\btext=")' + escaped + r'[^"]*("[^/]*/>)',
        re.DOTALL,
    )
    new_content, count = pattern.subn(rf"\g<1>{new_text}\g<2>", content, count=1)
    return new_content, count > 0 and new_content != content


def update_site(data: dict) -> list[str]:
    """Update src/data/site.ts."""
    path = DATA_DIR / "site.ts"
    content = path.read_text()
    changes: list[str] = []

    site = data.get("site", {})

    if "title" in site:
        new_content, found = replace_literal(
            content,
            'title: "Interaction Designer & Developer"',
            f'title: "{site["title"]}"',
        )
        if not found:
            new_content = re.sub(
                r'title:\s*"[^"]*"',
                f'title: "{site["title"]}"',
                content,
                count=1,
            )
            found = new_content != content
        if found:
            content = new_content
            changes.append("title")

    if "tagline" in site:
        new_content = re.sub(
            r'(tagline:\s*\n\s*")[^"]*(",?)',
            lambda m: m.group(1) + site["tagline"] + m.group(2),
            content,
            count=1,
        )
        if new_content != content:
            content = new_content
            changes.append("tagline")

    if "email" in site:
        new_content, found = replace_literal(
            content,
            f'email: "{site["email"]}"',
            f'email: "{site["email"]}"',
        )
        if not found:
            new_content = re.sub(
                r'email:\s*"[^"]*"',
                f'email: "{site["email"]}"',
                content,
                count=1,
            )
            found = new_content != content
        if found:
            content = new_content
            changes.append("email")

    if "location" in site:
        new_content = re.sub(
            r'location:\s*"[^"]*"',
            f'location: "{site["location"]}"',
            content,
            count=1,
        )
        if new_content != content:
            content = new_content
            changes.append("location")

    if changes:
        path.write_text(content)

    return changes


def update_skills(data: dict) -> list[str]:
    """Update src/data/skills.ts."""
    path = DATA_DIR / "skills.ts"
    content = path.read_text()
    changes: list[str] = []

    skills = data.get("skills", {})

    for export_name, key, label in (
        ("topMarqueeItems", "top", "topMarqueeItems"),
        ("bottomMarqueeItems", "bottom", "bottomMarqueeItems"),
    ):
        items = skills.get(key, [])
        if not items:
            continue
        formatted = ",\n  ".join(f'"{item}"' for item in items)
        replacement = f"export const {export_name} = [\n  {formatted},\n] as const;"
        new_content = re.sub(
            rf"export const {export_name} = \[[^\]]*\] as const;",
            replacement,
            content,
            count=1,
            flags=re.DOTALL,
        )
        if new_content != content:
            content = new_content
            changes.append(label)

    if changes:
        path.write_text(content)

    return changes


def update_projects(data: dict) -> list[str]:
    """Update src/data/projects.ts."""
    path = DATA_DIR / "projects.ts"
    content = path.read_text()
    changes: list[str] = []

    projects = data.get("projects", [])

    for index, project in enumerate(projects):
        if index >= len(PROJECT_IDS):
            print(f"  Warning: COPY has more projects than expected ({project.get('_title')})")
            continue
        proj_id = PROJECT_IDS[index]

        # description
        if "description" in project:
            new_text = project["description"]
            pattern = re.compile(
                rf'(id:\s*"{re.escape(proj_id)}"[\s\S]*?description:\s*\n\s*)"[^"]*"',
            )
            new_content, count = pattern.subn(rf'\g<1>"{new_text}"', content, count=1)
            if count and new_content != content:
                content = new_content
                changes.append(f"{proj_id}.description")

        # role
        if "role" in project:
            new_text = project["role"]
            pattern = re.compile(
                rf'(id:\s*"{re.escape(proj_id)}"[\s\S]*?label:\s*"Role"\s*,\s*value:\s*)"[^"]*"',
            )
            new_content, count = pattern.subn(rf'\g<1>"{new_text}"', content, count=1)
            if count and new_content != content:
                content = new_content
                changes.append(f"{proj_id}.role")

        # stack
        if "stack" in project:
            new_text = project["stack"]
            pattern = re.compile(
                rf'(id:\s*"{re.escape(proj_id)}"[\s\S]*?label:\s*"Stack"\s*,\s*value:\s*)"[^"]*"',
            )
            new_content, count = pattern.subn(rf'\g<1>"{new_text}"', content, count=1)
            if count and new_content != content:
                content = new_content
                changes.append(f"{proj_id}.stack")

    if changes:
        path.write_text(content)

    return changes


def update_hero(data: dict) -> list[str]:
    """Update src/components/react/sections/Hero.tsx."""
    path = COMPONENTS_DIR / "sections" / "Hero.tsx"
    content = path.read_text()
    changes: list[str] = []

    hero = data.get("hero", {})

    if "subtitle" in hero:
        new_content, replaced = replace_reveal_text(
            content,
            "Designing and engineering ultra-high-fidelity digital interfaces",
            hero["subtitle"],
        )
        if replaced:
            content = new_content
            changes.append("subtitle")

    if changes:
        path.write_text(content)

    return changes


def update_about(data: dict) -> list[str]:
    """Update src/components/react/sections/About.tsx."""
    path = COMPONENTS_DIR / "sections" / "About.tsx"
    content = path.read_text()
    changes: list[str] = []

    about = data.get("about", {})

    # Quote (currently wrapped in &ldquo; and &rdquo; inside the text="" attribute)
    if "quote" in about:
        new_quote = about["quote"]
        pattern = re.compile(r'(&ldquo;)[^&]*(&rdquo;)')
        new_content, count = pattern.subn(rf"\g<1>{new_quote}\g<2>", content, count=1)
        if count and new_content != content:
            content = new_content
            changes.append("quote")

    # Renamed labels and their hardcoded values.
    values = about.get("values", [])
    for entry in values:
        new_label = entry["label"]
        new_value_text = entry["value"]

        old_label = ABOUT_LABEL_RENAMES.get(new_label)
        if old_label and old_label != new_label:
            new_content, found = replace_literal(
                content,
                f'text="{old_label}"',
                f'text="{new_label}"',
            )
            if found:
                content = new_content
                changes.append(f"label:{old_label}->{new_label}")

        # Value text — only the labels whose value is hardcoded (Location is
        # wired to siteConfig.location and is intentionally skipped).
        old_value = ABOUT_VALUE_RENAMES.get(new_label)
        if old_value and old_value != new_value_text:
            new_content, found = replace_literal(
                content,
                f'text="{old_value}"',
                f'text="{new_value_text}"',
            )
            if found:
                content = new_content
                changes.append(f"value:{new_label}")

    # Bios
    bios = about.get("bios", [])
    for i, new_bio in enumerate(bios):
        if i >= len(ABOUT_BIO_ANCHORS):
            break
        anchor = ABOUT_BIO_ANCHORS[i]
        new_content, replaced = replace_reveal_text(content, anchor, new_bio)
        if replaced:
            content = new_content
            changes.append(f"bio{i + 1}")

    if changes:
        path.write_text(content)

    return changes


def update_work(data: dict) -> list[str]:
    """Update src/components/react/sections/Work.tsx."""
    path = COMPONENTS_DIR / "sections" / "Work.tsx"
    content = path.read_text()
    changes: list[str] = []

    work = data.get("work", {})

    if "heading" in work:
        new_content, replaced = replace_reveal_text(
            content,
            "Engineered with complete digital focus",
            work["heading"],
        )
        if replaced:
            content = new_content
            changes.append("heading")

    if changes:
        path.write_text(content)

    return changes


def update_contact(data: dict) -> list[str]:
    """Update src/components/react/sections/Contact.tsx."""
    path = COMPONENTS_DIR / "sections" / "Contact.tsx"
    content = path.read_text()
    changes: list[str] = []

    cf = data.get("contact_footer", {})

    # Heading — currently hardcoded as "Let's engineer\n<br />\ntogether."
    if "heading" in cf:
        new_heading = cf["heading"]
        pattern = re.compile(r"Let's engineer\n\s*<br\s*/>\s*\n\s*together\.")
        new_content, count = pattern.subn(new_heading, content, count=1)
        if count and new_content != content:
            content = new_content
            changes.append("heading")

    # Description
    if "description" in cf:
        new_content, replaced = replace_reveal_text(
            content,
            "Whether you have a detailed specification",
            cf["description"],
        )
        if replaced:
            content = new_content
            changes.append("description")

    if changes:
        path.write_text(content)

    return changes


def update_footer(data: dict) -> list[str]:
    """Update src/components/react/layout/Footer.tsx."""
    path = COMPONENTS_DIR / "layout" / "Footer.tsx"
    content = path.read_text()
    changes: list[str] = []

    cf = data.get("contact_footer", {})

    # CTA Label
    if "cta label" in cf:
        new_content, found = replace_literal(
            content,
            'text="Start a Convergent Conversation"',
            f'text="{cf["cta label"]}"',
        )
        if found:
            content = new_content
            changes.append("ctaLabel")

    # CTA Heading
    if "heading" in cf:
        new_content, found = replace_literal(
            content,
            "text=\"Let's engineer together.\"",
            f"text=\"{cf['heading']}\"",
        )
        if found:
            content = new_content
            changes.append("ctaHeading")

    # Copy Hint
    if "copy hint" in cf:
        new_content, found = replace_literal(
            content,
            'text="Click to copy email address instantly."',
            f'text="{cf["copy hint"]}"',
        )
        if found:
            content = new_content
            changes.append("copyHint")

    # Secondary Text
    if "secondary text" in cf:
        new_content, found = replace_literal(
            content,
            'text="Whether you have a detailed specification or just want to explore possibilities, connect instantly."',
            f'text="{cf["secondary text"]}"',
        )
        if found:
            content = new_content
            changes.append("secondaryText")

    # Built With Note
    if "built with note" in cf:
        new_content, found = replace_literal(
            content,
            "Built with absolute design devotion.",
            cf["built with note"],
        )
        if found:
            content = new_content
            changes.append("builtWithNote")

    if changes:
        path.write_text(content)

    return changes


def main() -> int:
    """Main entry point. Returns process exit code."""
    if not COPY_FILE.exists():
        print(f"Error: {COPY_FILE.name} not found at {COPY_FILE}")
        return 1

    content = COPY_FILE.read_text()
    data = parse_copy_md(content)

    print(f"Parsed {COPY_FILE.name}:")
    print(f"  - Site:        {len(data['site'])} fields")
    print(f"  - Navigation:  {len(data['navigation'])} fields")
    print(f"  - Hero:        {len(data['hero'])} fields")
    print(f"  - Skills top:  {len(data['skills']['top'])} items")
    print(f"  - Skills bot:  {len(data['skills']['bottom'])} items")
    print(f"  - About quote: {'yes' if data['about'].get('quote') else 'no'}")
    print(f"  - About vals:  {len(data['about']['values'])} pairs")
    print(f"  - About bios:  {len(data['about']['bios'])}")
    print(f"  - Work:        {len(data['work'])} fields")
    print(f"  - Projects:    {len(data['projects'])}")
    print(f"  - Contact/Footer: {len(data['contact_footer'])} fields")
    print()

    print("Applying updates:")
    summary: list[tuple[str, list[str]]] = []

    for label, fn in (
        ("src/data/site.ts", update_site),
        ("src/data/skills.ts", update_skills),
        ("src/data/projects.ts", update_projects),
        ("Hero.tsx", update_hero),
        ("About.tsx", update_about),
        ("Work.tsx", update_work),
        ("Contact.tsx", update_contact),
        ("Footer.tsx", update_footer),
    ):
        changes = fn(data)
        summary.append((label, changes))
        if changes:
            print(f"  ✓ {label}: {', '.join(changes)}")
        else:
            print(f"  - {label}: no changes")

    total = sum(len(c) for _, c in summary)
    print(f"\nDone. Applied {total} update(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
