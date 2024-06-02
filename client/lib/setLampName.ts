function setLampName(lampCode: string, name: string) {
  window?.localStorage?.setItem(lampCode, name);
}

export default setLampName;
