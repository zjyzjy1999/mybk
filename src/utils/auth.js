import merge from './merge';
import { encrypt, decrypt } from './jsencrypt';

const TokenKey = 'Admin-Token';

export const getToken = () => {
  const token = localStorage.getItem(TokenKey);
  return token || '';
};

export const setToken = token => {
  localStorage.setItem(TokenKey, token);
};

export const removeToken = () => {
  localStorage.removeItem(TokenKey);
};

// 账户保存key
const ACCOUNT_KEY = window.btoa('AUTH_ACCOUNT');
/**
 * 设置用户信息
 */
export const setAccount = account => {
  // 每次保存前删除之前的保存
  delAccount();
  // 单独保存密码
  if (account.password) {
    // 加密密码
    const password = encrypt(account.password);
    // 保存7天
    const expires = 7;
    try {
      localStorage.setItem(
        window.btoa('password'),
        window.btoa(password),
        { expires }
      );
    } catch (e) {
      localStorage.setItem('password', password, { expires });
    }
    delete account.password;
  }
  account = JSON.stringify(account);
  // 保存其他信息
  try {
    localStorage.setItem(ACCOUNT_KEY, window.btoa(account));
  } catch(e) {
    localStorage.setItem(ACCOUNT_KEY, account);
  }
};

/**
 * 获取账户信息
 */
export const getAccount = () => {
  let accountInfo = {};
  // 基本信息
  let account = localStorage.getItem(ACCOUNT_KEY);
  // base64转码
  try {
    account = JSON.parse(window.atob(account));
  } catch(e) {
    account = JSON.parse(account);
  };
  // 合并基本信息
  if (typeof account === 'object') {
    accountInfo = { ...account };
  }
  // 获取密码
  let password = localStorage.getItem(window.btoa('password'));
  if (password) {
    // base64转码
    try {
      password = window.atob(password);
    } catch (e) {};
    // 解密
    accountInfo.password = decrypt(password);
  }
  return accountInfo;
};

/**
 * 删除账户信息
 */
export function delAccount() {
  // 删除密码
  localStorage.removeItem(window.btoa('password'));
  // 删除基本信息
  localStorage.removeItem(ACCOUNT_KEY);
};


