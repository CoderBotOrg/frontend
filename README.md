# vue-app

> Coderbot web app in Vue.js

## Quickstart

Run the backend in stub mode, following the instructions [here](https://github.com/CoderBotOrg/coderbot/blob/develop/README.md).

Once the backend is online:

```bash
git clone https://github.com/CoderBotOrg/vue-app.git
cd vue-app
npm install
npm run dev
```

By default, the build configuration assumes you have the backend available at `localhost:5000`. Change the `CB_ENDPOINT` value according to your setup (e.g. different location, production, static ip of a real RPi running the backend) in the `config/dev.eng.js` file.

To serve in production, change `CB_ENDPOINT` to `'""'` and

```bash
# build the web application
npm run build
# move the produced folder in the backend
mv dist ../coderbot/
```

At this point, the Flask backend serves the built application at `/vue`.

Another build value you may want to edit it's `assetsPublicPath` in `config/index.js`, which allows to serve the application from a subfolder.