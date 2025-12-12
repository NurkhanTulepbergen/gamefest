/* eslint-disable no-restricted-globals */

self.onmessage = async (e) => {
    const file = e.data;

    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.6,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
        self.postMessage(reader.result);
    };
    reader.readAsDataURL(blob);
};
