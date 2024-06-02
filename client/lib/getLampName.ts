function getLampName(lampCode: string) {
  return window?.localStorage?.getItem(lampCode) || lampCode;
}

export default getLampName;
