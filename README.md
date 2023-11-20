**Work with [lint-staged](https://github.com/lint-staged/lint-staged), run tsc on staged files and output the result of staged-only files.**

**⚠️ ONLY TESTED ON TYPESCRIPT 5**

## Setup

- Install [lint-staged](https://github.com/lint-staged/lint-staged), follow the instructions.

- Install tslint, use:

  ```bash
  npm i -D @hong97/tslint
  ```

- In package.json, add tslint to `*.ts`, `*.tsx` files.

  ```json
  "lint-staged": {
    "*.{ts,tsx}": [
      "tslint"
    ]
  },
  ```

- Use [Husky](https://github.com/typicode/husky) or other methods to set up your git 'pre-commit' hooks.

- Now, TypeScript will be checked at commit staged.


## Configuration

Create a file named `tslintconfig.js` in your root directory:

```js
module.exports = {
  alwaysInclude: [
    // always included in tsc process no matter these files are staged or not
  ],
  ignore: [
    // use glob pattern, see more: https://www.npmjs.com/package/minimatch
  ],
};
```

You can also set up a callback hook in config file:

```js
module.exports = {
  onFinish: (result) => {
    // ...
  } 
};
```

The callback will be invoked after tslint finish running and the results will be passed through.

