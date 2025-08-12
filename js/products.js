(function () {
  const products = [
    {
      id: 'p-rose-serum',
      name: 'Hydrating Rose Serum',
      brand: 'Aurora Skin',
      category: 'Skincare',
      price: 28.0,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-vitc-bright',
      name: 'Vitamin C Brightening Gel',
      brand: 'LumiGlow',
      category: 'Skincare',
      price: 22.5,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-matte-lip',
      name: 'Velvet Matte Lipstick',
      brand: 'Rouge Atelier',
      category: 'Makeup',
      price: 16.0,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-nude-palette',
      name: 'Nude Eyeshadow Palette',
      brand: 'Canvas Colors',
      category: 'Makeup',
      price: 34.0,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-hair-oil',
      name: 'Nourishing Hair Oil',
      brand: 'Silkra',
      category: 'Hair',
      price: 19.0,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1611955167811-4711904bb9b8?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-facial-mist',
      name: 'Aloe Facial Mist',
      brand: 'Calm Dew',
      category: 'Skincare',
      price: 14.0,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-amber-parfum',
      name: 'Amber Eau de Parfum',
      brand: 'Noir Maison',
      category: 'Fragrance',
      price: 49.0,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c8e87?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-makeup-brush',
      name: 'Pro Makeup Brush Set',
      brand: 'BlendCraft',
      category: 'Tools',
      price: 26.0,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1619959136308-5316658d6fa9?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-sheer-foundation',
      name: 'Sheer Glow Foundation',
      brand: 'AuraBase',
      category: 'Makeup',
      price: 27.5,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'p-lavender-cream',
      name: 'Lavender Night Cream',
      brand: 'Serenité',
      category: 'Skincare',
      price: 24.0,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1629198735660-678b33a8fd38?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  const categories = Array.from(new Set(products.map(p => p.category)));

  window.PRODUCTS = products;
  window.CATEGORIES = categories;
})();