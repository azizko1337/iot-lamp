async function readLampCodes(): Promise<string[]> {
  const lampCodes = await JSON.parse(
    window.localStorage.getItem("lampCodes") || "[]"
  );
  return lampCodes;
}

export default readLampCodes;
