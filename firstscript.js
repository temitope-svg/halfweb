const fetchProducts = async () => {
    try {
        const response = await fetch('goods.json');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const fetchProductById = async (id) => {

    const productFetch = await fetch('./goods.json');

    const products = await productFetch.json();

    return products.find(p => p.id == id);
}