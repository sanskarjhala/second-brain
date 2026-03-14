const isValidUrl = (url: string) => {
  try {
    // inbuilt js url checaker
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

function isValidYouTubeLink(link: string) {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(link);
}

function isValidTwitterLink(link: string) {
  const twitterRegex = /^(https?:\/\/)?(www\.)?x\.com\/\w+\/status\/\d+/;
  return twitterRegex.test(link);
}

function isValidGithubLink(link: string) {
  const githubRegex =
    /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+(\/[\w-]+)?\/?$/;
  return githubRegex.test(link);
}

function isValidDocsLink(link: string) {
  const docsRegex =
    /^(https?:\/\/)?(docs\.google\.com\/document\/d\/[\w-]+\/?.*)/;
  return docsRegex.test(link);
}

function isValidGenericLink(link: string) {
  return isValidUrl(link);
}

export function validateLinkByType(type: string, link: string) {
  if (!isValidUrl(link)) {
    return { valid: false, error: "Invalid URL format." };
  }

  switch (type) {
    case "Youtube":
      if (!isValidYouTubeLink(link)) {
        return { valid: false, error: "Invalid YouTube link." };
      }
      break;
    case "Twitter":
      if (!isValidTwitterLink(link)) {
        return { valid: false, error: "Invalid Twitter link." };
      }
      break;
    case "Github":
      if (!isValidGithubLink(link)) {
        return { valid: false, error: "Invalid GitHub link." };
      }
      break;
    case "Docs":
      if (!isValidDocsLink(link)) {
        return { valid: false, error: "Invalid Docs link." };
      }
      break;
    case "Link":
    case "Others":
      if (!isValidGenericLink(link)) {
        return { valid: false, error: "Invalid link URL." };
      }
      break;
    default:
      return { valid: false, error: "Unknown content type." };
  }

  return { valid: true };
}
