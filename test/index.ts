import { WebSocketAdaptor } from '@nestia/core';
import { DynamicExecutor } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { NestFactory } from '@nestjs/core';
import commander from 'commander';
import * as inquirer from 'inquirer';
import { AppModule } from '../src/app.module';
import { GlobalConfig } from '../src/global.config';
import { test_api_create_user } from './features/auth/test_api_create_user';

/**
 * 실행 옵션 파서
 */
export namespace ArgumentParser {
  export type Inquiry<T> = (
    command: commander.Command,
    prompt: (opt?: inquirer.StreamOptions) => inquirer.PromptModule,
    action: (closure: (options: Partial<T>) => Promise<T>) => Promise<T>,
  ) => Promise<T>;

  export interface Prompt {
    select: (name: string) => (message: string) => <Choice extends string>(choices: Choice[]) => Promise<Choice>;
    boolean: (name: string) => (message: string) => Promise<boolean>;
    number: (name: string) => (message: string, init?: number) => Promise<number>;
  }

  export const parse = async <T>(
    inquiry: (
      command: commander.Command,
      prompt: Prompt,
      action: (closure: (options: Partial<T>) => Promise<T>) => Promise<T>,
    ) => Promise<T>,
  ): Promise<T> => {
    // TAKE OPTIONS
    const action = (closure: (options: Partial<T>) => Promise<T>) =>
      new Promise<T>((resolve, reject) => {
        commander.program.action(async (options) => {
          try {
            resolve(await closure(options));
          } catch (exp) {
            reject(exp);
          }
        });
        commander.program.parseAsync().catch(reject);
      });

    const select =
      (name: string) =>
      (message: string) =>
      async <Choice extends string>(choices: Choice[]): Promise<Choice> =>
        (
          await inquirer.createPromptModule()({
            type: 'list',
            name,
            message,
            choices,
          })
        )[name];
    const boolean = (name: string) => async (message: string) =>
      (
        await inquirer.createPromptModule()({
          type: 'confirm',
          name,
          message,
        })
      )[name] as boolean;
    const number = (name: string) => async (message: string, init?: number) => {
      const value = Number(
        (
          await inquirer.createPromptModule()({
            type: 'number',
            name,
            message,
          })
        )[name],
      );
      return init !== undefined && isNaN(value) ? init : value;
    };

    const output: T | Error = await (async () => {
      try {
        return await inquiry(commander.program, { select, boolean, number }, action);
      } catch (error) {
        return error as Error;
      }
    })();

    // RETURNS
    if (output instanceof Error) throw output;
    return output;
  };
}

interface IOptions {
  include?: string[];
  exclude?: string[];
}

/**
 * 옵션 getter
 */
const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, _prompt, action) => {
    // command.option("--mode <string>", "target mode");
    // command.option("--reset <true|false>", "reset local DB or not");
    command.option('--include <string...>', 'include feature files');
    command.option('--exclude <string...>', 'exclude feature files');

    return action(async (options) => {
      // if (typeof options.reset === "string")
      //     options.reset = options.reset === "true";
      // options.mode ??= await prompt.select("mode")("Select mode")([
      //     "LOCAL",
      //     "DEV",
      //     "REAL",
      // ]);
      // options.reset ??= await prompt.boolean("reset")("Reset local DB");
      return options as IOptions;
    });
  });

/**
 * 테스트 코드 실행 함수
 */
async function main(): Promise<void> {
  /**
   * CONFIGURATIONS
   */
  const options: IOptions = await getOptions();

  /**
   * 백엔드 서버 실행
   */
  const app = await NestFactory.create(AppModule, { logger: false });
  await WebSocketAdaptor.upgrade(app);
  await app.listen(GlobalConfig.env.PORT ?? 3000);

  /**
   * 초기 데이터 세팅
   */
  await GlobalConfig.seeding();

  /**
   * 클라이언트 커넥션 생성 및 테스트 실행
   */
  const connection: IConnection = {
    host: `http://127.0.0.1:${GlobalConfig.env.PORT}`,
  };
  const { accessToken } = await test_api_create_user(connection);
  connection.headers = {
    authorization: `Bearer ${accessToken}`,
  };

  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: 'test',
    location: __dirname + '/features',
    parameters: () => [{ ...connection }],
    filter: (func) =>
      (!options.include?.length || (options.include ?? []).some((str) => func.includes(str))) &&
      (!options.exclude?.length || (options.exclude ?? []).every((str) => !func.includes(str))),
  });

  const failures: DynamicExecutor.IExecution[] = report.executions.filter((exec) => exec.error !== null);
  if (failures.length === 0) {
    console.log('Success');
    console.log('Elapsed time', report.time.toLocaleString(), `ms`);
  } else {
    for (const f of failures) console.log(f.error);
    process.exit(-1);
  }

  /**
   * 결과 출력
   */
  console.log(
    [
      `All: #${report.executions.length}`,
      `Success: #${report.executions.length - failures.length}`,
      `Failed: #${failures.length}`,
    ].join('\n'),
  );

  app.close().then(process.exit(0));
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
