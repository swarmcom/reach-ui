# Reach UI

The attemt to rewrite Reach UI with a modern JavaScript toolchain:

* [ES2015](https://babeljs.io/docs/plugins/preset-es2016)
* [VueJS](https://vuejs.org)
* [Bootstrap 4](https://getbootstrap.com)
* [Bootstrap Vue](https://bootstrap-vue.js.org)

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build
```

## Deployment

There are two branches: one for feature prototyping (jamhed-devel), and another (master) to make it look closer to the old UI. Both of them are deployed to docker host as [devel](https://docker.ezuce.com) and [master](https://reach3.ezuce.com).

