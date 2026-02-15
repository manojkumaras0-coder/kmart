import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

// Mock the useCart hook
vi.mock('../context/CartContext', () => ({
    useCart: vi.fn(),
}));

const mockProduct = {
    id: '1',
    name: 'Artisanal Honey',
    price: 15.00,
    unit: 'jar',
    image_url: 'http://example.com/honey.jpg',
    category: 'Pantry',
    is_organic: true,
    stock_quantity: 50,
};

const renderCard = (product = mockProduct) => {
    return render(
        <BrowserRouter>
            <ProductCard product={product} />
        </BrowserRouter>
    );
};

describe('ProductCard Component', () => {
    beforeEach(() => {
        useCart.mockReturnValue({
            cartItems: [],
            addToCart: vi.fn(),
            updateQuantity: vi.fn(),
            removeItem: vi.fn(),
        });
    });

    it('renders basic product information correctly', () => {
        renderCard();
        expect(screen.getByText('Artisanal Honey')).toBeInTheDocument();
        expect(screen.getByText('$15.00')).toBeInTheDocument();
        expect(screen.getByText('/jar')).toBeInTheDocument();
        expect(screen.getByText('Pantry')).toBeInTheDocument();
    });

    it('displays Organic badge if product is organic', () => {
        renderCard();
        expect(screen.getByText(/Organic/i)).toBeInTheDocument();
    });

    it('calculates and displays discount correctly', () => {
        const discountedProduct = {
            ...mockProduct,
            discount_price: 12.00,
        };
        renderCard(discountedProduct);
        expect(screen.getByText('$12.00')).toBeInTheDocument();
        expect(screen.getByText('$15.00')).toHaveClass('line-through');
        expect(screen.getByText(/SAVE 20%/i)).toBeInTheDocument();
    });

    it('shows "Restocking Soon" when out of stock', () => {
        const outOfStockProduct = {
            ...mockProduct,
            stock_quantity: 0,
        };
        renderCard(outOfStockProduct);
        expect(screen.getByText(/Restocking Soon/i)).toBeInTheDocument();
    });
});
