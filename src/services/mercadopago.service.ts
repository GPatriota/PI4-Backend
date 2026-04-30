import https from 'https';
import env from '../config/env';
import { BadRequestError, InternalServerError } from '../utils/errors.util';

type CheckoutItem = {
  id: number;
  title: string;
  quantity: number;
  unitPrice: number;
};

type CheckoutUrls = {
  success: string;
  failure: string;
  pending: string;
};

type PreferenceInput = {
  externalReference: string;
  payerEmail: string;
  items: CheckoutItem[];
  backUrls: CheckoutUrls;
  notificationUrl?: string;
};

type MercadoPagoPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
};

type MercadoPagoPaymentResponse = {
  id: number;
  status: string;
  external_reference?: string;
};

export function buildMercadoPagoPreferencePayload(input: PreferenceInput) {
  const payload: {
    external_reference: string;
    payer: { email: string };
    items: Array<{ id: string; title: string; quantity: number; unit_price: number; currency_id: string }>;
    back_urls: CheckoutUrls;
    auto_return: 'approved';
    notification_url?: string;
  } = {
    external_reference: input.externalReference,
    payer: {
      email: input.payerEmail,
    },
    items: input.items.map((item) => ({
      id: String(item.id),
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      currency_id: 'BRL',
    })),
    back_urls: input.backUrls,
    auto_return: 'approved',
  };

  if (input.notificationUrl) {
    payload.notification_url = input.notificationUrl;
  }

  return payload;
}

function requestJson<T>(path: string, method: 'GET' | 'POST', body?: unknown): Promise<T> {
  const token = env.mercadoPago.accessToken;
  if (!token) {
    throw new BadRequestError('Mercado Pago access token is not configured');
  }

  return new Promise<T>((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.mercadopago.com',
        path,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk: Buffer) => {
          raw += chunk.toString('utf8');
        });

        res.on('end', () => {
          if (!raw) {
            reject(new InternalServerError('Mercado Pago returned an empty response'));
            return;
          }

          let parsed: unknown;
          try {
            parsed = JSON.parse(raw);
          } catch {
            reject(new InternalServerError('Could not parse Mercado Pago response'));
            return;
          }

          if ((res.statusCode ?? 500) >= 400) {
            reject(new BadRequestError('Mercado Pago request failed'));
            return;
          }

          resolve(parsed as T);
        });
      }
    );

    req.on('error', () => reject(new InternalServerError('Mercado Pago request error')));

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

export class MercadoPagoService {
  async createCheckoutPreference(input: PreferenceInput): Promise<MercadoPagoPreferenceResponse> {
    const payload = buildMercadoPagoPreferencePayload(input);
    return requestJson<MercadoPagoPreferenceResponse>('/checkout/preferences', 'POST', payload);
  }

  async getPaymentById(paymentId: string): Promise<MercadoPagoPaymentResponse> {
    return requestJson<MercadoPagoPaymentResponse>(`/v1/payments/${paymentId}`, 'GET');
  }
}
