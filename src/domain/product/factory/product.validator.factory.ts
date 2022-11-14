import ValidatorInterface from '../../@shared/validator/validator.interface';
import CustomerYupValidator from '../../customer/validator/customer.yup.validator';
import Product from '../entity/product';
import ProductYupValidator from '../validator/product.yup.validator';
export default class ProductValidatorFactory {
    static create(): ValidatorInterface<Product> {
        return new ProductYupValidator();
    }
}