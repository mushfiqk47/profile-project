/**
 * split_figma_specs.js
 * Splits figma_design_specs.json into individual section files
 * inside a new folder: figma_design_sections/
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, 'figma_design_specs.json');
const OUTPUT_DIR = path.join(__dirname, 'figma_design_sections');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Created directory: figma_design_sections/`);
}

// Parse the source file
console.log('📖 Reading figma_design_specs.json...');
const raw = fs.readFileSync(SOURCE_FILE, 'utf8');
const data = JSON.parse(raw);

// --- 1. metadata.json ---
const metadataSection = {
  schemaVersion: data.schemaVersion,
  projectName: data.projectName,
  documentTitle: data.documentTitle,
  targetPlatform: data.targetPlatform,
  metadata: data.metadata,
};
fs.writeFileSync(
  path.join(OUTPUT_DIR, '01_metadata.json'),
  JSON.stringify(metadataSection, null, 2),
  'utf8'
);
console.log('✅ Created: 01_metadata.json');

// --- 2. global_tokens.json ---
const globalTokensSection = {
  _section: 'Global Design Tokens',
  _description: 'Colors, typography, spacing, shadows, borders, and z-index tokens used across the entire design system.',
  global_tokens: data.global_tokens,
};
fs.writeFileSync(
  path.join(OUTPUT_DIR, '02_global_tokens.json'),
  JSON.stringify(globalTokensSection, null, 2),
  'utf8'
);
console.log('✅ Created: 02_global_tokens.json');

// --- 3-N. figma_layout sub-sections ---
if (data.figma_layout) {
  const layout = data.figma_layout;
  const layoutKeys = Object.keys(layout);
  console.log(`\n📐 Found ${layoutKeys.length} layout sections: ${layoutKeys.join(', ')}\n`);

  // Write the full layout wrapper with frame info (non-children keys)
  const layoutMeta = {};
  for (const key of layoutKeys) {
    if (key !== 'children') {
      layoutMeta[key] = layout[key];
    }
  }
  const layoutMetaSection = {
    _section: 'Figma Layout Root',
    _description: 'Root frame dimensions, background, and layout mode for the entire Figma document.',
    figma_layout_meta: layoutMeta,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, '03_layout_root.json'),
    JSON.stringify(layoutMetaSection, null, 2),
    'utf8'
  );
  console.log('✅ Created: 03_layout_root.json');

  // Split children into individual files
  if (Array.isArray(layout.children)) {
    layout.children.forEach((child, index) => {
      const fileIndex = String(index + 4).padStart(2, '0');
      const sectionName = (child.name || child.id || `section_${index}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const sectionFile = {
        _section: child.name || `Section ${index + 1}`,
        _description: `Layout specification for the "${child.name || `Section ${index + 1}`}" frame/group.`,
        _parent: 'figma_layout',
        _childIndex: index,
        component: child,
      };

      const filename = `${fileIndex}_${sectionName}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(sectionFile, null, 2),
        'utf8'
      );
      console.log(`✅ Created: ${filename}`);
    });
  } else if (layout.children && typeof layout.children === 'object') {
    // If children is an object (keyed), split by key
    Object.entries(layout.children).forEach(([key, child], index) => {
      const fileIndex = String(index + 4).padStart(2, '0');
      const sectionName = key.toLowerCase().replace(/[^a-z0-9]+/g, '_');

      const sectionFile = {
        _section: key,
        _description: `Layout specification for the "${key}" section.`,
        _parent: 'figma_layout.children',
        _key: key,
        component: child,
      };

      const filename = `${fileIndex}_${sectionName}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(sectionFile, null, 2),
        'utf8'
      );
      console.log(`✅ Created: ${filename}`);
    });
  }
}

// --- INDEX file ---
const allFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
const index = {
  _description: 'Index of all figma design spec section files. Each file contains a focused subset of the full design specification.',
  _source: 'figma_design_specs.json',
  _generatedAt: new Date().toISOString(),
  sections: allFiles.map(f => ({
    file: f,
    path: `./figma_design_sections/${f}`,
  })),
};
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'index.json'),
  JSON.stringify(index, null, 2),
  'utf8'
);
console.log('\n✅ Created: index.json (master index of all sections)');
console.log(`\n🎉 Done! ${allFiles.length + 1} files created in figma_design_sections/`);
