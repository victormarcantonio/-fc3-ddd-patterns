import  request  from "supertest";
import {app, sequelize } from "../express";



describe("E2E test for product", () => {

    beforeEach(async ()=> {
        await sequelize.sync({force:true});
    });

    afterAll(async () => {
      await sequelize.close();
    });



    it("should create a product", async ()=> {
        const response = await request(app)
              .post("/product")
              .send({
                name: "Product",
                type: "a",
                price: 20.0
              });
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body.name).toBe("Product");
        expect(response.body.price).toBe(20.0);
    });

    it("should list all products", async ()=> {
        const response = await request(app)
              .post("/product")
              .send({
                name: "Product",
                type: "a",
                price: 20.0
              });

        const response2 = await request(app)
              .post("/product")
              .send({
                name: "Product 2",
                type: "b",
                price: 25.0
              });

        const responseList = await request(app).get("/product").send();
        console.log(responseList.body)
        expect(responseList.status).toBe(200);
        expect(responseList.body.products.length).toBe(2);
        expect(responseList.body.products[0].name).toBe("Product");
        expect(responseList.body.products[0].price).toBe(20.0);
        expect(responseList.body.products[1].name).toBe("Product 2");
        expect(responseList.body.products[1].price).toBe(50.0);
    });
})