package com.aurum.crm.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalProducts,
        long totalCategories,
        long totalCustomers,
        long totalOrders,
        long pendingOrders,
        long completedOrders,
        BigDecimal monthlyRevenue,
        long lowStockProducts,
        List<MonthlySales> monthlySales,
        List<NameValue> topSellingProducts,
        List<NameValue> categoryDistribution
) {
    public record MonthlySales(int month, String label, BigDecimal revenue, long orders) {}
    public record NameValue(String name, long value) {}
}
