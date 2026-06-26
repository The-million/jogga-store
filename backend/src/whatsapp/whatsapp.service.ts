import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_ID || '';
    this.accessToken = process.env.WHATSAPP_TOKEN || '';
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.phoneNumberId || !this.accessToken) {
      this.logger.warn(`WhatsApp non configuré — message à ${to}: ${message.substring(0, 50)}...`);
      return;
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body: message },
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        this.logger.error(`WhatsApp send failed: ${JSON.stringify(err)}`);
      }
    } catch (error) {
      this.logger.error(`WhatsApp send error: ${error}`);
    }
  }

  async sendOrderConfirmation(phone: string, orderNumber: string, total: number) {
    const message = [
      `🛍️ *Jogga Store — Confirmation de commande*`,
      ``,
      `N° ${orderNumber}`,
      `Total : ${total.toLocaleString()} FC`,
      ``,
      `Statut : ✅ Confirmée`,
      `Votre commande est en cours de préparation.`,
      `Livraison prévue sous 24h.`,
      ``,
      `Merci pour votre confiance !`,
    ].join('\n');

    await this.sendMessage(phone, message);
  }

  async sendStatusUpdate(phone: string, orderNumber: string, status: string, eta?: string) {
    const statusLabels: Record<string, string> = {
      CONFIRMED: '✅ Confirmée',
      PREPARING: '📦 En préparation',
      IN_TRANSIT: '🚚 En route',
      DELIVERED: '🏠 Livrée',
      CANCELLED: '❌ Annulée',
    };

    let message = [
      `📢 *Jogga Store — Mise à jour*`,
      ``,
      `Commande N° ${orderNumber}`,
      `Statut : ${statusLabels[status] || status}`,
    ];

    if (eta) {
      message.push(`ETA : ${new Date(eta).toLocaleString('fr-FR')}`);
    }

    await this.sendMessage(phone, message.join('\n'));
  }
}
