import { removeItemFromCart } from './removeItemFromCart';
import { buildProduct } from '@/modules/products/testing/buildProduct';

describe('removeItemFromCart', () => {
  it('should remove only the item that matches the product id', () => {
    const watch = buildProduct({ id: 1 });
    const phone = buildProduct({ id: 2 });

    const result = removeItemFromCart(
      [
        { product: watch, quantity: 2 },
        { product: phone, quantity: 1 },
      ],
      1
    );

    expect(result).toEqual([{ product: phone, quantity: 1 }]);
  });

  it('should return the same items when the product id is not in the cart', () => {
    const items = [{ product: buildProduct({ id: 1 }), quantity: 1 }];

    expect(removeItemFromCart(items, 99)).toEqual(items);
  });
});
