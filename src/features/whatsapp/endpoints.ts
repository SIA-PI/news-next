const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const whatsappEndpoints = {
  settings: () => `${BASE_URL}/users/me/whatsapp`,
  ensureAccount: () => `${BASE_URL}/whatsapp/accounts`,
  qr: () => `${BASE_URL}/whatsapp/qr`,
  status: () => `${BASE_URL}/whatsapp/status`,
  sendWithAccount: (id: string) => `${BASE_URL}/whatsapp/accounts/${id}/send`,
};