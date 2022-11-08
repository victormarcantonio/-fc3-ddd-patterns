import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("1", "Product", 20.0);


const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};


describe("Unit test create product use case", () => {
it("should find a product", async ()=> {

    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
        id:  "1",
    }

    const output = {
        id:  "1",
        name: "Product",
        price: 20.0
    }

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
})

})
