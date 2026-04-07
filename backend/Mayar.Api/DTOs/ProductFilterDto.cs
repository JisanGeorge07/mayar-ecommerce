using System;
using System.Collections.Generic;

namespace Mayar.Api.DTOs;

public class ProductFilterDto
{
    public Guid? TopCategoryId { get; set; }
    public Guid? MiddleCategoryId { get; set; }
    public Guid? BottomCategoryId { get; set; }
    public List<string>? Colors { get; set; }
    public List<string>? Sizes { get; set; }
    public List<string>? Brands { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Currency { get; set; } // KWD or INR
    public bool? IsOnSale { get; set; }
    public bool? InStock { get; set; }
    public bool? IsNew { get; set; }
    public bool? IsBestSeller { get; set; }
    public string? Status { get; set; } // active, draft
    public string? SortBy { get; set; } // newest, price-asc, price-desc, rating, popular
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public class ShopDataDto
{
    public List<ShopCategoryDto> Categories { get; set; } = new();
    public List<string> Brands { get; set; } = new();
    public List<ShopColorDto> Colors { get; set; } = new();
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public decimal MinPriceKWD { get; set; }
    public decimal MaxPriceKWD { get; set; }
    public decimal MinPriceINR { get; set; }
    public decimal MaxPriceINR { get; set; }
}

public class ShopCategoryDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public TranslatedTextDto Name { get; set; } = new();
    public int ProductCount { get; set; }
}

public class ShopColorDto
{
    public string Id { get; set; } = string.Empty; // Use hex as ID for filtering
    public TranslatedTextDto Name { get; set; } = new();
    public string Hex { get; set; } = string.Empty;
}
