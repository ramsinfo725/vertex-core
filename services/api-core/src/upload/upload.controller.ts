import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../products/products.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    await this.productsService.bulkCreateFromCsv(file.buffer);
    return { message: 'Products imported successfully' };
  }
}
