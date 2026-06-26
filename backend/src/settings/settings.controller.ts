import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  async getPublic() {
    const [exchangeRate, heroSlides] = await Promise.all([
      this.settingsService.getExchangeRate(),
      this.settingsService.getHeroSlides(),
    ]);
    return { exchangeRate, heroSlides };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAll() {
    return this.settingsService.getAllSettings();
  }

  @Put('exchange-rate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async setExchangeRate(@Body() body: { rate: number }) {
    await this.settingsService.setExchangeRate(body.rate);
    return { exchangeRate: body.rate };
  }

  @Put('hero-slides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async setHeroSlides(@Body() body: { slides: any[] }) {
    await this.settingsService.setHeroSlides(body.slides);
    return { heroSlides: body.slides };
  }
}
