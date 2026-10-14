// Dynamisches Modul: DatabaseModule.forRoot({ file }) / .forRootAsync({ useFactory })
// ConfigurableModuleBuilder erzeugt beide Varianten samt Options-Token.

import {
  ConfigurableModuleBuilder,
  Inject,
  Logger,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';

export interface DatabaseOptions {
  file: string;
}

// Injection Token für die Verbindung – Repositories hängen nur davon ab
export const DATABASE = Symbol('DATABASE');

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DatabaseOptions>()
    .setClassMethodName('forRoot')
    .setExtras({ isGlobal: true }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();

@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: DatabaseOptions) => {
        const db = new DatabaseSync(options.file);
        db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
        return db;
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule
  extends ConfigurableModuleClass
  implements OnApplicationShutdown
{
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@Inject(DATABASE) private readonly db: DatabaseSync) {
    super();
  }

  onApplicationShutdown(signal?: string) {
    this.db.close();
    this.logger.log(`Datenbank geschlossen (${signal ?? 'close'})`);
  }
}
