import { describe, expect, it } from '@jest/globals';
import { buildMercadoPagoPreferencePayload } from '../src/services/mercadopago.service';

describe('buildMercadoPagoPreferencePayload', () => {
  it('builds checkout payload with mapped items and metadata', () => {
    const payload = buildMercadoPagoPreferencePayload({
      externalReference: 'order-42',
      payerEmail: 'buyer@example.com',
      items: [
        {
          id: 10,
          title: 'Mouse Gamer',
          quantity: 2,
          unitPrice: 89.9,
        },
      ],
      backUrls: {
        success: 'electroshop://payment/success',
        failure: 'electroshop://payment/failure',
        pending: 'electroshop://payment/pending',
      },
      notificationUrl: 'https://api.example.com/api/v1/orders/checkout/webhook',
    });

    expect(payload).toEqual({
      external_reference: 'order-42',
      payer: { email: 'buyer@example.com' },
      items: [
        {
          id: '10',
          title: 'Mouse Gamer',
          quantity: 2,
          unit_price: 89.9,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: 'electroshop://payment/success',
        failure: 'electroshop://payment/failure',
        pending: 'electroshop://payment/pending',
      },
      notification_url: 'https://api.example.com/api/v1/orders/checkout/webhook',
      auto_return: 'approved',
    });
  });
});
