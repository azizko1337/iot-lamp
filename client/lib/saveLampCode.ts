async function saveLampCode(lampCode: string): Promise<void> {
  // no lamps are added before
  if (window.localStorage.getItem("lampCodes") === null) {
    window.localStorage.setItem("lampCodes", JSON.stringify([lampCode]));
    return;
  }

  // some lamps are already added
  let lampCodes = await JSON.parse(
    window.localStorage.getItem("lampCodes") || "[]"
  );
  lampCodes.push(lampCode);

  lampCodes = Array.from(new Set(lampCodes)); //remove duplicates

  window.localStorage.setItem("lampCodes", JSON.stringify(lampCodes));
}

export default saveLampCode;
