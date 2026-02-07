import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { parse } from 'csv-parse/sync';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async bulkCreateFromCsv(csvBuffer: Buffer) {
    const records = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
    });

    const products = records.map(record => ({
      sku: record.SKU,
      name: record.Name,
      category: record.Category,
      brand: record.Brand,
      priceUnit: parseFloat(record.PriceUnit),
      priceCase: parseFloat(record.PriceCase),
      unitsPerCase: parseInt(record.UnitsPerCase),
    }));

    return this.productsRepository.save(products);
  }

  findAll() {
    return this.productsRepository.find();
  }
}
