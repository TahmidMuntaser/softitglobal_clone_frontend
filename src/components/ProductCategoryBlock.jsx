"use client";

import ProductCard from "./ProductCard";
export default function ProductCategoryBlock({ category, quantities, onQuantityChange,}) 
{
  return (

    <div className="category-product-block">

      <div className="product-section-header">
        
        <div className="product-section-title-wrap">
          <h2 className="product-section-title">{category.name}</h2>
          <span className="product-section-underline" />
        </div>

        <a href={`/${category.slug}`} className="see-all-button">
          See All
        </a>

      </div>

      <div className="product-grid">
        
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 1}
            onQuantityChange={onQuantityChange}
          />
        ))}

      </div>

      
    </div>
  );
}
