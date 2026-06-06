package com.aurum.crm.service.impl;

import com.aurum.crm.dto.response.DashboardResponse;
import com.aurum.crm.entity.Category;
import com.aurum.crm.entity.OrderStatus;
import com.aurum.crm.entity.Role;
import com.aurum.crm.repository.*;
import com.aurum.crm.service.DashboardService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final int lowStockThreshold;

    public DashboardServiceImpl(ProductRepository productRepository,
                                CategoryRepository categoryRepository,
                                UserRepository userRepository,
                                OrderRepository orderRepository,
                                OrderItemRepository orderItemRepository,
                                @Value("${aurum.inventory.low-stock-threshold}") int lowStockThreshold) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.lowStockThreshold = lowStockThreshold;
    }

    @Override
    public DashboardResponse getDashboard() {
        int year = LocalDate.now().getYear();
        int month = LocalDate.now().getMonthValue();

        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        BigDecimal monthlyRevenue = orderRepository.revenueForMonth(year, month);
        long lowStock = productRepository.countByQuantityLessThanEqual(lowStockThreshold);

        // Monthly sales for the current year
        List<DashboardResponse.MonthlySales> monthly = new ArrayList<>();
        BigDecimal[] revByMonth = new BigDecimal[13];
        long[] ordersByMonth = new long[13];
        for (Object[] row : orderRepository.monthlySales(year)) {
            int m = ((Number) row[0]).intValue();
            revByMonth[m] = (BigDecimal) row[1];
            ordersByMonth[m] = ((Number) row[2]).longValue();
        }
        for (int m = 1; m <= 12; m++) {
            String label = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthly.add(new DashboardResponse.MonthlySales(
                    m, label,
                    revByMonth[m] != null ? revByMonth[m] : BigDecimal.ZERO,
                    ordersByMonth[m]));
        }

        // Top selling products
        List<DashboardResponse.NameValue> topSelling = new ArrayList<>();
        for (Object[] row : orderItemRepository.topSellingProducts(PageRequest.of(0, 5))) {
            topSelling.add(new DashboardResponse.NameValue(
                    (String) row[0], ((Number) row[1]).longValue()));
        }

        // Category distribution (product count per category)
        List<DashboardResponse.NameValue> categoryDist = new ArrayList<>();
        for (Category c : categoryRepository.findAll()) {
            long count = productRepository.search(null, c.getId(), null, PageRequest.of(0, 1))
                    .getTotalElements();
            categoryDist.add(new DashboardResponse.NameValue(c.getName(), count));
        }

        return new DashboardResponse(
                totalProducts, totalCategories, totalCustomers, totalOrders,
                pendingOrders, completedOrders, monthlyRevenue, lowStock,
                monthly, topSelling, categoryDist);
    }
}
