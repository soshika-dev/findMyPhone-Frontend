type HttpMethod = 'GET' | 'POST' | 'PATCH'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function request<T>(url: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
  // شبیه‌سازی درخواست HTTP
  await delay(250)
  if (method !== 'GET' && body) {
    console.debug('درخواست ساختگی', method, url, body)
  }
  // در این لایه فقط پاس‌ترو می‌کنیم؛ پاسخ واقعی در سرویس‌ها ساخته می‌شود.
  return body as T
}

export { delay }
