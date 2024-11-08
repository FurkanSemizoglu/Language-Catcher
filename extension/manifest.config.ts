import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(() => ({
  manifest_version: 3,
  name: 'Language Catcher Extension',
  description: 'A simple extension to catch languages',

  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,

  action: {
    /* default_popup: 'index.html', */ //path to the HTML file
    default_icon: 'src/images/history16.png' // icon for the image
  },
  permissions: ["activeTab" , "tabs" , "scripting" , "background" , "storage"],
  background: {
    service_worker: 'src/background.ts'
  },
  host_permissions: [
    "http://*/*",
    "https://*/*",
    "*://*/*"
  ],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content.ts'],
      run_at: "document_start"
    }
  ],
  web_accessible_resources: [
    {
      resources: ["index.html"],
      matches: ["<all_urls>"]
    }
  ]/* ,
  externally_connectable: {
    matches: ["http://localhost:5175/" ]
  }  */
}))
