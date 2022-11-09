import { Sequelize } from "sequelize-typescript";
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import CreateProductUseCase from "./create.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test create product use case", ()=> {
   
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should create a product", async ()=> {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const product = new Product("123", "Product", 20.0)
      
        await productRepository.create(product);

        const input = {
            name: "Product",
            type: "a",
            price: 20.0
        }

        const output = {
            id:  "123",
            name: "Product",
            price: 20.0
        }

        const result = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name:  result.name,
            price: result.price
        }
        );
    })

})