const Replicate = require("replicate");

const IDM_VTON_VERSION = process.env.REPLICATE_MODEL_VERSION ||
  "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

/**
 * Validate that the input is a public image URL (http/https only).
 * Localhost and loopback addresses are rejected.
 */
function isPublicImageUrl(value) {
  try {
    const parsed = new URL(value);
    const protocolOk = parsed.protocol === "http:" || parsed.protocol === "https:";
    const blockedHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    return protocolOk && !blockedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Parse data URI image payload to Buffer.
 */
function parseImageDataUri(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const match = value.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) {
    throw new Error(`${fieldName} must be a valid image data URI`);
  }

  const base64Payload = match[2].replace(/\s/g, "");
  const buffer = Buffer.from(base64Payload, "base64");

  if (!buffer.length) {
    throw new Error(`${fieldName} data URI is empty`);
  }

  // Keep request payload sizes reasonable for the demo app.
  const maxBytes = 10 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error(`${fieldName} image is too large (max 10MB)`);
  }

  return buffer;
}

/**
 * Accept either a public URL or image data URI.
 */
function normalizeImageInput(value, fieldName) {
  if (isPublicImageUrl(value)) {
    return value;
  }

  if (typeof value === "string" && value.startsWith("data:image/")) {
    return parseImageDataUri(value, fieldName);
  }

  throw new Error(`${fieldName} must be a valid public image URL (http/https) or image data URI`);
}

function isHttpUrl(value) {
  if (value instanceof URL) {
    return /^https?:\/\//i.test(value.href);
  }

  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function toHttpUrlString(value) {
  if (!value) return null;

  if (value instanceof URL && isHttpUrl(value)) {
    return value.href;
  }

  if (isHttpUrl(value)) {
    return value;
  }

  if (typeof value?.toString === "function") {
    const asString = value.toString();
    if (isHttpUrl(asString)) {
      return asString;
    }
  }

  return null;
}

async function resolvePossibleUrl(value) {
  if (!value) return null;

  const directUrl = toHttpUrlString(value);
  if (directUrl) {
    return directUrl;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = await resolvePossibleUrl(item);
      if (candidate) return candidate;
    }
    return null;
  }

  if (typeof value === "object") {
    // Replicate FileOutput can expose url() -> string.
    if (typeof value.url === "function") {
      const fromFn = await value.url();
      const fromFnUrl = toHttpUrlString(fromFn);
      if (fromFnUrl) return fromFnUrl;
    }

    const urlProp = toHttpUrlString(value.url);
    if (urlProp) return urlProp;

    const imageProp = toHttpUrlString(value.image);
    if (imageProp) return imageProp;

    // Common nested output keys some models return.
    if (value.output) {
      const nested = await resolvePossibleUrl(value.output);
      if (nested) return nested;
    }

    if (value.data) {
      const nested = await resolvePossibleUrl(value.data);
      if (nested) return nested;
    }

    // Last-resort scan through object values.
    for (const nestedValue of Object.values(value)) {
      const nested = await resolvePossibleUrl(nestedValue);
      if (nested) return nested;
    }
  }

  return null;
}

/**
 * Calls Replicate IDM-VTON model and returns generated try-on image URL.
 */
async function tryOn({ personImage, garmentImage, garmentDescription, category = "upper_body" }) {
  const normalizedPersonImage = normalizeImageInput(personImage, "personImage");
  const normalizedGarmentImage = normalizeImageInput(garmentImage, "garmentImage");

  if (category !== "upper_body") {
    throw new Error("category must be upper_body");
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }

  const replicate = new Replicate({ auth: token });

  // Run the requested model with required fields.
  const output = await replicate.run(IDM_VTON_VERSION, {
    input: {
      human_img: normalizedPersonImage,
      garm_img: normalizedGarmentImage,
      garment_des: typeof garmentDescription === "string" && garmentDescription.trim()
        ? garmentDescription.trim()
        : "Stylish upper body garment",
      category: "upper_body",
    }
  });

  const outputUrl = await resolvePossibleUrl(output);

  if (!outputUrl || typeof outputUrl !== "string") {
    throw new Error("Model did not return a valid output image URL");
  }

  return outputUrl;
}

module.exports = {
  tryOn
};
