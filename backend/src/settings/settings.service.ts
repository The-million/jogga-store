import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AppSettings {
  exchangeRate: number; // 1 USD = X FC
  heroSlides: { title: string; subtitle: string; cta: string; imageUrl: string; color: string }[];
  siteName: string;
}

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get<T = any>(key: string): Promise<T | null> {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    return setting ? (setting.value as T) : null;
  }

  async set(key: string, value: any) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getExchangeRate(): Promise<number> {
    const rate = await this.get<number>('exchangeRate');
    return rate || 2800;
  }

  async setExchangeRate(rate: number) {
    return this.set('exchangeRate', rate);
  }

  async getHeroSlides() {
    return this.get<AppSettings['heroSlides']>('heroSlides') || [];
  }

  async setHeroSlides(slides: AppSettings['heroSlides']) {
    return this.set('heroSlides', slides);
  }

  async getAllSettings() {
    const settings = await this.prisma.setting.findMany();
    const map: Record<string, any> = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  }
}
