package com.aurum.crm.config;

import com.aurum.crm.entity.Brand;
import com.aurum.crm.entity.Category;
import com.aurum.crm.entity.Product;
import com.aurum.crm.repository.BrandRepository;
import com.aurum.crm.repository.CategoryRepository;
import com.aurum.crm.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seed(CategoryRepository categoryRepo,
                                  BrandRepository brandRepo,
                                  ProductRepository productRepo) {
        return args -> {
            if (productRepo.count() > 0) {
                return; // already seeded
            }

            Map<String, Category> cats = new HashMap<>();
            for (String[] c : new String[][]{
                    {"Jackets", "Outerwear and coats"},
                    {"Shirts", "Casual and formal shirts"},
                    {"Trousers", "Pants and chinos"},
                    {"Dresses", "Elegant dresses"},
                    {"Accessories", "Belts, bags and more"},
                    {"Shoes", "Footwear collection"}
            }) {
                cats.put(c[0], categoryRepo.save(
                        Category.builder().name(c[0]).description(c[1]).build()));
            }

            Map<String, Brand> brands = new HashMap<>();
            for (String b : List.of("AURUM Signature", "Noir", "Lumen", "Atelier")) {
                brands.put(b, brandRepo.save(Brand.builder().name(b).build()));
            }

            seedProduct(productRepo, "AUR-001", "Gold-Trim Wool Coat", cats.get("Jackets"),
                    brands.get("AURUM Signature"), "L", "Black", "189", "349", 12,
                    true, true, false,
                    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600");
            seedProduct(productRepo, "AUR-002", "Classic White Oxford Shirt", cats.get("Shirts"),
                    brands.get("Atelier"), "M", "White", "29", "59", 40,
                    true, false, true,
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600");
            seedProduct(productRepo, "AUR-003", "Slim Fit Charcoal Trousers", cats.get("Trousers"),
                    brands.get("Noir"), "32", "Charcoal", "39", "79", 25,
                    false, true, true,
                    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600");
            seedProduct(productRepo, "AUR-004", "Evening Satin Dress", cats.get("Dresses"),
                    brands.get("Lumen"), "S", "Gold", "120", "239", 8,
                    true, true, false,
                    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600");
            seedProduct(productRepo, "AUR-005", "Leather Belt with Gold Buckle", cats.get("Accessories"),
                    brands.get("AURUM Signature"), "One Size", "Brown", "19", "45", 60,
                    false, false, true,
                    "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600");
            seedProduct(productRepo, "AUR-006", "Suede Chelsea Boots", cats.get("Shoes"),
                    brands.get("Noir"), "42", "Tan", "85", "159", 4,
                    true, false, true,
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600");
            seedProduct(productRepo, "AUR-007", "Linen Summer Shirt", cats.get("Shirts"),
                    brands.get("Lumen"), "L", "Beige", "25", "55", 30,
                    false, true, false,
                    "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600");
            seedProduct(productRepo, "AUR-008", "Quilted Bomber Jacket", cats.get("Jackets"),
                    brands.get("Atelier"), "M", "Navy", "70", "139", 18,
                    false, true, true,
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600");
        };
    }

    private void seedProduct(ProductRepository repo, String code, String name, Category category,
                             Brand brand, String size, String color, String purchase, String selling,
                             int qty, boolean featured, boolean newArrival, boolean bestSeller,
                             String imageUrl) {
        repo.save(Product.builder()
                .productCode(code)
                .name(name)
                .description("Part of the AURUM collection. Premium materials, timeless design.")
                .imageUrl(imageUrl)
                .category(category)
                .brand(brand)
                .size(size)
                .color(color)
                .purchasePrice(new BigDecimal(purchase))
                .sellingPrice(new BigDecimal(selling))
                .quantity(qty)
                .barcode("BAR" + code)
                .status("ACTIVE")
                .featured(featured)
                .newArrival(newArrival)
                .bestSeller(bestSeller)
                .build());
    }
}
