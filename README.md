# Cubing Competition (Next.js)

This is [Cubing Competition repository](https://github.com/Cro-Cube-Comp/Cubing-competition) rewritten in [Next.js](https://nextjs.org/).

## Getting Started

You have to have [pnpm](https://pnpm.io/) installed.

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:2500](http://localhost:2500) with your browser to see the result.

## Before commiting

You should run `pnpm check` before commiting.

After you have fixed all errors in terminal, then run:

```bash
pnpm preview
```

And if there are no errors, you can commit.

## Environment variables

Create a `.env` file in the root directory of the project and add the following variables:

- `SHOW_TOOLBAR` - Determines if the toolbar is forced to be shown to all users (even non-admins). Set to `true` to enable.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
