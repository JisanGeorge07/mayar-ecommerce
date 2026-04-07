using Mayar.Api.Common;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class ProductService(AppDbContext context) : IProductService
{
    public async Task<List<ProductDto>> GetAllAsync()
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .ToListAsync();

        return products.Select(p => p.ToProductDto()).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .FirstOrDefaultAsync(p => p.Id == id);

        return product?.ToProductDto();
    }

    public async Task<List<ProductDto>> GetByIdsAsync(List<Guid> ids)
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => ids.Contains(p.Id) && p.IsActive)
            .ToListAsync();

        // Preserve the order of IDs
        var productDict = products.ToDictionary(p => p.Id);
        return ids
            .Where(id => productDict.ContainsKey(id))
            .Select(id => productDict[id].ToProductDto())
            .ToList();
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var product = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        return product?.ToProductDto();
    }

    public async Task<List<ProductDto>> GetBestSellersAsync()
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => p.IsBestSeller == true && p.IsActive)
            .ToListAsync();

        return products.Select(p => p.ToProductDto()).ToList();
    }

    public async Task<List<ProductDto>> GetNewArrivalsAsync()
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => p.IsNew == true && p.IsActive)
            .ToListAsync();

        return products.Select(p => p.ToProductDto()).ToList();
    }

    public async Task<List<ProductDto>> GetFeaturedAsync()
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => p.IsFeatured == true && p.IsActive)
            .ToListAsync();

        return products.Select(p => p.ToProductDto()).ToList();
    }

    public async Task<List<ProductDto>> GetOnSaleAsync()
    {
        var products = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => p.IsOnSale == true && p.IsActive)
            .ToListAsync();

        return products.Select(p => p.ToProductDto()).ToList();
    }

    public async Task<PaginatedResult<ProductDto>> GetFilteredAsync(ProductFilterDto filter)
    {
        var query = context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductColor)
            .Include(p => p.Variants)
                .ThenInclude(v => v.ProductSize)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .Where(p => p.IsActive)
            .AsQueryable();

        // Apply filters
        if (filter.TopCategoryId.HasValue)
            query = query.Where(p => p.TopCategoryId == filter.TopCategoryId.Value);

        if (filter.MiddleCategoryId.HasValue)
            query = query.Where(p => p.MiddleCategoryId == filter.MiddleCategoryId.Value);

        if (filter.BottomCategoryId.HasValue)
            query = query.Where(p => p.BottomCategoryId == filter.BottomCategoryId.Value);

        if (filter.IsOnSale.HasValue && filter.IsOnSale.Value)
            query = query.Where(p => p.IsOnSale == true);

        if (filter.InStock.HasValue && filter.InStock.Value)
            query = query.Where(p => p.InStock == true);

        if (filter.IsNew.HasValue && filter.IsNew.Value)
            query = query.Where(p => p.IsNew == true);

        if (filter.IsBestSeller.HasValue && filter.IsBestSeller.Value)
            query = query.Where(p => p.IsBestSeller == true);

        if (!string.IsNullOrEmpty(filter.Status))
            query = query.Where(p => p.Status == filter.Status);

        if (filter.Colors != null && filter.Colors.Count > 0)
        {
            // Filter by color hex (case-insensitive) - Colors list contains hex values
            var lowerColors = filter.Colors.Select(c => c.ToLower()).ToList();
            query = query.Where(p => p.Colors.Any(c => c.Hex != null && lowerColors.Contains(c.Hex.ToLower())));
        }

        if (filter.Sizes != null && filter.Sizes.Count > 0)
            query = query.Where(p => p.Sizes.Any(s => filter.Sizes.Contains(s.Label)));

        if (filter.Brands != null && filter.Brands.Count > 0)
            query = query.Where(p => filter.Brands.Contains(p.BrandEnglish));

        // Load all products (before price filtering and sorting)
        var allProducts = await query.ToListAsync();

        // Determine currency for price filtering and sorting
        bool useInr = filter.Currency?.ToUpper() == "INR";

        // Helper function to get the effective display price for a product
        decimal GetEffectivePrice(Product p, bool isInr)
        {
            var defaultVariant = p.Variants?.FirstOrDefault(v => v.IsDefault);
            if (defaultVariant != null)
            {
                var variantPrice = isInr ? defaultVariant.BasePriceINR : defaultVariant.BasePriceKWD;
                if (variantPrice.HasValue)
                    return variantPrice.Value;
            }
            var productPrice = isInr ? p.BasePriceINR : p.BasePriceKWD;
            return productPrice ?? 0;
        }

        // Apply price filtering based on effective price (variant price if exists, otherwise product price)
        var filteredProducts = allProducts.AsEnumerable();

        if (filter.MinPrice.HasValue)
        {
            filteredProducts = filteredProducts.Where(p => GetEffectivePrice(p, useInr) >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            filteredProducts = filteredProducts.Where(p => GetEffectivePrice(p, useInr) <= filter.MaxPrice.Value);
        }

        // Convert to list after price filtering
        var filteredList = filteredProducts.ToList();
        var totalCount = filteredList.Count;

        // Apply sorting based on effective price
        IEnumerable<Product> sortedProducts = filter.SortBy switch
        {
            "price-asc" => filteredList.OrderBy(p => GetEffectivePrice(p, useInr)),
            "price-desc" => filteredList.OrderByDescending(p => GetEffectivePrice(p, useInr)),
            "rating" => filteredList.OrderByDescending(p => p.Rating),
            "popular" => filteredList.OrderByDescending(p => p.ReviewCount),
            "newest" => filteredList.OrderByDescending(p => p.IsNew).ThenByDescending(p => p.Id),
            _ => filteredList.OrderByDescending(p => p.Id)
        };

        // Apply pagination
        var paginatedProducts = sortedProducts
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();

        return new PaginatedResult<ProductDto>
        {
            Items = paginatedProducts.Select(p => p.ToProductDto()).ToList(),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<ShopDataDto> GetShopDataAsync()
    {
        // Get categories with product counts
        var topCategories = await context.TopCategories
            .Where(c => c.IsActive)
            .ToListAsync();

        var categoryProductCounts = await context.Products
            .Where(p => p.IsActive)
            .GroupBy(p => p.TopCategoryId)
            .Select(g => new { TopCategoryId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.TopCategoryId, x => x.Count);

        var categories = topCategories.Select(c => new ShopCategoryDto
        {
            Id = c.Id,
            Slug = c.Slug ?? string.Empty,
            Name = new TranslatedTextDto { En = c.TitleEnglish, Ar = c.TitleArabic },
            ProductCount = categoryProductCounts.GetValueOrDefault(c.Id, 0)
        }).ToList();

        // Get unique brands
        var brands = await context.Products
            .Where(p => p.IsActive && !string.IsNullOrEmpty(p.BrandEnglish))
            .Select(p => p.BrandEnglish!)
            .Distinct()
            .OrderBy(b => b)
            .ToListAsync();

        // Get unique colors from all products - group by hex to avoid duplicates
        var allColors = await context.ProductColors
            .Where(c => c.IsActive && !string.IsNullOrEmpty(c.Hex))
            .ToListAsync();

        // Deduplicate colors by hex code (case-insensitive)
        var uniqueColors = allColors
            .GroupBy(c => c.Hex?.ToLower() ?? string.Empty)
            .Select(g => g.First())
            .Select(c => new ShopColorDto
            {
                Id = c.Hex?.ToLower() ?? string.Empty, // Use hex as ID for filtering
                Name = new TranslatedTextDto { En = c.NameEnglish, Ar = c.NameArabic },
                Hex = c.Hex ?? string.Empty
            })
            .ToList();

        // Get price ranges based on effective display price (default variant price if exists, otherwise product price)
        var activeProducts = await context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Variants)
            .ToListAsync();

        var effectivePricesKWD = new List<decimal>();
        var effectivePricesINR = new List<decimal>();

        foreach (var product in activeProducts)
        {
            // Get default variant or first variant
            var defaultVariant = product.Variants?.FirstOrDefault(v => v.IsDefault) ?? product.Variants?.FirstOrDefault();

            decimal? effectiveKWD = defaultVariant?.BasePriceKWD ?? product.BasePriceKWD;
            decimal? effectiveINR = defaultVariant?.BasePriceINR ?? product.BasePriceINR;

            if (effectiveKWD.HasValue)
                effectivePricesKWD.Add(effectiveKWD.Value);

            if (effectiveINR.HasValue)
                effectivePricesINR.Add(effectiveINR.Value);
        }

        var minPriceKWD = effectivePricesKWD.Count > 0 ? effectivePricesKWD.Min() : 0;
        var maxPriceKWD = effectivePricesKWD.Count > 0 ? effectivePricesKWD.Max() : 100;
        var minPriceINR = effectivePricesINR.Count > 0 ? effectivePricesINR.Min() : 0;
        var maxPriceINR = effectivePricesINR.Count > 0 ? effectivePricesINR.Max() : 10000;

        return new ShopDataDto
        {
            Categories = categories,
            Brands = brands,
            Colors = uniqueColors,
            MinPrice = minPriceKWD, // Keep for backwards compatibility
            MaxPrice = maxPriceKWD,
            MinPriceKWD = minPriceKWD,
            MaxPriceKWD = maxPriceKWD,
            MinPriceINR = minPriceINR,
            MaxPriceINR = maxPriceINR
        };
    }

    public async Task<ProductDto> CreateAsync(ProductDto productDto)
    {
        var product = productDto.ToProductEntity();
        product.Id = Guid.NewGuid();

        // Generate slug from English name
        if (string.IsNullOrEmpty(product.Slug) && !string.IsNullOrEmpty(productDto.NameEnglish))
        {
            product.Slug = SlugGenerator.GenerateSlug(productDto.NameEnglish);
        }

        context.Products.Add(product);
        await context.SaveChangesAsync();

        return product.ToProductDto();
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, ProductDto productDto)
    {
        var existingProduct = await context.Products.FindAsync(id);

        if (existingProduct == null)
        {
            return null;
        }


        existingProduct.TopCategoryId = productDto.TopCategoryId;
        existingProduct.MiddleCategoryId = productDto.MiddleCategoryId;
        existingProduct.BottomCategoryId = productDto.BottomCategoryId;
        existingProduct.BrandEnglish = productDto.BrandEnglish;
        existingProduct.BrandArabic = productDto.BrandArabic;
        existingProduct.NameEnglish = productDto.NameEnglish;
        existingProduct.NameArabic = productDto.NameArabic;
        existingProduct.ShortDescriptionEnglish = productDto.ShortDescriptionEnglish;
        existingProduct.ShortDescriptionArabic = productDto.ShortDescriptionArabic;
        existingProduct.FullDescriptionEnglish = productDto.FullDescriptionEnglish;
        existingProduct.FullDescriptionArabic = productDto.FullDescriptionArabic;
        existingProduct.BasePriceKWD = productDto.BasePriceKWD;
        existingProduct.CompareAtPriceKWD = productDto.CompareAtPriceKWD;
        existingProduct.BasePriceINR = productDto.BasePriceINR;
        existingProduct.CompareAtPriceINR = productDto.CompareAtPriceINR;
        existingProduct.Rating = productDto.Rating;
        existingProduct.ReviewCount = productDto.ReviewCount;
        existingProduct.IsNew = productDto.IsNew;
        existingProduct.IsBestSeller = productDto.IsBestSeller;
        existingProduct.IsFeatured = productDto.IsFeatured;
        existingProduct.IsOnSale = productDto.IsOnSale;
        existingProduct.InStock = productDto.InStock;
        existingProduct.ShippingInfoEnglish = productDto.ShippingInfoEnglish;
        existingProduct.ShippingInfoArabic = productDto.ShippingInfoArabic;
        existingProduct.ReturnInfoEnglish = productDto.ReturnInfoEnglish;
        existingProduct.ReturnInfoArabic = productDto.ReturnInfoArabic;
        existingProduct.IsActive = productDto.IsActive;
        existingProduct.Status = productDto.Status;

        // SEO Metadata
        existingProduct.MetaTitle = productDto.MetaTitle;
        existingProduct.CanonicalUrl = productDto.CanonicalUrl;
        existingProduct.MetaKeywords = productDto.MetaKeywords;
        existingProduct.MetaDescription = productDto.MetaDescription;
        existingProduct.OGTitle = productDto.OGTitle;
        existingProduct.OGDescription = productDto.OGDescription;
        existingProduct.OGImageUrl = productDto.OGImageUrl;
        existingProduct.TwitterTitle = productDto.TwitterTitle;
        existingProduct.TwitterDescription = productDto.TwitterDescription;

        // Update slug: prefer manual slug, otherwise auto-generate if empty
        if (!string.IsNullOrEmpty(productDto.Slug))
        {
            // Use the manually provided slug
            existingProduct.Slug = productDto.Slug;
        }
        else if (string.IsNullOrEmpty(existingProduct.Slug) && !string.IsNullOrEmpty(productDto.NameEnglish))
        {
            // Only auto-generate if no slug exists and we have a name
            existingProduct.Slug = SlugGenerator.GenerateSlug(productDto.NameEnglish);
        }

        await context.SaveChangesAsync();

        return existingProduct.ToProductDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingProduct = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
            .Include(p => p.Features)
            .Include(p => p.Specifications)
            .Include(p => p.CareInstructions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (existingProduct == null)
        {
            return false;
        }

        context.Products.Remove(existingProduct);
        await context.SaveChangesAsync();

        return true;
    }
}
