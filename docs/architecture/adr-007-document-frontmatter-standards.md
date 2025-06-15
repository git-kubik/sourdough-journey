---
title: "ADR-007: Document Frontmatter Standards"
date: "2025-06-15"
author: "MaK & CodeCrust"
tags: ["adr", "architecture", "frontmatter", "documentation", "standards", "metadata"]
category: "Architecture"
description: "Standard for YAML frontmatter in all documentation files with security considerations"
---

# ADR-007: Document Frontmatter Standards

## Status
Accepted

## Date
2025-06-15

## Context
As our documentation grows, we need consistent metadata across all documents to:
- Provide clear authorship and dating information
- Enable better content organization and filtering
- Support potential future automation and tooling
- Maintain professional documentation standards
- Ensure accountability and traceability

However, we must be careful not to include sensitive information that could:
- Expose internal infrastructure details
- Reveal security-sensitive configuration
- Leak personal or confidential information
- Create security vulnerabilities

## Decision
All documentation files will include YAML frontmatter with relevant metadata, excluding any information that should remain private.

**Required Frontmatter Fields:**
```yaml
---
title: "Document Title"
date: "YYYY-MM-DD"
author: "Author Name or Pseudonym"
tags: ["tag1", "tag2", "tag3"]
---
```

**Optional Fields:**
```yaml
series: "Series Name"
part: "Part Number"
category: "Category Name"
description: "Brief description"
```

**Prohibited Information:**
- IP addresses, hostnames, or network details
- Passwords, tokens, or credentials
- Internal server names or infrastructure details
- Personal email addresses or contact information
- Security configurations or sensitive technical details
- Real names if pseudonyms are preferred

## Consequences

### Positive
- **Consistency**: Standardized metadata across all documents
- **Traceability**: Clear authorship and dating for all content
- **Organization**: Better content categorization and series management
- **Professionalism**: More professional appearance and structure
- **Future-Proofing**: Enables future tooling and automation
- **SEO**: Better search engine optimization with structured metadata
- **Navigation**: Improved site navigation and content discovery

### Negative
- **Overhead**: Additional work required for each document
- **Maintenance**: Need to keep frontmatter current and accurate
- **Complexity**: More complex document structure
- **Enforcement**: Requires process to ensure compliance

### Risks
- Accidental inclusion of sensitive information in frontmatter
- Inconsistent application across different authors
- Outdated metadata if not properly maintained
- Over-documentation leading to decreased productivity

### Mitigation Strategies
- **Review Process**: All documents reviewed before publication
- **Templates**: Provide standard templates with appropriate frontmatter
- **Guidelines**: Clear documentation of what to include/exclude
- **Automation**: Potential future tooling to validate frontmatter
- **Training**: Ensure all contributors understand the standards