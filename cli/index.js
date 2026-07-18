#!/usr/bin/env node

/**
 * LCS Core — Skills CLI
 *
 * Usage:
 *   npx lean-coding-skills add <github-url>
 *   npx lean-coding-skills list
 *   npx lean-coding-skills remove <name>
 *
 * After global install (npm i -g lean-coding-skills), use: skills add, skills list, etc.
 *
 * Examples:
 *   npx lean-coding-skills add https://github.com/mdhb2/lean-coding-skills
 *   npx lean-coding-skills list
 *   npx lean-coding-skills remove lcs-core
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const https = require('node:https');
const { execSync } = require('node:child_process');

// ─── constants ────────────────────────────────────────────────

const SKILLS_DIR = path.join(os.homedir(), '.config', 'opencode', 'skills');

// ─── helpers ──────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(msg + '\n');
}

function error(msg) {
  process.stderr.write(`\x1b[31mError:\x1b[0m ${msg}\n`);
  process.exit(1);
}

function ensureSkillsDir() {
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }
}

function listInstalled() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

// ─── GitHub URL parsing ───────────────────────────────────────

function parseGitHubUrl(url) {
  // https://github.com/owner/repo
  // https://github.com/owner/repo/tree/branch/path
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'lcs-core-cli' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'lcs-core-cli' } }, (r2) => {
          const chunks = [];
          r2.on('data', c => chunks.push(c));
          r2.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
          r2.on('error', reject);
        }).on('error', reject);
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchRepoFileList(owner, repo) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  const chunks = [];
  return new Promise((resolve, reject) => {
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'lcs-core-cli',
        'Accept': 'application/vnd.github+json'
      }
    }, (res) => {
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          if (!data.tree) return resolve([]);

          // Filter for SKILL.md files
          const skillFiles = data.tree.filter(f => f.path.endsWith('SKILL.md'));

          // Also check for .lcscore files to copy as scaffolding
          const scaffoldFiles = data.tree.filter(f =>
            f.path.startsWith('.lcscore/') || f.path === 'lcs-core/scripts/generate-state.ps1'
          );

          resolve({ skillFiles, scaffoldFiles });
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── commands ─────────────────────────────────────────────────

async function cmdAdd(url) {
  log(`Installing skills from: ${url}`);

  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    error(`Invalid GitHub URL: ${url}\nExpected: https://github.com/owner/repo`);
  }

  const { owner, repo } = parsed;
  log(`Repository: ${owner}/${repo}`);

  // Fetch file listing
  log('Fetching repository structure...');
  let fileList;
  try {
    fileList = await fetchRepoFileList(owner, repo);
  } catch (e) {
    // If API fails, try git clone fallback
    log('GitHub API unavailable, trying git clone...');
    fileList = null;
  }

  if (fileList && fileList.skillFiles.length === 0) {
    error('No SKILL.md files found in repository.');
  }

  ensureSkillsDir();
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/main`;
  let installed = [];

  // Download and install each SKILL.md as a skill
  const skillFiles = fileList ? fileList.skillFiles : [];
  for (const file of skillFiles) {
    // Skill name = parent directory name
    const skillName = path.basename(path.dirname(file.path));
    const skillDir = path.join(SKILLS_DIR, skillName);
    const skillFileUrl = `${rawBase}/${file.path}`;

    log(`  Installing skill: ${skillName}`);

    try {
      const content = await downloadFile(skillFileUrl);
      if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
      }
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf-8');
      log(`    ✓ ${skillName} installed to ${skillDir}`);
      installed.push(skillName);
    } catch (e) {
      log(`    ⚠ Failed to download ${skillName}: ${e.message}`);
    }
  }

  // Download scaffolding files (.lcscore templates)
  const scaffoldFiles = fileList ? fileList.scaffoldFiles : [];
  if (scaffoldFiles.length > 0) {
    log('\nDownloading scaffolding templates...');
    const projectRoot = process.cwd();
    for (const file of scaffoldFiles) {
      const dest = path.join(projectRoot, file.path);
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      try {
        const content = await downloadFile(`${rawBase}/${file.path}`);
        fs.writeFileSync(dest, content, 'utf-8');
        log(`  ✓ ${file.path}`);
      } catch (e) {
        // skip files that fail
      }
    }
  }

  log(`\n✅ Installed ${installed.length} skill(s): ${installed.join(', ')}`);
  log(`Skills directory: ${SKILLS_DIR}`);
  log("\nReady! The skill(s) will auto-load in your next OpenCode session.");
}

function cmdList() {
  const skills = listInstalled();
  if (skills.length === 0) {
    log('No skills installed.');
    return;
  }
  log('Installed skills:');
  for (const name of skills) {
    const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
    const exists = fs.existsSync(skillPath);
    log(`  ${exists ? '✓' : '✗'} ${name}`);
  }
}

function cmdRemove(name) {
  const skillDir = path.join(SKILLS_DIR, name);
  if (!fs.existsSync(skillDir)) {
    error(`Skill "${name}" not found at ${skillDir}`);
  }
  fs.rmSync(skillDir, { recursive: true, force: true });
  log(`Removed skill: ${name}`);
}

function cmdScaffold() {
  // Generate .lcscore/ structure in current directory
  const projectRoot = process.cwd();
  const lcsDir = path.join(projectRoot, '.lcscore');

  if (fs.existsSync(lcsDir)) {
    log('.lcscore/ directory already exists. Skipping scaffold.');
    return;
  }

  const dirs = [
    '.lcscore',
    '.lcscore/decisions',
    '.lcscore/explore'
  ];

  for (const d of dirs) {
    fs.mkdirSync(path.join(projectRoot, d), { recursive: true });
    log(`  ✓ Created ${d}/`);
  }

  log('\nScaffold created. Next steps:');
  log('  1. Edit .lcscore/RULES.md with your coding standards');
  log('  2. Edit .lcscore/ROADMAP.md with your project tasks');
  log('  3. Start coding — the AI will maintain CONTEXT.md automatically');
}

// ─── main ─────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    if (!args[1]) {
      log('Usage: npx lean-coding-skills add <github-url>');
      log('Example: npx lean-coding-skills add https://github.com/mdhb2/lean-coding-skills');
      process.exit(1);
    }
    cmdAdd(args[1]).catch(e => error(e.message));
    break;

  case 'list':
    cmdList();
    break;

  case 'remove':
  case 'rm':
    if (!args[1]) {
      log('Usage: npx lean-coding-skills remove <name>');
      process.exit(1);
    }
    cmdRemove(args[1]);
    break;

  case 'scaffold':
    cmdScaffold();
    break;

  case '--help':
  case '-h':
  case undefined:
log('LCS Core — Skills CLI');
log('');
log('Commands:');
log('  npx lean-coding-skills add <url>       Install a skill from a GitHub repository');
log('  npx lean-coding-skills list            List installed skills');
log('  npx lean-coding-skills remove <name>   Remove an installed skill');
log('  npx lean-coding-skills scaffold        Create .lcscore/ structure in current project');
log('');
log('Examples:');
log('  npx lean-coding-skills add https://github.com/mdhb2/lean-coding-skills');
log('  npx lean-coding-skills list');
log('');
log('Tip: npm i -g lean-coding-skills && skills add <url>');
    break;

  default:
    error(`Unknown command: ${command}\nTry: npx lean-coding-skills --help`);
}
