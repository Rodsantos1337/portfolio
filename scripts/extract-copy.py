#!/usr/bin/env python3
"""Extract copy content from React components and TypeScript data files into COPY.md"""

import re
from pathlib import Path
from html import unescape

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
COMPONENTS_DIR = PROJECT_ROOT / "src" / "components" / "react"
DATA_DIR = PROJECT_ROOT / "src" / "data"

def extract_data_files():
    """Extract content from TypeScript data files."""
    content = {}
    
    # site.ts
    site_file = DATA_DIR / "site.ts"
    if site_file.exists():
        site_content = site_file.read_text()
        content["site"] = {
            "name": extract_string_value(site_content, r'name:\s*"([^"]+)"'),
            "title": extract_string_value(site_content, r'title:\s*"([^"]+)"'),
            "tagline": extract_multiline_string(site_content, r'tagline:\s*"([^"]+)"'),
            "email": extract_string_value(site_content, r'email:\s*"([^"]+)"'),
            "location": extract_string_value(site_content, r'location:\s*"([^"]+)"'),
            "socialLinks": extract_array_of_strings(site_content, "socialLinks", r'label:\s*"([^"]+)"'),
        }
    
    # projects.ts
    projects_file = DATA_DIR / "projects.ts"
    if projects_file.exists():
        projects_content = projects_file.read_text()
        content["projects"] = extract_projects(projects_content)
    
    # skills.ts
    skills_file = DATA_DIR / "skills.ts"
    if skills_file.exists():
        skills_content = skills_file.read_text()
        content["skills"] = {
            "topMarqueeItems": extract_array_of_strings(skills_content, "topMarqueeItems"),
            "bottomMarqueeItems": extract_array_of_strings(skills_content, "bottomMarqueeItems"),
        }
    
    return content

def extract_string_value(content: str, pattern: str) -> str:
    """Extract a single string value using regex."""
    match = re.search(pattern, content)
    return match.group(1) if match else ""

def extract_multiline_string(content: str, pattern: str) -> str:
    """Extract a string that may span multiple lines."""
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""

def extract_array_of_strings(content: str, array_name: str, item_pattern: str = r'"([^"]+)"') -> list:
    """Extract strings from an array constant."""
    array_match = re.search(rf'{array_name}\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return []
    
    array_content = array_match.group(1)
    items = re.findall(item_pattern, array_content)
    return items

def extract_projects(content: str) -> list:
    """Extract project objects with title, description, and meta."""
    projects = []
    project_pattern = r'\{[^}]*id:\s*"([^"]+)"[^}]*title:\s*"([^"]+)"[^}]*description:\s*"([^"]+)"[^}]*imageAlt:\s*"([^"]+)"[^}]*\}'
    
    for match in re.finditer(project_pattern, content, re.DOTALL):
        projects.append({
            "id": match.group(1),
            "title": match.group(2),
            "description": match.group(3),
            "imageAlt": match.group(4),
        })
    
    meta_pattern = r'meta:\s*\[(.*?)\]\s*,?\s*\}\s*,?\s*(?:\{|$|\n\s*\])'
    for i, meta_match in enumerate(re.finditer(meta_pattern, content, re.DOTALL)):
        meta_content = meta_match.group(1)
        meta_items = re.findall(r'\{[\s\S]*?label:\s*"([^"]+)"[\s\S]*?value:\s*"([^"]+)"[\s\S]*?\}', meta_content)
        if i < len(projects):
            projects[i]["meta"] = [{"label": label, "value": value} for label, value in meta_items]
    
    return projects

def extract_reveal_texts(content: str) -> list:
    """Extract all text prop values from RevealText components, handling multiline strings."""
    texts = []
    for match in re.finditer(r'text="([^"]+)"', content):
        texts.append(match.group(1))
    for match in re.finditer(r'text="([^"]*)"', content, re.DOTALL):
        val = match.group(1).strip()
        if val and val not in texts:
            texts.append(val)
    return texts

def clean_text(text: str) -> str:
    """Clean up text by unescaping HTML entities and fixing smart quotes."""
    text = unescape(text)
    text = text.replace("&ldquo;", '"').replace("&rdquo;", '"')
    text = text.replace("&lsquo;", "'").replace("&rsquo;", "'")
    text = text.replace("&mdash;", "—").replace("&ndash;", "–")
    return text

def extract_about_content(content: str) -> dict:
    """Extract About section content with proper ordering."""
    result = {"quote": "", "bios": [], "values": []}
    
    matches = re.findall(r'RevealText[^>]*text="([^"]+)"', content)
    
    if len(matches) > 7:
        result["quote"] = clean_text(matches[7])
    
    result["bios"] = [clean_text(m) for m in matches[8:11] if m]
    
    values = ["Sintra, Portugal"]
    if len(matches) > 2:
        values.append(clean_text(matches[2]))
    if len(matches) > 4:
        values.append(clean_text(matches[4]))
    if len(matches) > 6:
        values.append(clean_text(matches[6]))
    result["values"] = values
    
    return result

def extract_components():
    """Extract text content from React components."""
    content = {}
    
    # Hero section - extract name from heroChars/santosChars
    hero_file = COMPONENTS_DIR / "sections" / "Hero.tsx"
    if hero_file.exists():
        hero_content = hero_file.read_text()
        reveal_texts = extract_reveal_texts(hero_content)
        hero_chars_match = re.search(r'heroChars\s*=\s*"([^"]+)"', hero_content)
        santos_chars_match = re.search(r'santosChars\s*=\s*"([^"]+)"', hero_content)
        hero_name = (hero_chars_match.group(1) + " " + santos_chars_match.group(1)).strip() if hero_chars_match and santos_chars_match else ""
        content["hero"] = {
            "name": hero_name,
            "subtitle": clean_text(reveal_texts[0]) if reveal_texts else "",
        }
    
    # About section
    about_file = COMPONENTS_DIR / "sections" / "About.tsx"
    if about_file.exists():
        about_content = about_file.read_text()
        about = extract_about_content(about_content)
        content["about"] = {
            "quote": about["quote"],
            "bio1": about["bios"][0] if len(about["bios"]) > 0 else "",
            "bio2": about["bios"][1] if len(about["bios"]) > 1 else "",
            "bio3": about["bios"][2] if len(about["bios"]) > 2 else "",
            "values": about["values"],
        }
    
    # Work section
    work_file = COMPONENTS_DIR / "sections" / "Work.tsx"
    if work_file.exists():
        work_content = work_file.read_text()
        reveal_texts = extract_reveal_texts(work_content)
        content["work"] = {
            "sectionLabel": "Selected Projects",
            "heading": clean_text(reveal_texts[0]) if reveal_texts else "",
        }
    
    # Contact section
    contact_file = COMPONENTS_DIR / "sections" / "Contact.tsx"
    if contact_file.exists():
        contact_content = contact_file.read_text()
        label_match = re.search(r'SectionLabel>([^<]+)</SectionLabel>', contact_content)
        section_label = label_match.group(1) if label_match else "Contact"
        c_reveal_texts = re.findall(r'RevealText[^>]*text="([^"]+)"', contact_content)
        content["contact"] = {
            "sectionLabel": section_label,
            "heading": "Let's engineer together.",
            "description": clean_text(c_reveal_texts[0]) if c_reveal_texts else "",
        }
    
    # Navigation
    nav_file = COMPONENTS_DIR / "layout" / "Navigation.tsx"
    if nav_file.exists():
        nav_content = nav_file.read_text()
        content["navigation"] = {
            "cta": "Let's Connect",
            "mobileNavLabel": "Navigation",
        }
    
    # Footer
    footer_file = COMPONENTS_DIR / "layout" / "Footer.tsx"
    if footer_file.exists():
        footer_content = footer_file.read_text()
        f_reveal_texts = re.findall(r'RevealText[^>]*text="([^"]+)"', footer_content)
        content["footer"] = {
            "ctaLabel": f_reveal_texts[0] if len(f_reveal_texts) > 0 else "",
            "ctaHeading": f_reveal_texts[1] if len(f_reveal_texts) > 1 else "",
            "copyHint": f_reveal_texts[2] if len(f_reveal_texts) > 2 else "",
            "secondaryText": f_reveal_texts[3] if len(f_reveal_texts) > 3 else "",
            "backToTop": "Back to top",
            "builtWith": "Built with absolute design devotion.",
        }
    
    # ProjectCard
    projectcard_file = COMPONENTS_DIR / "ui" / "ProjectCard.tsx"
    if projectcard_file.exists():
        content["projectCard"] = {
            "exploreButton": "Explore Project",
        }
    
    # Toast
    toast_file = COMPONENTS_DIR / "layout" / "Toast.tsx"
    if toast_file.exists():
        content["toast"] = {
            "copyMessage": "Address copied beautifully to your clipboard!",
        }
    
    return content

def generate_copy_md(data: dict, components: dict) -> str:
    """Generate the COPY.md content."""
    lines = ["# Website Copy", ""]
    
    lines.append("## Site Configuration")
    site = data.get("site", {})
    lines.append(f"- **Name**: {site.get('name', '')}")
    lines.append(f"- **Title**: {site.get('title', '')}")
    lines.append(f"- **Tagline**: {clean_text(site.get('tagline', ''))}")
    lines.append(f"- **Email**: {site.get('email', '')}")
    lines.append(f"- **Location**: {site.get('location', '')}")
    lines.append("")
    
    lines.append("## Navigation")
    nav = components.get("navigation", {})
    lines.append(f"- **Work Label**: Selected Work")
    lines.append(f"- **CTA**: {nav.get('cta', '')}")
    lines.append("")
    
    lines.append("## Hero Section")
    hero = components.get("hero", {})
    lines.append(f"- **Name**: {hero.get('name', '')}")
    lines.append(f"- **Subtitle**: {hero.get('subtitle', '')}")
    lines.append("")
    
    lines.append("## Skills / Marquee")
    skills = data.get("skills", {})
    if skills.get("topMarqueeItems"):
        lines.append("### Top Band")
        for item in skills["topMarqueeItems"]:
            lines.append(f"- {item}")
    if skills.get("bottomMarqueeItems"):
        lines.append("### Bottom Band")
        for item in skills["bottomMarqueeItems"]:
            lines.append(f"- {item}")
    lines.append("")
    
    lines.append("## About Section")
    about = components.get("about", {})
    lines.append(f"- **Quote**: {about.get('quote', '')}")
    values = about.get("values", [])
    label_names = ["Operational Location", "Expertise Focus", "Current Direction", "Availabilities"]
    for i, (name, value) in enumerate(zip(label_names, values)):
        lines.append(f"  - **{name}**: {value}")
    lines.append(f"- **Bio 1**: {about.get('bio1', '')}")
    lines.append(f"- **Bio 2**: {about.get('bio2', '')}")
    lines.append(f"- **Bio 3**: {about.get('bio3', '')}")
    lines.append("")
    
    lines.append("## Work Section")
    work = components.get("work", {})
    lines.append(f"- **Section Label**: {work.get('sectionLabel', '')}")
    lines.append(f"- **Heading**: {work.get('heading', '')}")
    lines.append("")
    
    lines.append("## Projects")
    projects = data.get("projects", [])
    for project in projects:
        lines.append(f"### {project.get('title', project.get('id', ''))}")
        lines.append(f"- **Description**: {clean_text(project.get('description', ''))}")
        meta = project.get("meta", [])
        for item in meta:
            lines.append(f"  - **{item['label']}**: {item['value']}")
        lines.append("")
    
    lines.append("## Contact Section")
    contact = components.get("contact", {})
    lines.append(f"- **Section Label**: {contact.get('sectionLabel', '')}")
    lines.append(f"- **Heading**: {contact.get('heading', '')}")
    lines.append(f"- **Description**: {contact.get('description', '')}")
    lines.append("")
    
    lines.append("## Footer")
    footer = components.get("footer", {})
    lines.append(f"- **CTA Label**: {footer.get('ctaLabel', '')}")
    lines.append(f"- **CTA Heading**: {footer.get('ctaHeading', '')}")
    lines.append(f"- **Copy Hint**: {footer.get('copyHint', '')}")
    lines.append(f"- **Secondary Text**: {footer.get('secondaryText', '')}")
    lines.append(f"- **Back to Top**: {footer.get('backToTop', '')}")
    lines.append(f"- **Built With Note**: {footer.get('builtWith', '')}")
    lines.append("")
    
    lines.append("## UI Components")
    pc = components.get("projectCard", {})
    lines.append(f"- **Explore Project Button**: {pc.get('exploreButton', '')}")
    
    return "\n".join(lines)

def main():
    """Main entry point."""
    data = extract_data_files()
    components = extract_components()
    
    copy_content = generate_copy_md(data, components)
    
    output_path = PROJECT_ROOT / "COPY.md"
    output_path.write_text(copy_content)
    print(f"COPY.md generated at {output_path}")

if __name__ == "__main__":
    main()