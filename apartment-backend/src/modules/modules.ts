import { DynamicModule, Logger, Module } from '@nestjs/common';
import { glob } from 'glob';

/**
 * Dynamically loads and imports NestJS modules from the file system
 * @returns Promise containing array of dynamic modules
 */
async function loadModules(): Promise<DynamicModule[]> {
  try {
    // Find all files ending with .module.ts using glob pattern
    let files = await glob('**/*.module.ts', {
      ignore: [
        'node_modules/**',
        'src/libs/**',
        'src/configs/**',
        'src/app.module.ts',
        'dist/**',
        'test/**',
      ],
      absolute: true,
      nodir: true,
    });

    // Extract module paths by removing base path and .ts extension
    files = files.map((e) =>
      e.split(e.includes('/') ? 'modules/' : 'modules\\')[1].replace('.ts', ''),
    );

    // Dynamically import each module file
    const imports = await Promise.all(
      files.map(async (file) => {
        try {
          return await import('./' + file);
        } catch (error) {
          Logger.warn(`Failed to import module: ${file}`, 'Dynamic import');
          return null;
        }
      }),
    );

    // Filter valid modules and extract module definitions
    const dynamicModules = imports
      .filter((mod) => mod !== null)
      .map((mod) => {
        const moduleExport = Object.values(mod).find(
          (exp: Function | { module: DynamicModule }) =>
            typeof exp === 'function' || exp?.module !== undefined,
        );
        if (!moduleExport) {
          Logger.warn('No valid module export found', 'Dynamic import');
          return null;
        }
        return moduleExport as DynamicModule;
      })
      .filter((mod) => mod !== null);

    Logger.log(
      `Loaded ${dynamicModules.length} modules ⚡️⚡️⚡️⚡️⚡️⚡️`,
      'Dynamic import',
    );
    return dynamicModules;
  } catch (error) {
    Logger.error('Error loading modules:', error);
    throw error;
  }
}

/**
 * Dynamic module loader class that registers all discovered modules
 */
@Module({})
export class DynamicModules {
  /**
   * Registers all dynamically loaded modules
   * @returns Promise containing dynamic module configuration
   */
  static async register(): Promise<DynamicModule> {
    const modules = await loadModules();
    return {
      module: DynamicModules,
      imports: modules,
      global: true,
    };
  }
}
