import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productApi,
  productColorApi,
  productSizeApi,
  productImageApi,
  productFeatureApi,
  productSpecificationApi,
  productCareInstructionApi,
  type ProductDto,
  type ProductColorDto,
  type ProductSizeDto,
  type ProductImageDto,
  type ProductFeatureDto,
  type ProductSpecificationDto,
  type ProductCareInstructionDto,
} from "@/services/api/productService";
import api from "@/lib/axios";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Package,
  Palette,
  Ruler,
  Image,
  ArrowLeft,
  Star,
  ListChecks,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TopCategoryDto {
  id: string;
  slug: string;
  nameEnglish: string;
  nameArabic: string;
}

interface MiddleCategoryDto {
  id: string;
  topCategoryId: string;
  slug: string;
  nameEnglish: string;
  nameArabic: string;
}

interface BottomCategoryDto {
  id: string;
  middleCategoryId: string;
  slug: string;
  nameEnglish: string;
  nameArabic: string;
}

const AdminProductPage = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  // Category states
  const [topCategories, setTopCategories] = useState<TopCategoryDto[]>([]);
  const [middleCategories, setMiddleCategories] = useState<MiddleCategoryDto[]>([]);
  const [bottomCategories, setBottomCategories] = useState<BottomCategoryDto[]>([]);
  const [filteredMiddleCategories, setFilteredMiddleCategories] = useState<MiddleCategoryDto[]>([]);
  const [filteredBottomCategories, setFilteredBottomCategories] = useState<BottomCategoryDto[]>([]);

  // Product form state
  const [productForm, setProductForm] = useState({
    topCategoryId: "",
    middleCategoryId: "",
    bottomCategoryId: "",
    brandEnglish: "",
    brandArabic: "",
    nameEnglish: "",
    nameArabic: "",
    shortDescriptionEnglish: "",
    shortDescriptionArabic: "",
    fullDescriptionEnglish: "",
    fullDescriptionArabic: "",
    basePriceKWD: "",
    compareAtPriceKWD: "",
    basePriceINR: "",
    compareAtPriceINR: "",
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    isOnSale: false,
    inStock: true,
    isActive: true,
  });

  // Color form state
  const [colorForm, setColorForm] = useState({
    productId: "",
    nameEnglish: "",
    nameArabic: "",
    hex: "#000000",
    isActive: true,
  });

  // Size form state
  const [sizeForm, setSizeForm] = useState({
    productId: "",
    label: "",
    stock: "",
    isActive: true,
  });

  // Image form state
  const [imageForm, setImageForm] = useState({
    productId: "",
    imageFile: null as File | null,
    imageAlt: "",
    isActive: true,
  });

  // Feature form state
  const [featureForm, setFeatureForm] = useState({
    productId: "",
    iconName: "",
    labelEnglish: "",
    labelArabic: "",
    isActive: true,
  });

  // Specification form state
  const [specificationForm, setSpecificationForm] = useState({
    productId: "",
    labelEnglish: "",
    labelArabic: "",
    valueEnglish: "",
    valueArabic: "",
    isActive: true,
  });

  // Care Instruction form state
  const [careInstructionForm, setCareInstructionForm] = useState({
    productId: "",
    instructionEnglish: "",
    instructionArabic: "",
    isActive: true,
  });

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [specificationDialogOpen, setSpecificationDialogOpen] = useState(false);
  const [careInstructionDialogOpen, setCareInstructionDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Product detail states
  const [productColors, setProductColors] = useState<ProductColorDto[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSizeDto[]>([]);
  const [productImages, setProductImages] = useState<ProductImageDto[]>([]);
  const [productFeatures, setProductFeatures] = useState<ProductFeatureDto[]>([]);
  const [productSpecifications, setProductSpecifications] = useState<ProductSpecificationDto[]>([]);
  const [productCareInstructions, setProductCareInstructions] = useState<ProductCareInstructionDto[]>([]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll();
      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const [topRes, middleRes, bottomRes] = await Promise.all([
        api.get("/Category/top"),
        api.get("/Category/middle"),
        api.get("/Category/bottom"),
      ]);

      if (topRes.data.success) setTopCategories(topRes.data.data || []);
      if (middleRes.data.success) setMiddleCategories(middleRes.data.data || []);
      if (bottomRes.data.success) setBottomCategories(bottomRes.data.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  // Filter middle categories based on selected top category
  useEffect(() => {
    if (productForm.topCategoryId) {
      const filtered = middleCategories.filter(
        (m) => m.topCategoryId === productForm.topCategoryId
      );
      setFilteredMiddleCategories(filtered);
      // Reset middle and bottom selection if top category changes
      if (!filtered.find((m) => m.id === productForm.middleCategoryId)) {
        setProductForm((prev) => ({
          ...prev,
          middleCategoryId: "",
          bottomCategoryId: "",
        }));
        setFilteredBottomCategories([]);
      }
    } else {
      setFilteredMiddleCategories([]);
      setFilteredBottomCategories([]);
    }
  }, [productForm.topCategoryId, middleCategories]);

  // Filter bottom categories based on selected middle category
  useEffect(() => {
    if (productForm.middleCategoryId) {
      const filtered = bottomCategories.filter(
        (b) => b.middleCategoryId === productForm.middleCategoryId
      );
      setFilteredBottomCategories(filtered);
      // Reset bottom selection if middle category changes
      if (!filtered.find((b) => b.id === productForm.bottomCategoryId)) {
        setProductForm((prev) => ({ ...prev, bottomCategoryId: "" }));
      }
    } else {
      setFilteredBottomCategories([]);
    }
  }, [productForm.middleCategoryId, bottomCategories]);

  // Fetch product details (colors, sizes, images, features, specifications, care instructions)
  const fetchProductDetails = async (productId: string) => {
    try {
      const [colorsRes, sizesRes, imagesRes, featuresRes, specsRes, careRes] = await Promise.all([
        productColorApi.getByProductId(productId),
        productSizeApi.getByProductId(productId),
        productImageApi.getByProductId(productId),
        productFeatureApi.getByProductId(productId),
        productSpecificationApi.getByProductId(productId),
        productCareInstructionApi.getByProductId(productId),
      ]);

      if (colorsRes.data.success) setProductColors(colorsRes.data.data || []);
      if (sizesRes.data.success) setProductSizes(sizesRes.data.data || []);
      if (imagesRes.data.success) setProductImages(imagesRes.data.data || []);
      if (featuresRes.data.success) setProductFeatures(featuresRes.data.data || []);
      if (specsRes.data.success) setProductSpecifications(specsRes.data.data || []);
      if (careRes.data.success) setProductCareInstructions(careRes.data.data || []);
    } catch {
      toast.error("Failed to fetch product details");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductDetails(selectedProduct.id);
    }
  }, [selectedProduct]);

  // Product CRUD
  const handleProductSubmit = async () => {
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      if (editingId) {
        await productApi.update(editingId, formData);
        toast.success("Product updated successfully");
      } else {
        await productApi.create(formData);
        toast.success("Product created successfully");
      }
      setProductDialogOpen(false);
      resetProductForm();
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleProductEdit = (product: ProductDto) => {
    setEditingId(product.id);
    setProductForm({
      topCategoryId: product.topCategoryId || "",
      middleCategoryId: product.middleCategoryId || "",
      bottomCategoryId: product.bottomCategoryId || "",
      brandEnglish: product.brandEnglish || "",
      brandArabic: product.brandArabic || "",
      nameEnglish: product.nameEnglish || "",
      nameArabic: product.nameArabic || "",
      shortDescriptionEnglish: product.shortDescriptionEnglish || "",
      shortDescriptionArabic: product.shortDescriptionArabic || "",
      fullDescriptionEnglish: product.fullDescriptionEnglish || "",
      fullDescriptionArabic: product.fullDescriptionArabic || "",
      basePriceKWD: String(product.basePriceKWD || ""),
      compareAtPriceKWD: String(product.compareAtPriceKWD || ""),
      basePriceINR: String(product.basePriceINR || ""),
      compareAtPriceINR: String(product.compareAtPriceINR || ""),
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      inStock: product.inStock ?? true,
      isActive: product.isActive ?? true,
    });
    setProductDialogOpen(true);
  };

  const handleProductDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productApi.delete(id);
      toast.success("Product deleted successfully");
      fetchProducts();
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProductForm({
      topCategoryId: "",
      middleCategoryId: "",
      bottomCategoryId: "",
      brandEnglish: "",
      brandArabic: "",
      nameEnglish: "",
      nameArabic: "",
      shortDescriptionEnglish: "",
      shortDescriptionArabic: "",
      fullDescriptionEnglish: "",
      fullDescriptionArabic: "",
      basePriceKWD: "",
      compareAtPriceKWD: "",
      basePriceINR: "",
      compareAtPriceINR: "",
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      isOnSale: false,
      inStock: true,
      isActive: true,
    });
  };

  // Color CRUD
  const handleColorSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("nameEnglish", colorForm.nameEnglish);
    formData.append("nameArabic", colorForm.nameArabic);
    formData.append("hex", colorForm.hex);
    formData.append("isActive", String(colorForm.isActive));

    try {
      if (editingId) {
        await productColorApi.update(editingId, formData);
        toast.success("Color updated successfully");
      } else {
        await productColorApi.create(formData);
        toast.success("Color created successfully");
      }
      setColorDialogOpen(false);
      resetColorForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save color");
    }
  };

  const handleColorEdit = (color: ProductColorDto) => {
    setEditingId(color.id);
    setColorForm({
      productId: color.productId,
      nameEnglish: color.nameEnglish || "",
      nameArabic: color.nameArabic || "",
      hex: color.hex || "#000000",
      isActive: color.isActive,
    });
    setColorDialogOpen(true);
  };

  const handleColorDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this color?")) return;
    try {
      await productColorApi.delete(id);
      toast.success("Color deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete color");
    }
  };

  const resetColorForm = () => {
    setEditingId(null);
    setColorForm({
      productId: "",
      nameEnglish: "",
      nameArabic: "",
      hex: "#000000",
      isActive: true,
    });
  };

  // Size CRUD
  const handleSizeSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("label", sizeForm.label);
    formData.append("stock", sizeForm.stock);
    formData.append("isActive", String(sizeForm.isActive));

    try {
      if (editingId) {
        await productSizeApi.update(editingId, formData);
        toast.success("Size updated successfully");
      } else {
        await productSizeApi.create(formData);
        toast.success("Size created successfully");
      }
      setSizeDialogOpen(false);
      resetSizeForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save size");
    }
  };

  const handleSizeEdit = (size: ProductSizeDto) => {
    setEditingId(size.id);
    setSizeForm({
      productId: size.productId,
      label: size.label || "",
      stock: String(size.stock || ""),
      isActive: size.isActive,
    });
    setSizeDialogOpen(true);
  };

  const handleSizeDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;
    try {
      await productSizeApi.delete(id);
      toast.success("Size deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete size");
    }
  };

  const resetSizeForm = () => {
    setEditingId(null);
    setSizeForm({
      productId: "",
      label: "",
      stock: "",
      isActive: true,
    });
  };

  // Image CRUD
  const handleImageSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    if (imageForm.imageFile) {
      formData.append("imageFile", imageForm.imageFile);
    }
    formData.append("imageAlt", imageForm.imageAlt);
    formData.append("isActive", String(imageForm.isActive));

    try {
      if (editingId) {
        await productImageApi.update(editingId, formData);
        toast.success("Image updated successfully");
      } else {
        await productImageApi.create(formData);
        toast.success("Image uploaded successfully");
      }
      setImageDialogOpen(false);
      resetImageForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save image");
    }
  };

  const handleImageDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await productImageApi.delete(id);
      toast.success("Image deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const resetImageForm = () => {
    setEditingId(null);
    setImageForm({
      productId: "",
      imageFile: null,
      imageAlt: "",
      isActive: true,
    });
  };

  // Feature CRUD
  const handleFeatureSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("iconName", featureForm.iconName);
    formData.append("labelEnglish", featureForm.labelEnglish);
    formData.append("labelArabic", featureForm.labelArabic);
    formData.append("isActive", String(featureForm.isActive));

    try {
      if (editingId) {
        await productFeatureApi.update(editingId, formData);
        toast.success("Feature updated successfully");
      } else {
        await productFeatureApi.create(formData);
        toast.success("Feature created successfully");
      }
      setFeatureDialogOpen(false);
      resetFeatureForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save feature");
    }
  };

  const handleFeatureEdit = (feature: ProductFeatureDto) => {
    setEditingId(feature.id);
    setFeatureForm({
      productId: feature.productId,
      iconName: feature.iconName || "",
      labelEnglish: feature.labelEnglish || "",
      labelArabic: feature.labelArabic || "",
      isActive: feature.isActive,
    });
    setFeatureDialogOpen(true);
  };

  const handleFeatureDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    try {
      await productFeatureApi.delete(id);
      toast.success("Feature deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete feature");
    }
  };

  const resetFeatureForm = () => {
    setEditingId(null);
    setFeatureForm({
      productId: "",
      iconName: "",
      labelEnglish: "",
      labelArabic: "",
      isActive: true,
    });
  };

  // Specification CRUD
  const handleSpecificationSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("labelEnglish", specificationForm.labelEnglish);
    formData.append("labelArabic", specificationForm.labelArabic);
    formData.append("valueEnglish", specificationForm.valueEnglish);
    formData.append("valueArabic", specificationForm.valueArabic);
    formData.append("isActive", String(specificationForm.isActive));

    try {
      if (editingId) {
        await productSpecificationApi.update(editingId, formData);
        toast.success("Specification updated successfully");
      } else {
        await productSpecificationApi.create(formData);
        toast.success("Specification created successfully");
      }
      setSpecificationDialogOpen(false);
      resetSpecificationForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save specification");
    }
  };

  const handleSpecificationEdit = (spec: ProductSpecificationDto) => {
    setEditingId(spec.id);
    setSpecificationForm({
      productId: spec.productId,
      labelEnglish: spec.labelEnglish || "",
      labelArabic: spec.labelArabic || "",
      valueEnglish: spec.valueEnglish || "",
      valueArabic: spec.valueArabic || "",
      isActive: spec.isActive,
    });
    setSpecificationDialogOpen(true);
  };

  const handleSpecificationDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specification?")) return;
    try {
      await productSpecificationApi.delete(id);
      toast.success("Specification deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete specification");
    }
  };

  const resetSpecificationForm = () => {
    setEditingId(null);
    setSpecificationForm({
      productId: "",
      labelEnglish: "",
      labelArabic: "",
      valueEnglish: "",
      valueArabic: "",
      isActive: true,
    });
  };

  // Care Instruction CRUD
  const handleCareInstructionSubmit = async () => {
    if (!selectedProduct) return;
    const formData = new FormData();
    formData.append("productId", selectedProduct.id);
    formData.append("instructionEnglish", careInstructionForm.instructionEnglish);
    formData.append("instructionArabic", careInstructionForm.instructionArabic);
    formData.append("isActive", String(careInstructionForm.isActive));

    try {
      if (editingId) {
        await productCareInstructionApi.update(editingId, formData);
        toast.success("Care instruction updated successfully");
      } else {
        await productCareInstructionApi.create(formData);
        toast.success("Care instruction created successfully");
      }
      setCareInstructionDialogOpen(false);
      resetCareInstructionForm();
      fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to save care instruction");
    }
  };

  const handleCareInstructionEdit = (instruction: ProductCareInstructionDto) => {
    setEditingId(instruction.id);
    setCareInstructionForm({
      productId: instruction.productId,
      instructionEnglish: instruction.instructionEnglish || "",
      instructionArabic: instruction.instructionArabic || "",
      isActive: instruction.isActive,
    });
    setCareInstructionDialogOpen(true);
  };

  const handleCareInstructionDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this care instruction?")) return;
    try {
      await productCareInstructionApi.delete(id);
      toast.success("Care instruction deleted successfully");
      if (selectedProduct) fetchProductDetails(selectedProduct.id);
    } catch {
      toast.error("Failed to delete care instruction");
    }
  };

  const resetCareInstructionForm = () => {
    setEditingId(null);
    setCareInstructionForm({
      productId: "",
      instructionEnglish: "",
      instructionArabic: "",
      isActive: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Admin - Product Management</h1>
            </div>
            <Button onClick={fetchProducts} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products ({products.length})
                </CardTitle>
                <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetProductForm} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Cascading Category Selection */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Top Category *</Label>
                          <Select
                            value={productForm.topCategoryId}
                            onValueChange={(v) =>
                              setProductForm({
                                ...productForm,
                                topCategoryId: v,
                                middleCategoryId: "",
                                bottomCategoryId: "",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select top category" />
                            </SelectTrigger>
                            <SelectContent>
                              {topCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.nameEnglish}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Middle Category</Label>
                          <Select
                            value={productForm.middleCategoryId}
                            onValueChange={(v) =>
                              setProductForm({
                                ...productForm,
                                middleCategoryId: v,
                                bottomCategoryId: "",
                              })
                            }
                            disabled={!productForm.topCategoryId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={productForm.topCategoryId ? "Select middle" : "Select top first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredMiddleCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.nameEnglish}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Bottom Category</Label>
                          <Select
                            value={productForm.bottomCategoryId}
                            onValueChange={(v) =>
                              setProductForm({ ...productForm, bottomCategoryId: v })
                            }
                            disabled={!productForm.middleCategoryId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={productForm.middleCategoryId ? "Select bottom" : "Select middle first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredBottomCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.nameEnglish}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Brand (English)</Label>
                          <Input
                            value={productForm.brandEnglish}
                            onChange={(e) =>
                              setProductForm({ ...productForm, brandEnglish: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Brand (Arabic)</Label>
                          <Input
                            value={productForm.brandArabic}
                            onChange={(e) =>
                              setProductForm({ ...productForm, brandArabic: e.target.value })
                            }
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name (English)</Label>
                          <Input
                            value={productForm.nameEnglish}
                            onChange={(e) =>
                              setProductForm({ ...productForm, nameEnglish: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Name (Arabic)</Label>
                          <Input
                            value={productForm.nameArabic}
                            onChange={(e) =>
                              setProductForm({ ...productForm, nameArabic: e.target.value })
                            }
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Short Description (English)</Label>
                          <Textarea
                            value={productForm.shortDescriptionEnglish}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                shortDescriptionEnglish: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Short Description (Arabic)</Label>
                          <Textarea
                            value={productForm.shortDescriptionArabic}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                shortDescriptionArabic: e.target.value,
                              })
                            }
                            rows={2}
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Base Price (KWD)</Label>
                          <Input
                            type="number"
                            step="0.001"
                            value={productForm.basePriceKWD}
                            onChange={(e) =>
                              setProductForm({ ...productForm, basePriceKWD: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Compare At Price (KWD)</Label>
                          <Input
                            type="number"
                            step="0.001"
                            value={productForm.compareAtPriceKWD}
                            onChange={(e) =>
                              setProductForm({ ...productForm, compareAtPriceKWD: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Base Price (INR)</Label>
                          <Input
                            type="number"
                            step="1"
                            value={productForm.basePriceINR}
                            onChange={(e) =>
                              setProductForm({ ...productForm, basePriceINR: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Compare At Price (INR)</Label>
                          <Input
                            type="number"
                            step="1"
                            value={productForm.compareAtPriceINR}
                            onChange={(e) =>
                              setProductForm({ ...productForm, compareAtPriceINR: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isNew}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, isNew: v })
                            }
                          />
                          <Label>Is New</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isBestSeller}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, isBestSeller: v })
                            }
                          />
                          <Label>Best Seller</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isFeatured}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, isFeatured: v })
                            }
                          />
                          <Label>Featured</Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isOnSale}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, isOnSale: v })
                            }
                          />
                          <Label>On Sale</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.inStock}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, inStock: v })
                            }
                          />
                          <Label>In Stock</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isActive}
                            onCheckedChange={(v) =>
                              setProductForm({ ...productForm, isActive: v })
                            }
                          />
                          <Label>Active</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProductSubmit}>
                        {editingId ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No products found. Click "Add Product" to create one.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow
                          key={product.id}
                          className={`cursor-pointer ${selectedProduct?.id === product.id ? "bg-blue-50" : ""
                            }`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <TableCell className="font-medium">
                            {product.nameEnglish || "Untitled"}
                          </TableCell>
                          <TableCell>{product.brandEnglish || "-"}</TableCell>
                          <TableCell>${product.basePriceKWD || 0}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductEdit(product);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductDelete(product.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Details Panel */}
          <div>
            {selectedProduct ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedProduct.nameEnglish || "Product Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full grid grid-cols-3 mb-2">
                      <TabsTrigger value="colors" className="text-xs">
                        <Palette className="w-3 h-3 mr-1" />
                        Colors
                      </TabsTrigger>
                      <TabsTrigger value="sizes" className="text-xs">
                        <Ruler className="w-3 h-3 mr-1" />
                        Sizes
                      </TabsTrigger>
                      <TabsTrigger value="images" className="text-xs">
                        <Image className="w-3 h-3 mr-1" />
                        Images
                      </TabsTrigger>
                    </TabsList>
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="features" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Features
                      </TabsTrigger>
                      <TabsTrigger value="specs" className="text-xs">
                        <ListChecks className="w-3 h-3 mr-1" />
                        Specs
                      </TabsTrigger>
                      <TabsTrigger value="care" className="text-xs">
                        <Info className="w-3 h-3 mr-1" />
                        Care
                      </TabsTrigger>
                    </TabsList>

                    {/* Colors Tab */}
                    <TabsContent value="colors" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productColors.length} colors
                        </span>
                        <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetColorForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingId ? "Edit Color" : "Add Color"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Name (English)</Label>
                                <Input
                                  value={colorForm.nameEnglish}
                                  onChange={(e) =>
                                    setColorForm({ ...colorForm, nameEnglish: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Name (Arabic)</Label>
                                <Input
                                  value={colorForm.nameArabic}
                                  onChange={(e) =>
                                    setColorForm({ ...colorForm, nameArabic: e.target.value })
                                  }
                                  dir="rtl"
                                />
                              </div>
                              <div>
                                <Label>Color</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={colorForm.hex}
                                    onChange={(e) =>
                                      setColorForm({ ...colorForm, hex: e.target.value })
                                    }
                                    className="w-16 h-10 p-1"
                                  />
                                  <Input
                                    value={colorForm.hex}
                                    onChange={(e) =>
                                      setColorForm({ ...colorForm, hex: e.target.value })
                                    }
                                    placeholder="#000000"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={colorForm.isActive}
                                  onCheckedChange={(v) =>
                                    setColorForm({ ...colorForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setColorDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleColorSubmit}>
                                {editingId ? "Update" : "Create"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {productColors.map((color) => (
                          <div
                            key={color.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color.hex || "#000" }}
                              />
                              <span className="text-sm">{color.nameEnglish}</span>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleColorEdit(color)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleColorDelete(color.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productColors.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No colors added
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Sizes Tab */}
                    <TabsContent value="sizes" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productSizes.length} sizes
                        </span>
                        <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetSizeForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingId ? "Edit Size" : "Add Size"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Label (e.g., S, M, L, XL)</Label>
                                <Input
                                  value={sizeForm.label}
                                  onChange={(e) =>
                                    setSizeForm({ ...sizeForm, label: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={sizeForm.stock}
                                  onChange={(e) =>
                                    setSizeForm({ ...sizeForm, stock: e.target.value })
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={sizeForm.isActive}
                                  onCheckedChange={(v) =>
                                    setSizeForm({ ...sizeForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setSizeDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSizeSubmit}>
                                {editingId ? "Update" : "Create"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {productSizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{size.label}</span>
                              <span className="text-sm text-gray-500">
                                Stock: {size.stock || 0}
                              </span>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSizeEdit(size)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSizeDelete(size.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productSizes.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No sizes added
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="images" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productImages.length} images
                        </span>
                        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetImageForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload Image</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Image File</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    setImageForm({
                                      ...imageForm,
                                      imageFile: e.target.files?.[0] || null,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Alt Text</Label>
                                <Input
                                  value={imageForm.imageAlt}
                                  onChange={(e) =>
                                    setImageForm({ ...imageForm, imageAlt: e.target.value })
                                  }
                                  placeholder="Image description"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={imageForm.isActive}
                                  onCheckedChange={(v) =>
                                    setImageForm({ ...imageForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setImageDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleImageSubmit}>Upload</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {productImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.imageUrl || "/placeholder.png"}
                              alt={image.imageAlt || "Product image"}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleImageDelete(image.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productImages.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4 col-span-2">
                            No images uploaded
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Features Tab */}
                    <TabsContent value="features" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productFeatures.length} features
                        </span>
                        <Dialog open={featureDialogOpen} onOpenChange={setFeatureDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetFeatureForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingId ? "Edit Feature" : "Add Feature"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Icon Name</Label>
                                <Input
                                  value={featureForm.iconName}
                                  onChange={(e) =>
                                    setFeatureForm({ ...featureForm, iconName: e.target.value })
                                  }
                                  placeholder="e.g., waterproof"
                                />
                              </div>
                              <div>
                                <Label>Label (English)</Label>
                                <Input
                                  value={featureForm.labelEnglish}
                                  onChange={(e) =>
                                    setFeatureForm({ ...featureForm, labelEnglish: e.target.value })
                                  }
                                  placeholder="e.g., Waterproof design"
                                />
                              </div>
                              <div>
                                <Label>Label (Arabic)</Label>
                                <Input
                                  value={featureForm.labelArabic}
                                  onChange={(e) =>
                                    setFeatureForm({ ...featureForm, labelArabic: e.target.value })
                                  }
                                  dir="rtl"
                                  placeholder="e.g., تصميم مقاوم للماء"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={featureForm.isActive}
                                  onCheckedChange={(v) =>
                                    setFeatureForm({ ...featureForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setFeatureDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleFeatureSubmit}>
                                {editingId ? "Update" : "Create"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {productFeatures.map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              {feature.iconName ? (
                                <span className="text-sm">{feature.iconName}</span>
                              ) : (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="text-sm">{feature.labelEnglish}</span>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFeatureEdit(feature)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFeatureDelete(feature.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productFeatures.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No features added
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Specifications Tab */}
                    <TabsContent value="specs" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productSpecifications.length} specs
                        </span>
                        <Dialog open={specificationDialogOpen} onOpenChange={setSpecificationDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetSpecificationForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingId ? "Edit Specification" : "Add Specification"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Label (English)</Label>
                                  <Input
                                    value={specificationForm.labelEnglish}
                                    onChange={(e) =>
                                      setSpecificationForm({ ...specificationForm, labelEnglish: e.target.value })
                                    }
                                    placeholder="e.g., Material"
                                  />
                                </div>
                                <div>
                                  <Label>Label (Arabic)</Label>
                                  <Input
                                    value={specificationForm.labelArabic}
                                    onChange={(e) =>
                                      setSpecificationForm({ ...specificationForm, labelArabic: e.target.value })
                                    }
                                    dir="rtl"
                                    placeholder="e.g., المادة"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Value (English)</Label>
                                  <Input
                                    value={specificationForm.valueEnglish}
                                    onChange={(e) =>
                                      setSpecificationForm({ ...specificationForm, valueEnglish: e.target.value })
                                    }
                                    placeholder="e.g., 100% Cotton"
                                  />
                                </div>
                                <div>
                                  <Label>Value (Arabic)</Label>
                                  <Input
                                    value={specificationForm.valueArabic}
                                    onChange={(e) =>
                                      setSpecificationForm({ ...specificationForm, valueArabic: e.target.value })
                                    }
                                    dir="rtl"
                                    placeholder="e.g., قطن 100%"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={specificationForm.isActive}
                                  onCheckedChange={(v) =>
                                    setSpecificationForm({ ...specificationForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setSpecificationDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSpecificationSubmit}>
                                {editingId ? "Update" : "Create"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {productSpecifications.map((spec) => (
                          <div
                            key={spec.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="text-sm">
                              <span className="font-medium">{spec.labelEnglish}:</span>{" "}
                              <span className="text-gray-600">{spec.valueEnglish}</span>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpecificationEdit(spec)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpecificationDelete(spec.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productSpecifications.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No specifications added
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Care Instructions Tab */}
                    <TabsContent value="care" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {productCareInstructions.length} instructions
                        </span>
                        <Dialog open={careInstructionDialogOpen} onOpenChange={setCareInstructionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetCareInstructionForm}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingId ? "Edit Care Instruction" : "Add Care Instruction"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Instruction (English)</Label>
                                <Textarea
                                  value={careInstructionForm.instructionEnglish}
                                  onChange={(e) =>
                                    setCareInstructionForm({ ...careInstructionForm, instructionEnglish: e.target.value })
                                  }
                                  placeholder="e.g., Machine wash cold"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label>Instruction (Arabic)</Label>
                                <Textarea
                                  value={careInstructionForm.instructionArabic}
                                  onChange={(e) =>
                                    setCareInstructionForm({ ...careInstructionForm, instructionArabic: e.target.value })
                                  }
                                  dir="rtl"
                                  placeholder="e.g., غسيل آلي بالماء البارد"
                                  rows={2}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={careInstructionForm.isActive}
                                  onCheckedChange={(v) =>
                                    setCareInstructionForm({ ...careInstructionForm, isActive: v })
                                  }
                                />
                                <Label>Active</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setCareInstructionDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleCareInstructionSubmit}>
                                {editingId ? "Update" : "Create"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {productCareInstructions.map((instruction) => (
                          <div
                            key={instruction.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{instruction.instructionEnglish}</span>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCareInstructionEdit(instruction)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCareInstructionDelete(instruction.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {productCareInstructions.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No care instructions added
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a product to manage its details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;
