# Imoblr Apps

## 🔦 About

The centralized monorepo for the Imoblr apps.
This monorepo contains all the consumer apps and required shared components for all Imoblr apps on all platforms (web, mobile, desktop).

## 📦 Core packages

- [🖥️ NextJS](https://tamagui.dev): Core JS framework central to the web app experience
- [📱 Expo](https://expo.dev): Hybrid Mobile framework that is core for the mobile app experience
- [🎨 Tamagui](https://tamagui.dev): Cross-platform UI library/engine
- [⛓️ Solito](https://solito.dev): Cross-platform navigation logic. Makes sure Next and Expo apps are navigable on all platforms.
- [💾 Tanstack Query](https://tanstack.com/query): JS library for managing data and state in React apps

## 🗂 Folder structure

The main apps are:

- `apps/mobile` (Native mobile app)
- `apps/web` (Web (Nextjs) app)

- `packages` shared packages across apps
  - `ui` includes your custom UI kit that will be optimized by Tamagui
  - `shared` you'll be importing most files from `shared/`
    - `features` (don't use a `screens` folder. organize by feature.)
    - `provider` (all the providers that wrap the app, and some no-ops for Web.)

You can add other folders inside of `packages/` if you know what you're doing and have a good reason to.

## Installing dependencies
- [1. Install Bun](https://bun.sh/docs/installation)
- 2. Run `bun install` to install all dependencies

## Starting the app for development

To see debug output to verify the compiler, add `// debug` as a comment to the top of any file.

### Web
- Run: `bun run dev:web` 

### IOS
- Run: `bun run dev:ios`

### Android
- Run: `bun run dev:android`

### Desktop
- Coming soon

## UI Kit

Note we're following the [design systems guide](https://tamagui.dev/docs/guides/design-systems) and creating our own package for components.

See `packages/ui` named `@imoblr/ui` for how this works.
