const path = require('path')
const { productName } = require('./package.json')

const appPath = path.resolve(process.cwd(), `out/${productName}-darwin-x64/${productName}.app`)

module.exports = {
  packagerConfig: { icon: 'assets/Icon.icns', executableName: productName },
  makers: [
    // { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
    { name: '@electron-forge/maker-squirrel', config: { name: 'Typeclient' } },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Typeclient',
        overwrite: true,
        format: 'ULFO',
        iconSize: 128,
        background: './assets/dmgBackground.png',
        contents: [
          { x: 463, y: 224, type: 'link', path: '/Applications' },
          { x: 187, y: 224, type: 'file', path: appPath },
          { x: 700, y: 900, type: 'position', path: '.background' },
          { x: 700, y: 900, type: 'position', path: '.VolumeIcon.icns' },
        ],
      },
    },
    { name: '@electron-forge/maker-deb', config: {} },
    { name: '@electron-forge/maker-rpm', config: {} },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.tsx',
              name: 'main_window',
            },
            {
              html: './src/about.html',
              js: './src/aboutRenderer.tsx',
              name: 'about_window',
            },
          ],
        },
      },
    ],
  ],
}
