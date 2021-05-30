# Contributing

The backend image generator located in [/api/index.ts](/api/index.ts)

Vercel handles [routing](/vercel.json) in an elegant way for us so deployment is easy.

To start hacking, do the following:

1. Clone this repo with `git clone https://github.com/felipeqq2/custom-og-image`
2. Change directory with `cd custom-og-image`
3. Run `yarn` or `npm install` to install all dependencies
4. Run locally with `vercel dev` and visit [localhost:3000](http://localhost:3000) (if nothing happens, run `npm install -g vercel`)
5. If necessary, edit the `exePath` in [options.ts](api/lib/options.ts) to point to your local Chrome executable

Now you're ready to start local development!

You can set an environment variable to assist with debugging `export OG_HTML_DEBUG=1`. This will render the image as HTML so you can play around with your browser's dev tools before committing changes to the template.
