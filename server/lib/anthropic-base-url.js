const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com';

/** Return the Anthropic Messages endpoint for the official or a compatible API. */
export function anthropicMessagesUrl(baseUrl = DEFAULT_ANTHROPIC_BASE_URL) {
  const normalized = String(baseUrl || DEFAULT_ANTHROPIC_BASE_URL).replace(/\/+$/, '');
  return `${normalized}/v1/messages`;
}
