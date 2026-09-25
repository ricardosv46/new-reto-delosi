import { useCartDrawerStore } from './useCartDrawerStore';

describe('useCartDrawerStore', () => {
  beforeEach(() => {
    useCartDrawerStore.setState({ isOpen: false });
  });

  it('should start closed', () => {
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should open and close the drawer', () => {
    useCartDrawerStore.getState().openCart();
    expect(useCartDrawerStore.getState().isOpen).toBe(true);

    useCartDrawerStore.getState().closeCart();
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should toggle the drawer', () => {
    useCartDrawerStore.getState().toggleCart();
    expect(useCartDrawerStore.getState().isOpen).toBe(true);

    useCartDrawerStore.getState().toggleCart();
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });
});
