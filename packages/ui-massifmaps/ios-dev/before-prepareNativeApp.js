/**
 * iOS counterpart of android's DEBUGMASSIF=1: build the Massif SDK from source before the prepare,
 * into build/spm-local, the folder nativescript.config.ts links when DEBUGMASSIF is set.
 *
 *   DEBUGMASSIF=1 ns run ios
 *
 * MASSIF_SDK_HOME is the SDK checkout (as on android). MASSIF_IOS_TARGET forces simulator, device or catalyst
 * (comma separated to build several). Without it, `--device` in the command line means device, else simulator.
 * Incremental: a no-op xcodebuild when no SDK source changed. Skipped in CI.
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const DEFAULT_SDK_HOME = '/Volumes/dev/massif/massif-sdk';

function massifTargets(env, argv) {
    if (!env.DEBUGMASSIF || env.CI) {
        return [];
    }
    if (env.MASSIF_IOS_TARGET) {
        return env.MASSIF_IOS_TARGET.split(',').map((target) => target.trim()).filter(Boolean);
    }
    return argv.some((arg) => arg === '--device' || arg === '--for-device' || arg === '--forDevice') ? ['device'] : ['simulator'];
}

module.exports = function ($logger, projectData, injector, hookArgs) {
    const platformName = (
        (hookArgs && hookArgs.platformData && hookArgs.platformData.normalizedPlatformName) ||
        (hookArgs && hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.platform) ||
        ''
    ).toLowerCase();
    const targets = platformName === 'ios' ? massifTargets(process.env, process.argv) : [];
    if (!targets.length) {
        return;
    }

    const sdkHome = process.env.MASSIF_SDK_HOME || DEFAULT_SDK_HOME;
    const script = path.join(sdkHome, 'scripts', 'ios-dev', 'build-plugin-spm.sh');
    if (!fs.existsSync(script)) {
        throw new Error(`massif: DEBUGMASSIF is set but ${script} does not exist - set MASSIF_SDK_HOME to the SDK checkout`);
    }

    for (const target of targets) {
        $logger.info(`massif: building the SDK from source for ${target}`);
        const result = spawnSync(script, [target], { cwd: path.dirname(script), stdio: 'inherit' });

        // A failed SDK build must fail the app build: linking the previous binary means debugging stale code.
        if (result.error) {
            throw new Error(`massif: could not run ${script}: ${result.error.message}`);
        }
        if (result.status !== 0) {
            throw new Error(`massif: SDK build failed for ${target} (exit ${result.status})`);
        }
    }
};

module.exports.massifTargets = massifTargets;
