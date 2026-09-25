import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { buildProduct } from '@/modules/products/testing/buildProduct';

const product = buildProduct({
  id: 1,
  title: 'Minimalist Leather Watch',
  price: 100,
  category: 'accessories',
});

describe('CartDrawer', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [{ product, quantity: 2 }] });
    useCartDrawerStore.setState({ isOpen: true });
  });

  it('should render nothing while the drawer is closed', () => {
    useCartDrawerStore.setState({ isOpen: false });

    render(<CartDrawer />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should list the cart items with their line total and the subtotal', () => {
    render(<CartDrawer />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Minimalist Leather Watch')).toBeInTheDocument();
    expect(screen.getAllByText('$200.00')).toHaveLength(2); // line total + subtotal
  });

  it('should show the order confirmation screen and clear the cart after completing the purchase', () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Completar Compra' }));

    expect(screen.getByText('Gracias por tu compra')).toBeInTheDocument();
    expect(screen.getByText(/2 artículos/)).toBeInTheDocument();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should use the singular form when the order has a single article', () => {
    useCartStore.setState({ items: [{ product, quantity: 1 }] });
    render(<CartDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Completar Compra' }));

    expect(screen.getByText(/1 artículo /)).toBeInTheDocument();
  });

  it('should close the drawer when clicking "Seguir comprando" after a purchase', () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Completar Compra' }));
    fireEvent.click(screen.getByRole('button', { name: 'Seguir comprando' }));

    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should remove an item when clicking the delete button', () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText('Eliminar producto'));

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should increase and decrease the quantity of an item', () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText('Aumentar cantidad'));
    expect(useCartStore.getState().items[0].quantity).toBe(3);

    fireEvent.click(screen.getByLabelText('Disminuir cantidad'));
    fireEvent.click(screen.getByLabelText('Disminuir cantidad'));
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('should never let the quantity drop below 1 from the drawer', () => {
    useCartStore.setState({ items: [{ product, quantity: 1 }] });
    render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText('Disminuir cantidad'));

    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('should empty the cart when clicking "Vaciar carrito"', () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));

    expect(useCartStore.getState().items).toEqual([]);
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('should show the empty state and close from "Explorar catálogo"', () => {
    useCartStore.setState({ items: [] });
    render(<CartDrawer />);

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Completar Compra' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Explorar catálogo' }));

    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should close with the close button, the backdrop and the Escape key', () => {
    const { container, rerender } = render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText('Cerrar carrito'));
    expect(useCartDrawerStore.getState().isOpen).toBe(false);

    useCartDrawerStore.setState({ isOpen: true });
    rerender(<CartDrawer />);
    fireEvent.click(container.querySelector('.bg-foreground\\/30') as HTMLElement);
    expect(useCartDrawerStore.getState().isOpen).toBe(false);

    useCartDrawerStore.setState({ isOpen: true });
    rerender(<CartDrawer />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should ignore other keys and lock the page scroll while open', () => {
    render(<CartDrawer />);

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(useCartDrawerStore.getState().isOpen).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore the page scroll once it unmounts', () => {
    const { unmount } = render(<CartDrawer />);

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });
});
