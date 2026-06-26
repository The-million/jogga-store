import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('product-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
          cb(new BadRequestException('JPEG, PNG, WEBP ou GIF uniquement'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Fichier requis');

    const result = await this.cloudinary.uploadImage(file, 'jogga-store/products');

    return {
      url: result.url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }
}
