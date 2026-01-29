import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Discover Canada | Simple",
  tagline:
    "A simple, easy-to-read guide to Discover Canada—key facts, history, government, rights, and responsibilities to help you study for the Canadian citizenship test.",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://minhanhhere.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/discover-canada-short/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "minhanhhere", // Usually your GitHub org/user name.
  projectName: "discover-canada-short", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/minhanhhere/discover-canada-short/tree/main/",
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    // ... Your other themes.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,

        // For Docs using Chinese, it is recomended to set:
        // language: ["en", "zh"],

        // Customize the keyboard shortcut to focus search bar (default is "mod+k"):
        // searchBarShortcutKeymap: "s", // Use 'S' key
        // searchBarShortcutKeymap: "ctrl+shift+f", // Use Ctrl+Shift+F

        // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
        // forceIgnoreNoIndex: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Discover Canada Simple",
      logo: {
        alt: "Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "learnSidebar",
          position: "left",
          label: "Learn",
        },
        {
          label: "Practice",
          to: "/quiz",
          position: "left",
        },
        // External link example
        // {
        //   href: "https://github.com/minhanhhere/discover-canada-short",
        //   label: "GitHub",
        //   position: "right",
        // },
        // Multi-level external links
        {
          type: "dropdown",
          label: "Download",
          position: "right",
          items: [
            {
              label: "Discover Canada (PDF)",
              href: "https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover.pdf",
            },
            {
              label: "Discover Canada | Large-Print (PDF)",
              href: "https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover-large.pdf",
            },
            {
              label: "Discover Canada | EBook (ePub)",
              href: "https://www.canada.ca/content/dam/ircc/documents/epub/en/eng-epub-discover-canada.epub",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Useful Resources",
          position: "right",
          items: [
            {
              label: "The Canadian Experience",
              href: "https://thecanadianexperience.com/",
            },
            {
              label: "Canadian Citizenship Practice Tests",
              href: "https://www.apnatoronto.com/canadian-citizenship-test-practice/",
            },
            {
              label: "Citizenship Counts",
              href: "https://citizenshipcounts.ca/",
            },
            {
              label: "Public Library - Citizenship Questions",
              href: "https://www.yourlibrary.ca/citizenship-test-answer-keys/"
            },
            {
              label: "Free Simulation Test",
              href: "https://www.citizenshipsupport.ca/free-simulation-test/",
            },
            {
              label: "Citizenship Test Prep App (iOS)",
              href: "https://apps.apple.com/app/id6670188387",
            },
            {
              label: "Be Citizen (Paid)",
              href: "https://www.becitizen.ca/",
            },
          ],
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Discover Canada Simple. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
