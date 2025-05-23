enum LogLevel {
    PRODUCTION = 0,
    DEBUG = 1,
    ALL = 2,
}

type LogLevelKey = keyof typeof LogLevel;

export class Logger {
    private static outputLogLevel: LogLevel = LogLevel.PRODUCTION;

    static setLogLevel(logLevel: LogLevelKey) {
        this.outputLogLevel = LogLevel[logLevel];
    }

    static prod = (...args: any[]) => this.trace(LogLevel.PRODUCTION, args);
    static debug = (...args: any[]) => this.trace(LogLevel.DEBUG, args);
    static all = (...args: any[]) => this.trace(LogLevel.ALL, args);

    /**
     * 設定ログレベルが、引数のログレベル以上で、かつconsole.log()が使える時に、
     * コンソールに文字列を出力します。
     */
    private static trace(logLevel: LogLevel, ...args: any[]): void {
        if (this.outputLogLevel >= logLevel && window.console && typeof window.console.log != "undefined") {
            let str: string = "";
            if (args.length > 0)
                str = args.join(", ");
            console.log(str);
        }
    }
}