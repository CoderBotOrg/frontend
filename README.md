# vue-app
![Build](https://github.com/CoderBotOrg/frontend/actions/workflows/build.yml/badge.svg)

> CoderBot is a RaspberryPI-based programmable robot for educational purposes. Check the [project website](https://www.coderbot.org) for more information.
>
> For further information about development and technical documentation, see the [Wiki](https://github.com/CoderBotOrg/coderbot/wiki).

This is the new CoderBot client application, in Vue.js.

It exposes settings, a Blockly development environment, persistence and the ability to customise the UI and the _Activities_ proposed to the student.

Check the [project website](https://www.coderbot.org) for more information.


## Quickstart

Run the backend, following the instructions [here](https://github.com/CoderBotOrg/coderbot/blob/develop/README.md).

Once the backend is online:

```bash
git clone https://github.com/CoderBotOrg/vue-app.git
cd vue-app
npm install
npm run dev
```

By default, the (development) build configuration assumes you have the backend available at `localhost:5000`. Change the `CB_ENDPOINT` value according to your setup (e.g. different location, production, static ip of a real RPi running the backend) in the `config/dev.env.js` file.

While in production environment, it assumes you are serving the vue app from the backend, thus having `CB_ENDPOINT` to a blank string.

```bash
# build the web application
npm run build
# move the produced folder in the backend
mv dist ../coderbot/
```

At this point, run the backend and Flask will serve the built Vue app at `/vue`.

Another build value you may want to edit it's `assetsPublicPath` in `config/index.js`, which allows to serve the application from a subfolder.

## Acknowledgments

I'd like to sincere thank [uki](https://uki.nz/cv), cb109, Kael, ivansieder, Lloyd for helping me with vuejs/vuex/vuetify/javascript and providing appreciated insights and context.
