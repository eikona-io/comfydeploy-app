export const getProxiedModelUrl = async (url: string): Promise<string> => {
  try {
    const urlObj = new URL(url);
    const modelPath = urlObj.pathname;

    const apiUrl = process.env.NEXT_PUBLIC_CD_API_URL;
    if (!apiUrl) {
      console.warn(
        "NEXT_PUBLIC_CD_API_URL not configured, falling back to original URL",
      );
      return url;
    }

    return `${apiUrl}/api/proxy/model${modelPath}`;
  } catch (error) {
    console.error("Failed to create proxied URL:", error);
    return url;
  }
};
