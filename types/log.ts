export const LogLevels = ["info", "error"] as const; // as const because the levels will not change during the execution
export type LogLevel = (typeof LogLevels)[number];

export type LogFunction = (message: string) => void;
export type Log = { message: string; level: LogLevel; timestamp: Date };

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};
