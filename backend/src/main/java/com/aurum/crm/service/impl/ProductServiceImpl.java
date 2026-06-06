package com.aurum.crm.service.impl;

import com.aurum.crm.dto.request.ProductRequest;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.entity.Brand;
import com.aurum.crm.entity.Category;
import com.aurum.crm.entity.Product;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.ProductMapper;
import com.aurum.crm.repository.BrandRepository;
import com.aurum.crm.repository.CategoryRepository;
import com.aurum.crm.repository.ProductRepository;
import com.aurum.crm.service.InventoryService;
import com.aurum.crm.service.ProductService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private static final String ACTIVE = "ACTIVE";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final InventoryService inventoryService;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              BrandRepository brandRepository,
                              InventoryService inventoryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.inventoryService = inventoryService;
    }

    @Override
    public PageResponse<ProductResponse> list(String search, Long categoryId, String status, Pageable pageable) {
        return PageResponse.from(
                productRepository.search(search, categoryId, status, pageable)
                        .map(ProductMapper::toResponse));
    }

    @Override
    public ProductResponse get(Long id) {
        return ProductMapper.toResponse(find(id));
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest r) {
        Product product = Product.builder()
                .productCode(r.productCode())
                .name(r.name())
                .description(r.description())
                .imageUrl(r.imageUrl())
                .category(resolveCategory(r.categoryId()))
                .brand(resolveBrand(r.brandId()))
                .size(r.size())
                .color(r.color())
                .purchasePrice(r.purchasePrice())
                .sellingPrice(r.sellingPrice())
                .quantity(r.quantity() != null ? r.quantity() : 0)
                .barcode(r.barcode())
                .status(r.status() != null ? r.status() : ACTIVE)
                .featured(Boolean.TRUE.equals(r.featured()))
                .newArrival(Boolean.TRUE.equals(r.newArrival()))
                .bestSeller(Boolean.TRUE.equals(r.bestSeller()))
                .build();
        product = productRepository.save(product);
        if (product.getQuantity() > 0) {
            inventoryService.recordMovement(product, product.getQuantity(), "ADMIN", "Initial stock");
        }
        return ProductMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, ProductRequest r) {
        Product product = find(id);
        int oldQty = product.getQuantity();

        product.setProductCode(r.productCode());
        product.setName(r.name());
        product.setDescription(r.description());
        if (r.imageUrl() != null) product.setImageUrl(r.imageUrl());
        product.setCategory(resolveCategory(r.categoryId()));
        product.setBrand(resolveBrand(r.brandId()));
        product.setSize(r.size());
        product.setColor(r.color());
        product.setPurchasePrice(r.purchasePrice());
        product.setSellingPrice(r.sellingPrice());
        product.setBarcode(r.barcode());
        if (r.status() != null) product.setStatus(r.status());
        if (r.featured() != null) product.setFeatured(r.featured());
        if (r.newArrival() != null) product.setNewArrival(r.newArrival());
        if (r.bestSeller() != null) product.setBestSeller(r.bestSeller());

        int newQty = r.quantity() != null ? r.quantity() : oldQty;
        int delta = newQty - oldQty;
        product = productRepository.save(product);
        if (delta != 0) {
            inventoryService.recordMovement(product, delta, "ADMIN", "Stock updated via product edit");
        }
        return ProductMapper.toResponse(product);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        productRepository.delete(find(id));
    }

    @Override
    public List<ProductResponse> featured() {
        return productRepository.findByFeaturedTrueAndStatus(ACTIVE).stream()
                .map(ProductMapper::toResponse).toList();
    }

    @Override
    public List<ProductResponse> newArrivals() {
        return productRepository.findByNewArrivalTrueAndStatus(ACTIVE).stream()
                .map(ProductMapper::toResponse).toList();
    }

    @Override
    public List<ProductResponse> bestSellers() {
        return productRepository.findByBestSellerTrueAndStatus(ACTIVE).stream()
                .map(ProductMapper::toResponse).toList();
    }

    private Product find(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private Category resolveCategory(Long id) {
        if (id == null) return null;
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private Brand resolveBrand(Long id) {
        if (id == null) return null;
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + id));
    }

    @SuppressWarnings("unused")
    private static BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
