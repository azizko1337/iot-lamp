async function removeLampCode(lampCode: string): Promise<void> {
  // no lamps are added before
  if (window.localStorage.getItem("lampCodes") === null) {
    window.localStorage.setItem("lampCodes", JSON.stringify([]));
    return;
  }

  let lampCodes = await JSON.parse(
    window.localStorage.getItem("lampCodes") || "[]"
  );
  lampCodes = lampCodes.filter(
    (lampCodeFiltering: string) => lampCodeFiltering !== lampCode
  );

  window.localStorage.setItem("lampCodes", JSON.stringify(lampCodes));
}

export default removeLampCode;
