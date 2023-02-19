interface IServiceConfig {
  port: number,
  words: string,
}

const defaultConfig: IServiceConfig = {
  port: 8000,
  words: "./words",
};

export default defaultConfig;
