export default {
  ios: {
    SPMPackages: [
      // DEBUGMASSIF=1 links the SDK built from source, as android does (carto: scripts/ios-dev/build-plugin-catalyst.sh)
      process.env.DEBUGMASSIF
        ? { name: 'massifmaps-sdk', libs: ['MassifMaps'], path: process.env.MASSIF_SPM_LOCAL || '/Volumes/dev/carto/mobile-sdk/build/spm-local' }
        : {
            name: 'massifmaps-sdk',
            libs: ['MassifMaps'],
            repositoryURL: 'https://github.com/massif-maps/MassifMaps-ios-swift.git',
            version: '6.1.2',
          },
      {
        name: 'massifmaps-SwiftTryCatch-sdk',
        libs: ['SwiftTryCatch'],
        repositoryURL: 'https://github.com/farfromrefug/SwiftTryCatch.git',
        version: '1.0.0',
      },
    ],
  },
}
