# 📝 Blog Article Generation Workflow

This guide helps you quickly generate new Excel tutorial blog posts using standardized templates.

## 🚀 Quick Start

### Option 1: Using Node.js Script (Recommended)
```bash
node generate-blog.js sumif 2025-01-21
```

### Option 2: Using Windows Batch File
```cmd
generate-blog.bat sumif 2025-01-21
```

### Option 3: Using Bash Script (Linux/Mac)
```bash
./generate-blog.sh sumif 2025-01-21
```

## 📋 Step-by-Step Process

### 1. Generate Initial Article
Run one of the commands above to create a new article file in `content/blog/`

### 2. Edit the Generated File
Open the created `.mdx` file and replace these placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `[NUMBER]` | Number of tips/examples | `15` |
| `[category]` | Function category | `lookup`, `math`, `text` |
| `[specific keywords]` | SEO keywords | `vlookup tutorial`, `excel lookup` |
| `[key features]` | Main features list | `exact match, approximate match, wildcards` |
| `[brief description]` | Summary description | `perform powerful lookup operations` |

### 3. Content Structure Template

Every article follows this proven structure:

```
1. Hero Section with Quick Summary
2. Table of Contents
3. What is the Function? (Introduction)
4. Basic Syntax and Parameters
5. Simple Examples (3-4 basic examples)
6. Advanced Techniques (3-5 advanced scenarios)
7. Common Mistakes and Solutions
8. Real-World Applications
9. Downloadable Templates
10. Pro Tips
11. FAQ Section
12. Next Steps & Related Functions
13. Summary & CTA
```

## 📊 Content Guidelines

### Writing Style
- **Conversational but professional**
- **Action-oriented headings**
- **Practical examples over theory**
- **Visual hierarchy with emojis and formatting**

### SEO Requirements
- **Title**: 50-60 characters
- **Description**: 120-155 characters
- **Keywords**: 5-8 relevant keywords
- **Reading time**: 8-15 minutes
- **Word count**: 2000-3500 words

### Content Elements to Include
- ✅ Code examples with syntax highlighting
- ✅ Step-by-step instructions
- ✅ Common mistakes section
- ✅ Downloadable resources
- ✅ FAQ section
- ✅ Related function suggestions
- ✅ Call-to-action to SheetAlly tools

## 🎯 Popular Excel Functions to Cover

### High-Priority Functions
1. **VLOOKUP** - Most searched Excel function
2. **SUMIF/SUMIFS** - Conditional calculations
3. **INDEX/MATCH** - Advanced lookup alternative
4. **COUNTIF/COUNTIFS** - Conditional counting
5. **IF/IFS** - Logical operations
6. **PIVOT TABLES** - Data analysis
7. **CONCATENATE/TEXTJOIN** - Text manipulation
8. **DATE/TIME** functions - Date calculations
9. **XLOOKUP** - New lookup function
10. **FILTER** - Dynamic arrays

### Content Calendar Suggestions
- **Monday**: Basic functions (SUM, AVERAGE, COUNT)
- **Tuesday**: Lookup functions (VLOOKUP, INDEX/MATCH)
- **Wednesday**: Conditional functions (IF, SUMIF, COUNTIF)
- **Thursday**: Text functions (LEFT, RIGHT, MID, CONCATENATE)
- **Friday**: Advanced topics (Pivot Tables, Macros, Power Query)

## 🛠 File Structure

```
content/blog/
├── _TEMPLATE.md                     # Master template (Markdown)
├── excel-sumif-complete-guide-2025.md
├── excel-vlookup-complete-guide-2025.md
└── ...

generate-blog.js                     # Node.js generator
generate-blog.bat                    # Windows batch generator
generate-blog.sh                     # Bash generator
```

## ⚡ Automation Tips

### Add to package.json
```json
{
  "scripts": {
    "blog:new": "node generate-blog.js",
    "blog:sumif": "node generate-blog.js sumif",
    "blog:vlookup": "node generate-blog.js vlookup"
  }
}
```

### Daily Workflow
1. Choose function from priority list
2. Run: `npm run blog:new [function] [date]`
3. Edit generated file (30-45 minutes)
4. Add specific examples and screenshots
5. Review SEO elements
6. Publish

## 📈 Content Quality Checklist

Before publishing, ensure:

- [ ] Title is 50-60 characters
- [ ] Description is 120-155 characters
- [ ] All placeholders are replaced
- [ ] 3+ practical examples included
- [ ] Common mistakes section completed
- [ ] FAQ section has 3+ questions
- [ ] Related functions suggested
- [ ] Call-to-action included
- [ ] Reading time is accurate
- [ ] All links work
- [ ] Images/screenshots added (if applicable)

## 🔧 Customization

### Modify Template
Edit `content/blog/_TEMPLATE.mdx` to:
- Add new sections
- Change writing style
- Update SEO structure
- Modify metadata fields

### Create Function-Specific Templates
For functions with unique structures:
```bash
cp content/blog/_TEMPLATE.mdx content/blog/_TEMPLATE_PIVOT.mdx
# Customize for Pivot Table articles
```

## 📞 Support

Need help with the blog generation workflow? Check:
1. Template file exists: `content/blog/_TEMPLATE.mdx`
2. Content directory exists: `content/blog/`
3. Script permissions (for bash): `chmod +x generate-blog.sh`

Happy blogging! 🎉
