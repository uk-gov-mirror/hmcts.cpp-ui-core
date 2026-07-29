import nodeRequest, { CoreOptions, OptionsWithUrl } from 'request';
import { User } from '../resources';
import { logResponse } from './log';

export type CppOptions = OptionsWithUrl & {
  user: User;
};

let defaultOptions: CoreOptions = {};

const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const request = <T>({ user, url, ...options }: CppOptions): Promise<T> => {
  const { userId } = user;
  const finalOptions = {
    ...defaultOptions,
    ...options,
    url,
    body: typeof options.body === 'object' ? JSON.stringify(options.body) : options.body,
    // set agent to false to prevent ESOCKETTIMEDOUT errors on dns resolution
    // https://github.com/request/request/issues/1231
    agent: false as any,
    headers: {
      ...(options.headers || {}),
      CJSCPPUID: userId
    },
    qs: {
      ...(options.qs || {}),
      CJSCPPUID: userId
    }
  };

  return new Promise<T>((resolve, reject) => {
    nodeRequest(finalOptions, (err, response, body) => {
      if (response && response.statusCode) {
        logResponse(response);
      }
      if (err || response.statusCode >= 400) {
        reject(err || response);
      } else {
        resolve(isJson(body) ? JSON.parse(body) : body);
      }
    });
  });
};

export const setPrimingDefaults = (options: CoreOptions): void => {
  defaultOptions = options;
};
