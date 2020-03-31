exports.generateString = (size = 10) => {
  let text = "";
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < size; i++) {
    text += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }

  return text;
};
