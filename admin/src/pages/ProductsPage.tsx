import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { categoryService, subcategoryService, productTypeService, productService } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Eye, Trash2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Category, Subcategory, ProductType, Product } from '@/types';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all');
  const [ptFilter, setPtFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [cats, subs, pts, prods] = await Promise.all([
        categoryService.getCategories(),
        subcategoryService.getSubcategories(),
        productTypeService.getProductTypes(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setProductTypes(pts);
      setProducts(prods);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filter subcategories based on selected category
  const filteredSubs = catFilter === 'all'
    ? subcategories
    : subcategories.filter(s => s.category_id === catFilter);

  // Filter product types based on selected subcategory
  const filteredPts = subFilter === 'all'
    ? productTypes
    : productTypes.filter(p => p.subcategory_id === subFilter);

  // Apply all filters to products
  const filtered = products.filter(p => {
    // Search filter
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.brand.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Category filter
    if (catFilter !== 'all' && p.category_id !== catFilter) return false;
    // Subcategory filter
    if (subFilter !== 'all' && p.subcategory_id !== subFilter) return false;
    // Product type filter
    if (ptFilter !== 'all' && p.product_type_id !== ptFilter) return false;
    // Status filter
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '-';
  const getSubName = (id: string) => subcategories.find(s => s.id === id)?.name || '-';
  const getPtName = (id: string) => productTypes.find(p => p.id === id)?.name || '-';

  const statusColor = (s: string) => s === 'active' ? 'default' : 'secondary';

  // Action handlers
  const handleEdit = (productId: string) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleView = (productId: string) => {
    navigate(`/products/view/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const success = await productService.deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully');
        load(); // Refresh the list
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">All Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your product catalog ({products.length} total)
            </p>
          </div>
          <Link to="/products/new">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by name or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-56"
          />
          <Select value={catFilter} onValueChange={v => { setCatFilter(v); setSubFilter('all'); setPtFilter('all'); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={subFilter} onValueChange={v => { setSubFilter(v); setPtFilter('all'); }}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Subcategory" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {filteredSubs.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={ptFilter} onValueChange={setPtFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Product Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filteredPts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="rounded-lg border border-border bg-card p-12 shadow-sm text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="rounded-lg border border-border bg-card p-12 shadow-sm text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-display text-base font-semibold text-foreground mb-1">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {products.length === 0 ? 'Create your first product to get started' : 'Try adjusting your filters'}
            </p>
            {products.length === 0 && (
              <Link to="/products/new"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Product</Button></Link>
            )}
          </div>
        ) : (
          /* Product table */
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subcategory</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-10 w-10 rounded object-cover"
                          onError={(e) => {
                            // Fallback to placeholder on error
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`h-10 w-10 rounded bg-muted flex items-center justify-center ${p.image_url ? 'hidden' : ''}`}>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{getCatName(p.category_id)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{getSubName(p.subcategory_id)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{getPtName(p.product_type_id)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.brand || '-'}</td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{p.base_price_kwd} KWD</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <Badge variant={p.stock_status === 'in_stock' ? 'default' : 'destructive'} className="text-xs">
                        {p.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColor(p.status) as 'default' | 'secondary' | 'outline'} className="capitalize text-xs">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(p.id)}
                          title="Edit product"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(p.id)}
                          title="View product"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                          title="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
